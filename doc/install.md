# Installation

You can install MJML with NPM to use it with NodeJS or the Command Line Interface. If you're not sure what those are,
head over to <a href="#usage">Usage</a> for other ways to use MJML.

```bash
npm install mjml
```

# Development

To work on MJML, make changes and create merge requests, download and
install [yarn](https://yarnpkg.com/lang/en/docs/install/) for easy development.

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

For more information, check the [Tooling](#tooling) section.  
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

option                  | unit      | description                                                                                                                                               | default value
----------------------- |---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |---------------
fonts                   | object    | Default fonts imported in the HTML rendered by MJML                                                                                                       | See in [index.js](https://github.com/mjmlio/mjml/blob/master/packages/mjml-core/src/index.js#L100-L108)
keepComments            | boolean   | Option to keep comments in the HTML output                                                                                                                | true
validationLevel         | string    | Available values for the [validator](https://github.com/mjmlio/mjml/tree/master/packages/mjml-validator#validating-mjml): 'strict', 'soft', 'skip'        | 'soft'
filePath                | string    | Full path of the specified file to use when resolving paths from [`mj-include` components](#mj-include)                                                   | '.'
juicePreserveTags       | boolean   | Optional setting when inlining css, see [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) for more info    | NA

## API

A free-to-use MJML API is available to make it easy to integrate MJML in your application. Head
over [here](https://mjml.io/api) to learn more about the API.
