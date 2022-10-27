import mjml2html, { components, assignComponents } from '../../mjml-core/src'
import { dependencies, assignDependencies } from '../../mjml-validator/src'
import presetCore from '../../mjml-preset-core/src'

assignComponents(components, presetCore.components)
assignDependencies(dependencies, presetCore.dependencies)

export default mjml2html
