This is a forked version of the original https://github.com/mjmlio/mjml which can be run on both Node.js and a web browser. It has the following known limitations:
- Does not support features that require Node.js API, such as file reading.
- Does not support features involving the `.mjmlconfig` file, such as community/custom components.
- Does not support `options.skeleton`, `options.minify` and `options.beautify`.
- Does not support `mj-include` tags.
- Does not have backward compatibility with MJML 3.

# MJML 4

If you're looking for MJML 3.3.X check [this branch](https://github.com/mjmlio/mjml/tree/3.3.x)

<p style="text-align: center;" >
  <a href="https://mjml.io" target="_blank">
    <img width="250"src="https://mjml.io/assets/img/litmus/mjmlbymailjet.png">

  </a>
</p>

<p style="text-align: center;" >
  <a href="https://github.com/mjmlio/mjml/actions">
    <img src="https://github.com/mjmlio/mjml/workflows/Mjml%20CI/badge.svg?branch=master" alt="github actions">
  </a>
  <a href="https://www.codacy.com/app/gbadi/mjml">
    <img src="https://api.codacy.com/project/badge/grade/575339cb861f4ff4b0dbb3f9e1759c35"/>
  </a>
</p>


<p style="text-align: center;" >
  | <b><a href="#translated-documentation">Translated documentation</a></b>
  | <b><a href="#introduction">Introduction</a></b>
  | <b><a href="#installation">Installation</a></b>
  | <b><a href="#usage">Usage</a></b> |
</p>

---
# Translated documentation

| Language | Link for documentation |
| :-: | :-: |
| 日本語 | [日本語ドキュメント](https://github.com/mjmlio/mjml/blob/master/readme-ja.md) |

# Introduction

`MJML` is a markup language created by [Mailjet](https://www.mailjet.com/) and designed to reduce the pain of coding a responsive email. Its semantic syntax makes the language easy and straightforward while its rich standard components library shortens your development time and lightens your email codebase. MJML’s open-source engine takes care of translating the `MJML` you wrote into responsive HTML.

<p style="text-align: center;" >
  <a href="https://mjml.io" target="_blank">
    <img width="75%" src="https://cloud.githubusercontent.com/assets/6558790/12450760/ee034178-bf85-11e5-9dda-98d0c8f9f8d6.png">
  </a>
</p>


# Installation

You can install `MJML` with `NPM` to use it with NodeJS or a web browser. If you're not sure what those are, head over to <a href="#usage">Usage</a> for other ways to use MJML.

```bash
npm install mjml
```

# Development

To work on MJML, make changes and create merge requests, download and install [yarn](https://yarnpkg.com/lang/en/docs/install/) for easy development.

```bash
git clone https://github.com/mjmlio/mjml.git && cd mjml
yarn
yarn build
```

You can also run `yarn build:watch` to rebuild the package as you code.

# Usage

## Online

Don't want to install anything? Use the free online editor!

<p style="text-align: center;" >
  <a href="https://mjml.io/try-it-live" target="_blank"><img src="https://cloud.githubusercontent.com/assets/6558790/12195421/58a40618-b5f7-11e5-9ed3-80463874ab14.png" alt="try it live" width="75%"></a>
</p>
<br>

## Applications and plugins

MJML comes with an ecosystem of tools and plugins, check out:
- The [MJML App](https://mjmlio.github.io/mjml-app/) (MJML is included)
- [Visual Studio Code plugin](https://github.com/mjmlio/vscode-mjml) (MJML is included)
- [Atom plugin](https://atom.io/users/mjmlio) (MJML needs to be installed separately)
- [Sublime Text plugin](https://packagecontrol.io/packages/MJML-syntax) (MJML needs to be installed separately)

For more tools, check the [Community](https://mjml.io/community) page.

## Inside Node.js

```javascript
import mjml2html from 'mjml'

/*
  Compile an mjml string
*/
const htmlOutput = mjml2html(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>
            Hello World!
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`, options)


/*
  Print the responsive HTML generated and MJML errors if any
*/
console.log(htmlOutput)
```

You can pass optional `options` as an object to the `mjml2html` function:

option   | unit   | description  | default value
-------------|--------|--------------|---------------
fonts  | object | Default fonts imported in the HTML rendered by MJML | See in [index.js](https://github.com/mjmlio/mjml/blob/master/packages/mjml-core/src/index.js#L100-L108)
keepComments | boolean | Option to keep comments in the HTML output | true
validationLevel | string | Available values for the [validator](https://github.com/mjmlio/mjml/tree/master/packages/mjml-validator#validating-mjml): 'strict', 'soft', 'skip'  | 'soft'
filePath | string | Path of file, used for relative paths in mj-includes | '.'
preprocessors | array of functions | Preprocessors applied to the xml before parsing. Input must be xml, not json. Functions must be (xml: string) => string | []
juicePreserveTags | Preserve some tags when inlining css, see [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) for more info | NA

## API

A free-to-use MJML API is available to make it easy to integrate MJML in your application. Head over [here](https://mjml.io/api) to learn more about the API.

# MJML Slack

MJML wouldn't be as cool without its amazing community. Head over the [Community Slack](https://join.slack.com/t/mjml/shared_invite/zt-gqmwfwmr-kPBnfuuB7wof5httaTcXxg) to meet fellow MJML'ers.

# Contributors

- [Maxime](https://github.com/iRyusa)
- [Nicolas](https://github.com/ngarnier)
- [Cedric](https://github.com/kmcb777)
- [Loeck](https://github.com/lohek)
- [Robin](https://github.com/robink)
- [Guillaume](https://github.com/GuillaumeBadi)
- [Meriadec](https://github.com/meriadec)
- [Arnaud](https://github.com/arnaudbreton)
- [HTeuMeuLeu](https://github.com/hteumeuleu)
- [Emmanuel Payet](https://github.com/epayet)
- [Matthieu](https://github.com/swibge)
- [Rogier](https://github.com/rogierslag)
