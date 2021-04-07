/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

function extendConf (conf) {
  // register our boot file
  conf.boot.push('~quasar-app-extension-example-viewer/src/boot/register.js')

  // make sure app extension files & ui packages get transpiled
  conf.build.transpileDependencies.push(/quasar-app-extension-example-viewer[\\/]src/)
  conf.build.transpileDependencies.push(/quasar-ui-example-viewer[\\/]src/)

  // make sure the stylesheet goes through webpack to avoid SSR issues
  conf.css.push('~quasar-ui-example-viewer/src/index.sass')
}

module.exports = function (api) {
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  api.compatibleWith('quasar', '^2.0.0-alpha.1')
  api.compatibleWith('@quasar/app', '^3.0.0-alpha.1')

  // Uncomment the line below if you provide a JSON API for your component
  // api.registerDescribeApi('ExampleViewer', '~quasar-ui-example-viewer/src/components/ExampleViewer.json')

  // We extend /quasar.conf.js
  api.extendQuasarConf(extendConf)
}
