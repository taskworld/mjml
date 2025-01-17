import { Parser } from 'htmlparser2'

import { isObject, findLastIndex, find } from 'lodash'
import { filter, map, flow } from 'lodash/fp'

import cleanNode from './helpers/cleanNode'
import convertBooleansOnAttrs from './helpers/convertBooleansOnAttrs'
import setEmptyAttributes from './helpers/setEmptyAttributes'

const isNode = require('detect-node')

const indexesForNewLine = (xml) => {
  const regex = /\n/gi
  const indexes = [0]

  while (regex.exec(xml)) {
    indexes.push(regex.lastIndex)
  }

  return indexes
}

const isSelfClosing = (indexes, parser) =>
  indexes.startIndex === parser.startIndex &&
  indexes.endIndex === parser.endIndex

export default function MJMLParser(xml, options = {}, includedIn = []) {
  const {
    addEmptyAttributes = true,
    components = {},
    convertBooleans = true,
    keepComments = true,
    filePath = '.',
    actualPath = '.',
    ignoreIncludes = false,
    preprocessors = [],
  } = options

  const endingTags = flow(
    filter((component) => component.endingTag),
    map((component) => component.getTagName()),
  )({ ...components })

  let mjml = null
  let cur = null
  let inInclude = !!includedIn.length
  let inEndingTag = 0
  const cssIncludes = []
  const currentEndingTagIndexes = { startIndex: 0, endIndex: 0 }

  const lineIndexes = indexesForNewLine(xml)

  const parser = new Parser(
    {
      onopentag: (name, attrs) => {
        const isAnEndingTag = endingTags.indexOf(name) !== -1

        if (inEndingTag > 0) {
          if (isAnEndingTag) inEndingTag += 1
          return
        }

        if (isAnEndingTag) {
          inEndingTag += 1

          if (inEndingTag === 1) {
            // we're entering endingTag
            currentEndingTagIndexes.startIndex = parser.startIndex
            currentEndingTagIndexes.endIndex = parser.endIndex
          }
        }

        const line =
          findLastIndex(lineIndexes, (i) => i <= parser.startIndex) + 1

        if (name === 'mj-include') {
          if (ignoreIncludes || !isNode) return

          if (attrs.type === 'css' || attrs.type === 'html') {
            // Disable this feature as it does not work on a web browser
            // handleCssHtmlInclude(decodeURIComponent(attrs.path), attrs, line)
            return
          }

          inInclude = true
          // Disable this feature as it does not work on a web browser
          // handleInclude(decodeURIComponent(attrs.path), line)
          return
        }

        if (convertBooleans) {
          // "true" and "false" will be converted to bools
          attrs = convertBooleansOnAttrs(attrs)
        }

        const newNode = {
          file: actualPath,
          absoluteFilePath: actualPath,
          line,
          includedIn,
          parent: cur,
          tagName: name,
          attributes: attrs,
          children: [],
        }

        if (cur) {
          cur.children.push(newNode)
        } else {
          mjml = newNode
        }

        cur = newNode
      },
      onclosetag: (name) => {
        if (endingTags.indexOf(name) !== -1) {
          inEndingTag -= 1

          if (!inEndingTag) {
            // we're getting out of endingTag
            // if self-closing tag we don't get the content
            if (!isSelfClosing(currentEndingTagIndexes, parser)) {
              const partialVal = xml
                .substring(
                  currentEndingTagIndexes.endIndex + 1,
                  parser.endIndex,
                )
                .trim()
              const val = partialVal.substring(
                0,
                partialVal.lastIndexOf(`</${name}`),
              )

              if (val) cur.content = val.trim()
            }
          }
        }

        if (inEndingTag > 0) return

        if (inInclude) {
          inInclude = false
        }

        // for includes, setting cur is handled in handleInclude because when there is
        // only mj-head in include it doesn't create any elements, so setting back to parent is wrong
        if (name !== 'mj-include') cur = (cur && cur.parent) || null
      },
      ontext: (text) => {
        if (inEndingTag > 0) return

        if (text && text.trim() && cur) {
          cur.content = `${(cur && cur.content) || ''}${text.trim()}`.trim()
        }
      },
      oncomment: (data) => {
        if (inEndingTag > 0) return

        if (cur && keepComments) {
          cur.children.push({
            line: findLastIndex(lineIndexes, (i) => i <= parser.startIndex) + 1,
            tagName: 'mj-raw',
            content: `<!-- ${data.trim()} -->`,
            includedIn,
          })
        }
      },
    },
    {
      recognizeCDATA: true,
      decodeEntities: false,
      recognizeSelfClosing: true,
      lowerCaseAttributeNames: false,
    },
  )

  // Apply preprocessors to raw xml
  xml = flow(preprocessors)(xml)

  parser.write(xml)
  parser.end()

  if (!isObject(mjml)) {
    throw new Error('Parsing failed. Check your mjml.')
  }

  cleanNode(mjml)

  // Assign "attributes" property if not set
  if (addEmptyAttributes) {
    setEmptyAttributes(mjml)
  }

  if (cssIncludes.length) {
    const head = find(mjml.children, { tagName: 'mj-head' })

    if (head) {
      if (head.children) {
        head.children = [...head.children, ...cssIncludes]
      } else {
        head.children = cssIncludes
      }
    } else {
      mjml.children.push({
        file: filePath,
        line: 0,
        tagName: 'mj-head',
        children: cssIncludes,
      })
    }
  }

  return mjml
}
