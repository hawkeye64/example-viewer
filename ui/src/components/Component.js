import { QBadge } from 'quasar'

export default {
  name: 'ExampleViewer',

  render (h) {
    return h(QBadge, {
      staticClass: 'ExampleViewer',
      props: {
        label: 'ExampleViewer'
      }
    })
  }
}
