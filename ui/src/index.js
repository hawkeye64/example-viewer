import { version } from '../package.json'
import ExampleViewer, { setDefaults } from './components/ExampleViewer.js'

export {
  version,
  ExampleViewer,
  setDefaults
}

export default {
  version,
  ExampleViewer,
  setDefaults,

  install (Vue) {
    Vue.component(ExampleViewer.name, ExampleViewer)
  }
}
