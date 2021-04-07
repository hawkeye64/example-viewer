# Component ExampleViewer

[![npm](https://img.shields.io/npm/v/quasar-ui-example-viewer.svg?label=quasar-ui-example-viewer)](https://www.npmjs.com/package/quasar-ui-example-viewer)
[![npm](https://img.shields.io/npm/dt/quasar-ui-example-viewer.svg)](https://www.npmjs.com/package/quasar-ui-example-viewer)

# Example Viewer
The Example Viewer component will show output of a Vue SFC (single file component). On the component's top toolbar, it has links to the Github repo, Codepen and View Sources.

![example-viewer showing QCalendar (week view)](https://raw.githubusercontent.com/hawkeye64/example-viewer/master/images/example-viewer--QCalendar-week-view.png)

When View Sources is clicked, you will get tabs for each section of a Vue SFC (single file component) file. This also includes a "copy to clipboard" icon.

![example-viewer showing QCalendar (week view)](https://raw.githubusercontent.com/hawkeye64/example-viewer/master/images/example-viewer--QCalendar-week-view--template.png)

![example-viewer showing QCalendar (week view)](https://raw.githubusercontent.com/hawkeye64/example-viewer/master/images/example-viewer--QCalendar-week-view--script.png)


# Usage

## Quasar CLI project

Install the [App Extension](../app-extension).

**OR**:

Create and register a boot file:

```js
import Vue from 'vue'
import Plugin from 'quasar-ui-example-viewer'
import 'quasar-ui-example-viewer/dist/index.css'

Vue.use(Plugin)
```

**OR**:

```html
<style src="quasar-ui-example-viewer/dist/index.css"></style>

<script>
import { ExampleViewer } from 'quasar-ui-example-viewer'

export default {
  components: {
    ExampleViewer
  }
}
</script>
```

## Vue CLI project

```js
import Vue from 'vue'
import Plugin from 'quasar-ui-example-viewer'
import 'quasar-ui-example-viewer/dist/index.css'

Vue.use(Plugin)
```

**OR**:

```html
<style src="quasar-ui-example-viewer/dist/index.css"></style>

<script>
import { ExampleViewer } from 'quasar-ui-example-viewer'

export default {
  components: {
    ExampleViewer
  }
}
</script>
```

## UMD variant

Exports `window.ExampleViewer`.

Add the following tag(s) after the Quasar ones:

```html
<head>
  <!-- AFTER the Quasar stylesheet tags: -->
  <link href="https://cdn.jsdelivr.net/npm/quasar-ui-example-viewer@next/dist/index.min.css" rel="stylesheet" type="text/css">
</head>
<body>
  <!-- at end of body, AFTER Quasar script(s): -->
  <script src="https://cdn.jsdelivr.net/npm/quasar-ui-example-viewer@next/dist/index.umd.min.js"></script>
</body>
```
If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):
```html
<link href="https://cdn.jsdelivr.net/npm/quasar-ui-example-viewer@next/dist/index.rtl.min.css" rel="stylesheet" type="text/css">
```
# Alias
You will need a webpack alias called "examples". This is the folder needed by the Example Viewer to find the Vue files that will be used.

Here is an example for `quasar.conf.js`:

```js
  chainWebpack (chain) {
    chain.resolve.alias.merge({
      examples: path.resolve(__dirname, './src/examples')
    })
  }
```

# Defaults
Instead of passing `locationUrl`, `jsPaths` and `cssPaths` each time the component is used, you can now set defaults:

```js
import ExampleViewer, { setDefaults } from 'quasar-ui-example-viewer/src/index.js'

setDefaults({
  locationUrl: 'https://github.com/quasarframework/quasar-ui-qcalendar/tree/next/ui/dev/src/examples',
  jsPaths: [`https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@${ version }/dist/index.umd.min.js`],
  cssPaths: [
    `https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@${ version }/dist/index.min.css`,
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.12.0/css/all.css'
  ]
})

export default boot(({ app }) => {
  app.use(ExampleViewer)
})

```

# Donate
If you appreciate the work that went into this, please consider donating to [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>
