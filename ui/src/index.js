import ExampleViewer, { setDefaults } from './components/ExampleViewer.js'
import pkg from '../package.json'
const { version } = pkg

export {
  version,
  ExampleViewer,
  setDefaults
}

export default {
  version,
  ExampleViewer,
  setDefaults,

  install (app) {
    app.component(ExampleViewer.name, ExampleViewer)
  }
}
