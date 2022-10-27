import {
  find,
  filter,
  get,
  identity,
  map,
  omit,
  reduce,
  isObject,
  each,
  isEmpty,
} from 'lodash'
import juice from 'juice'
import cheerio from 'cheerio'

import MJMLParser from '../../mjml-parser-xml/src'
import MJMLValidator, {
  dependencies as globalDependencies,
  assignDependencies,
} from '../../mjml-validator/src'

import { initComponent } from './createComponent'
import globalComponents, {
  registerComponent,
  assignComponents,
} from './components'

import makeLowerBreakpoint from './helpers/makeLowerBreakpoint'
import suffixCssClasses from './helpers/suffixCssClasses'
import mergeOutlookConditionnals from './helpers/mergeOutlookConditionnals'
import minifyOutlookConditionnals from './helpers/minifyOutlookConditionnals'
import defaultSkeleton from './helpers/skeleton'
import { initializeType } from './types/type'

const isNode = require('detect-node')

class ValidationError extends Error {
  constructor(message, errors) {
    super(message)

    this.errors = errors
  }
}

export default function mjml2html(mjml, options = {}) {
  let content = ''
  let errors = []

  if (isNode && typeof options.skeleton === 'string') {
    throw new Error('options.skeleton is not supported in this forked version of MJML')
  }

  const mjmlConfigOptions = {}
  const confPreprocessors = []

  const {
    beautify = false,
    fonts = {
      'Open Sans':
        'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700',
      'Droid Sans':
        'https://fonts.googleapis.com/css?family=Droid+Sans:300,400,500,700',
      Lato: 'https://fonts.googleapis.com/css?family=Lato:300,400,500,700',
      Roboto: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      Ubuntu: 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700',
    },
    keepComments,
    minify = false,
    ignoreIncludes = true,
    juiceOptions = {},
    juicePreserveTags = null,
    skeleton = defaultSkeleton,
    validationLevel = 'soft',
    filePath = '.',
    actualPath = '.',
    preprocessors,
    presets = [],
  } = {
    ...mjmlConfigOptions,
    ...options,
    preprocessors: options.preprocessors
      ? [...confPreprocessors, ...options.preprocessors]
      : confPreprocessors,
  }

  const components = { ...globalComponents }
  const dependencies = assignDependencies({}, globalDependencies)
  for (const preset of presets) {
    assignComponents(components, preset.components)
    assignDependencies(dependencies, preset.dependencies)
  }

  if (typeof mjml === 'string') {
    mjml = MJMLParser(mjml, {
      keepComments,
      components,
      filePath,
      actualPath,
      preprocessors,
      ignoreIncludes,
    })
  }

  const globalData = {
    backgroundColor: '',
    beforeDoctype: '',
    breakpoint: '480px',
    classes: {},
    classesDefault: {},
    defaultAttributes: {},
    htmlAttributes: {},
    fonts,
    inlineStyle: [],
    headStyle: {},
    componentsHeadStyle: [],
    headRaw: [],
    mediaQueries: {},
    preview: '',
    style: [],
    title: '',
    forceOWADesktop: get(mjml, 'attributes.owa', 'mobile') === 'desktop',
    lang: get(mjml, 'attributes.lang'),
    dir: get(mjml, 'attributes.dir'),
  }

  const validatorOptions = {
    components,
    dependencies,
    initializeType,
  }

  switch (validationLevel) {
    case 'skip':
      break

    case 'strict':
      errors = MJMLValidator(mjml, validatorOptions)

      if (errors.length > 0) {
        throw new ValidationError(
          `ValidationError: \n ${errors
            .map(e => e.formattedMessage)
            .join('\n')}`,
          errors,
        )
      }
      break

    case 'soft':
    default:
      errors = MJMLValidator(mjml, validatorOptions)
      break
  }

  const mjBody = find(mjml.children, { tagName: 'mj-body' })
  const mjHead = find(mjml.children, { tagName: 'mj-head' })
  const mjOutsideRaws = filter(mjml.children, { tagName: 'mj-raw' })

  const processing = (node, context, parseMJML = identity) => {
    if (!node) {
      return
    }

    const component = initComponent({
      name: node.tagName,
      initialDatas: {
        ...parseMJML(node),
        context,
      },
    })

    if (component !== null) {
      if ('handler' in component) {
        return component.handler() // eslint-disable-line consistent-return
      }

      if ('render' in component) {
        return component.render() // eslint-disable-line consistent-return
      }
    }
  }

  const applyAttributes = mjml => {
    const parse = (mjml, parentMjClass = '') => {
      const { attributes, tagName, children } = mjml
      const classes = get(mjml.attributes, 'mj-class', '').split(' ')
      const attributesClasses = reduce(
        classes,
        (acc, value) => {
          const mjClassValues = globalData.classes[value]
          let multipleClasses = {}
          if (acc['css-class'] && get(mjClassValues, 'css-class')) {
            multipleClasses = {
              'css-class': `${acc['css-class']} ${mjClassValues['css-class']}`,
            }
          }

          return {
            ...acc,
            ...mjClassValues,
            ...multipleClasses,
          }
        },
        {},
      )

      const defaultAttributesForClasses = reduce(
        parentMjClass.split(' '),
        (acc, value) => ({
          ...acc,
          ...get(globalData.classesDefault, `${value}.${tagName}`),
        }),
        {},
      )
      const nextParentMjClass = get(attributes, 'mj-class', parentMjClass)

      return {
        ...mjml,
        attributes: {
          ...globalData.defaultAttributes[tagName],
          ...attributesClasses,
          ...defaultAttributesForClasses,
          ...omit(attributes, ['mj-class']),
        },
        globalAttributes: {
          ...globalData.defaultAttributes['mj-all'],
        },
        children: map(children, mjml => parse(mjml, nextParentMjClass)),
      }
    }

    return parse(mjml)
  }

  const bodyHelpers = {
    components,
    globalData,
    addMediaQuery(className, { parsedWidth, unit }) {
      globalData.mediaQueries[
        className
      ] = `{ width:${parsedWidth}${unit} !important; max-width: ${parsedWidth}${unit}; }`
    },
    addHeadStyle(identifier, headStyle) {
      globalData.headStyle[identifier] = headStyle
    },
    addComponentHeadSyle(headStyle) {
      globalData.componentsHeadStyle.push(headStyle)
    },
    setBackgroundColor: color => {
      globalData.backgroundColor = color
    },
    processing: (node, context) => processing(node, context, applyAttributes),
  }

  const headHelpers = {
    components,
    globalData,
    add(attr, ...params) {
      if (Array.isArray(globalData[attr])) {
        globalData[attr].push(...params)
      } else if (Object.prototype.hasOwnProperty.call(globalData, attr)) {
        if (params.length > 1) {
          if (isObject(globalData[attr][params[0]])) {
            globalData[attr][params[0]] = {
              ...globalData[attr][params[0]],
              ...params[1],
            }
          } else {
            // eslint-disable-next-line prefer-destructuring
            globalData[attr][params[0]] = params[1]
          }
        } else {
          // eslint-disable-next-line prefer-destructuring
          globalData[attr] = params[0]
        }
      } else {
        throw Error(
          `An mj-head element add an unkown head attribute : ${attr} with params ${
            Array.isArray(params) ? params.join('') : params
          }`,
        )
      }
    },
  }

  globalData.headRaw = processing(mjHead, headHelpers)

  content = processing(mjBody, bodyHelpers, applyAttributes)

  if (!content) {
    throw new Error(
      'Malformed MJML. Check that your structure is correct and enclosed in <mjml> tags.',
    )
  }

  content = minifyOutlookConditionnals(content)

  if (mjOutsideRaws.length) {
    const toAddBeforeDoctype = mjOutsideRaws.filter(
      elt =>
        elt.attributes.position && elt.attributes.position === 'file-start',
    )
    if (toAddBeforeDoctype.length) {
      globalData.beforeDoctype = toAddBeforeDoctype
        .map(elt => elt.content)
        .join('\n')
    }
  }

  if (!isEmpty(globalData.htmlAttributes)) {
    const $ = cheerio.load(content, {
      xmlMode: true, // otherwise it may move contents that aren't in any tag
      decodeEntities: false, // won't escape special characters
    })

    each(globalData.htmlAttributes, (data, selector) => {
      each(data, (value, attrName) => {
        $(selector).each(function getAttr() {
          $(this).attr(attrName, value || '')
        })
      })
    })

    content = $.root().html()
  }

  content = skeleton({
    content,
    ...globalData,
  })

  if (globalData.inlineStyle.length > 0) {
    if (juicePreserveTags) {
      each(juicePreserveTags, (val, key) => {
        juice.codeBlocks[key] = val
      })
    }

    content = juice(content, {
      applyStyleTags: false,
      extraCss: globalData.inlineStyle.join(''),
      insertPreservedExtraCss: false,
      removeStyleTags: false,
      ...juiceOptions,
    })
  }

  content = mergeOutlookConditionnals(content)

  if (beautify) {
    throw new Error('options.beautify is not supported in this forked version of MJML')
  }

  if (minify) {
    throw new Error('options.minify is not supported in this forked version of MJML')
  }

  return {
    html: content,
    json: mjml,
    errors,
  }
}

export {
  globalComponents as components,
  initComponent,
  registerComponent,
  assignComponents,
  makeLowerBreakpoint,
  suffixCssClasses,
  initializeType,
}

export { BodyComponent, HeadComponent } from './createComponent'
