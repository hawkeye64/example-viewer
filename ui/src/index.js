import { version } from '../package.json'
import ExampleViewer from './components/ExampleViewer'

export {
  version,
  ExampleViewer
}

export default {
  version,
  ExampleViewer,

  install (Vue) {
    Vue.component(ExampleViewer.name, ExampleViewer)
  }
}
