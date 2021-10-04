import ExampleViewer, { setDefaults } from './components/ExampleViewer.js'

import { version } from './version'

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
