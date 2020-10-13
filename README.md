![quasar-ui-example-viewer](https://img.shields.io/npm/v/quasar-ui-example-viewer.svg?label=quasar-ui-example-viewer)
![quasar-app-extension-example-viewer](https://img.shields.io/npm/v/quasar-app-extension-example-viewer.svg?label=quasar-app-extension-example-viewer)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/hawkeye64/example-viewer.svg)]()
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/hawkeye64/example-viewer.svg)]()

# Example Viewer
The Example Viewer component will show output of a Vue SFC (single file component). On the component's top toolbar, it has links to the Github repo, Codepen and View Sources.

![example-viewer showing QCalendar (week view)](https://raw.githubusercontent.com/hawkeye64/example-viewer/master/images/example-viewer--QCalendar-week-view.png)

When View Sources is clicked, you will get tabs for each section of a Vue SFC (single file component) file. This also includes a "copy to clipboard" icon.

![example-viewer showing QCalendar (week view)](https://raw.githubusercontent.com/hawkeye64/example-viewer/master/images/example-viewer--QCalendar-week-view--template.png)

![example-viewer showing QCalendar (week view)](https://raw.githubusercontent.com/hawkeye64/example-viewer/master/images/example-viewer--QCalendar-week-view--script.png)

# Necessary
In order for this to work with a TOC, you need to make sure you have a couple of things in place:

1. Your app must be using `vueRouterMode: 'history'` (quasar.conf.js)
2. In `/router/index.js` change:
```js
    scrollBehavior: () => ({ x: 0, y: 0 }),`
```
to this:
```js
    scrollBehavior: function(to, from, savedPosition) {
      if (to.hash) {
          return {selector: to.hash}
      } else {
          return { x: 0, y: 0 }
      }
    },
```
or better, to this:
```js
    scrollBehavior (to, _, savedPosition) {
      return new Promise(resolve => {
        setTimeout(() => {
          if (to.hash !== void 0 && to.hash !== '') {
            const el = document.getElementById(to.hash.substring(1))

            if (el !== null) {
              resolve({ x: 0, y: el.offsetTop - el.scrollHeight })
              return
            }
          }

          resolve(savedPosition || { x: 0, y: 0 })
        }, 100)
      })
    },
```
# Dependencies

ExampleViewer has dependencies on `@quasar/qmarkdown` and `@quasar/qribbon`. Please install them into your Quasar project with the following:

```bash
quasar ext add @quasar/qmarkdown
quasar ext add @quasar/qribbon
```

If you use something other than the @quasar/cli, then install as appropriate for your system. You will need to install the UI compnent of these dependendies. They are `@quasar/quasar-ui-qmarkdown` and `@quasar/quasar-ui-qribbon`.

# Structure

* [/ui](ui) - standalone npm package (read this one for more info)
* [/app-extension](app-extension) - Quasar app extension

# Donate
If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>
