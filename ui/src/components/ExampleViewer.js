import {
  QBtn,
  QCard,
  QCardSection,
  QSeparator,
  QSlideTransition,
  QSpace,
  QTab,
  QTabs,
  QTabPanel,
  QTabPanels,
  QToolbar,
  QToolbarTitle,
  QTooltip,
  openURL
} from 'quasar'

import { QRibbon } from '@quasar/quasar-ui-qribbon'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import { slugify } from '../utils/pageUtils'

export default {
  name: 'ExampleViewer',

  props: {
    title: {
      type: String,
      required: true
    },
    file: {
      type: String,
      required: true,
      validator: v => v.length > 0
    },
    tooltipLabel: {
      type: String,
      default: 'View sources'
    },
    ribbonColor: {
      type: String,
      default: '#c0c0c0'
    },
    ribbonTextColor: {
      type: String,
      default: 'rgb(0,0,0,.58)'
    },
    ribbonLeafColor: {
      type: String,
      default: '#a0a0a0'
    },
    githubUrl: String,
    noEdit: Boolean
  },

  data () {
    return {
      component: null,
      tabs: [],
      currentTab: 'template',
      parts: {},
      expanded: false
    }
  },

  mounted () {
    import(
      /* webpackChunkName: "example" */
      /* webpackMode: "lazy-once" */
      `pages/${this.file}.vue`
    ).then(comp => {
      this.component = comp.default

      import(
        /* webpackChunkName: "example-source" */
        /* webpackMode: "lazy-once" */
        `!raw-loader!pages/${this.file}.vue`
      ).then(comp => {
        this.parseComponent(comp.default)
      })
    })
  },

  computed: {
    slugifiedTitle () {
      return this.slugify(this.title)
    }
  },

  watch: {
    expanded (val) {
      console.log('expanded:', val)
    }
  },

  methods: {
    slugify,

    copyHeading () {
      // const text = window.location.origin + window.location.pathname + '#' + this.slugifiedTitle

      // var textArea = document.createElement('textarea')
      // textArea.className = 'fixed-top'
      // textArea.value = text
      // document.body.appendChild(textArea)
      // textArea.focus()
      // textArea.select()

      // document.execCommand('copy')
      // document.body.removeChild(textArea)

      // this.$q.notify({
      //   message: 'Anchor has been copied to clipboard.',
      //   color: 'white',
      //   textColor: 'primary',
      //   icon: 'done',
      //   position: 'top',
      //   timeout: 2000
      // })
    },

    parseComponent (comp) {
      const
        template = this.parseTemplate('template', comp),
        script = this.parseTemplate('script', comp),
        style = this.parseTemplate('style', comp)

      this.parts = {
        template,
        script,
        style
      }
      this.tabs = ['template', 'script', 'style'].filter(type => this.parts[type])
    },

    parseTemplate (target, template) {
      const
        string = `(<${target}(.*)?>[\\w\\W]*<\\/${target}>)`,
        regex = new RegExp(string, 'g'),
        parsed = regex.exec(template) || []

      return parsed[1] || ''
    },

    openGitHub () {
      openURL(`${githubUrl}/${this.file}.vue`)
    },

    openCodepen () {
      // this.$refs.codepen.open(this.parts)
    },

    __renderRibbon (h) {
      return h(QRibbon, {
        props: {
          position: 'left',
          color: this.ribbonTextColor,
          backgroundColor: this.ribbonColor,
          leafColor: this.ribbonLeafColor,
          leafPosition: 'bottom',
          decoration: 'rounded-out'
        }
      }, [
        h(QToolbarTitle, {
          staticClass: 'example-title',
          on: {
            click: this.copyHeading
          }
        }, [
          h('span', {
            staticClass: 'ellipsis'
          }, this.title)
        ])
      ])
    },

    __renderToolbar (h) {
      return h(QToolbar, [
        this.__renderRibbon(h),
        h(QSpace),
        h('div', {
          staticClass: 'col-auto'
        }, [
          this.githubUrl && h(QBtn, {
            props: {
              dense: true,
              flat: true,
              round: true,
              icon: 'fab fa-github'
            },
            on: {
              click: this.openGitHub
            }
          }),
          this.noEdit !== true && h(QBtn, {
            props: {
              dense: true,
              flat: true,
              round: true,
              icon: 'fab fa-codepen'
            },
            on: {
              click: this.openCodepen
            }
          }),
          h(QBtn, {
            props: {
              dense: true,
              flat: true,
              round: true,
              icon: 'code'
            },
            on: {
              click: v => { this.expanded = !this.expanded }
            }
          }, [
            h(QTooltip, this.tooltipLabel)
          ])
        ])
      ])
    },

    __renderTabs (h) {
      return h(QTabs, {
        props: {
          value: this.currentTab,
          align: 'left',
          activeColor: this.$q.dark.isActive ? 'amber' : void 0,
          indicatorColor: this.$q.dark.isActive ? 'amber' : 'primary',
          dense: true,
          breakpoint: 0
        },
        on: {
          input: v => { this.currentTab = v }
        }
      }, [
        ...Object.keys(this.tabs).map(tab => h(QTab, {
          key: `tab-${this.tabs[tab]}`,
          props: {
            name: this.tabs[tab],
            label: this.tabs[tab]
          }
        }))
      ])
    },

    __renderTabPanel (h) {
      const type = {}
      type.style = '```css\n'
      type.template = '```html\n'
      type.script = '```js\n'
      const end = '\n```'

      return [ ...Object.keys(this.tabs).map(tab => h(QTabPanel, {
        key: `panel-${this.tabs[tab]}`,
        staticClass: 'q-pa-none',
        props: {
          name: this.tabs[tab]
        }
      }, [
        h(QMarkdown, {
          staticClass: ''
        }, [
          `${type[this.tabs[tab]]}${this.parts[this.tabs[tab]]}${end}`
        ])
      ]))]
    },

    __renderTabPanels (h) {
      return h(QTabPanels, {
        props: {
          value: this.currentTab,
          animated: true
        },
        on: {
          input: v => { this.currentTab = v }
        }
      }, [
        this.__renderTabPanel(h)
      ])
    },

    __renderInnerCard (h) {
      return h(QCard, [
        this.__renderTabs(h),
        this.__renderTabPanels(h)
      ])
    },

    __renderExpansionItem (h) {
      return this.expanded && h('div', {
      }, [
        this.__renderInnerCard(h)
      ])
    },

    __renderComponent (h) {
      return h(QSlideTransition, [
        h('div', {
          staticClass: 'row'
        }, [
          h(this.component, {
            staticClass: 'col'
          })
        ])
      ])
    },

    __renderCard (h) {
      const slot = this.$scopedSlots.default

      return h(QCard, {
        staticClass: 'no-shadow',
        props: {
          flat: true,
          bordered: true,
        }
      }, [
        this.__renderToolbar(h),
        h(QSeparator),
        this.__renderExpansionItem(h),
        h(QCardSection, [
          this.__renderComponent(h)
        ])
      ])
    }
  },

  render (h) {
    return h('section', {
      id: this.slugifiedTitle,
      staticClass: 'q-pa-md overflow-auto'
    }, [
      this.__renderCard(h)
    ])
  }
}
