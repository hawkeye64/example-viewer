import { boot } from 'quasar/wrappers'
import VuePlugin from 'quasar-ui-example-viewer'

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.use(VuePlugin)
})
