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
  copyToClipboard,
  openURL
} from 'quasar'

import { QRibbon } from '@quasar/quasar-ui-qribbon'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import { slugify } from '../utils/pageUtils'
import Codepen from './Codepen'

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
    locationUrl: String,
    locationIcon: {
      type: String,
      default: 'fab fa-github'
    },
    noEdit: Boolean,
    jsPaths: Array,
    cssPaths: Array,
    noCopy: Boolean,
    copyIcon: {
      type: String,
      default: 'content_copy'
    },
    copyLabel: {
      type: String,
      default: 'Copy to clipboard'
    },
    copyResponse: {
      type: String,
      default: 'Copied to clipboard'
    },
    noLineNumbers: Boolean,
    noAnchor: Boolean,
    anchorResponse: {
      type: String,
      default: 'Anchor copied to clipboard'
    }
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
      /* webpackChunkName: "examples" */
      /* webpackMode: "lazy-once" */
      `examples/${this.file}.vue`
    ).then(comp => {
      this.component = comp.default

      import(
        /* webpackChunkName: "examples-source" */
        /* webpackMode: "lazy-once" */
        `!raw-loader!examples/${this.file}.vue`
      ).then(comp => {
        this.parseComponent(comp.default)
      })
    })
  },

  computed: {
    slugifiedTitle () {
      return this.slugify('example-' + this.title)
    }
  },

  methods: {
    slugify,

    copyHeading () {
      if (this.noAnchor === true) {
        return
      }

      if (window && window.location && document) {
        const text = window.location.origin + window.location.pathname + '#' + this.slugifiedTitle
        const el = document.getElementById(this.slugifiedTitle)

        if (el) {
          el.id = ''

          window.location.hash = '#' + this.slugifiedTitle

          setTimeout(() => {
            el.id = this.slugifiedTitle
          }, 300)

          copyToClipboard(text)

          this.$q.notify({
            message: this.anchorResponse,
            color: this.$q.dark.isActive ? 'grey-10' : 'white',
            textColor: this.$q.dark.isActive ? 'amber' : 'primary',
            icon: 'done',
            position: 'top',
            timeout: 2000
          })
        }
      }
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

    openLocation () {
      openURL(`${this.locationUrl}/${this.file}.vue`)
    },

    openCodepen () {
      this.$refs.codepen.open(this.parts)
    },

    __copyTab (tab) {
      copyToClipboard(this.parts[this.tabs[tab]])

      this.$q.notify({
        message: this.copyResponse,
        color: this.$q.dark.isActive ? 'grey-10' : 'white',
        textColor: this.$q.dark.isActive ? 'amber' : 'primary',
        icon: 'done',
        position: 'top',
        timeout: 2000
      })
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
          staticClass: this.noAnchor !== true ? 'example-title' : '',
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
          this.locationUrl && h(QBtn, {
            props: {
              dense: true,
              flat: true,
              round: true,
              icon: this.locationIcon
            },
            on: {
              click: this.openLocation
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
        staticClass: 'text-caption' + (!this.$q.dark.isActive ? ' bg-grey-2 text-grey-7' : ''),
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

    __renderCopy (h, tab) {
      if (this.noCopy !== true) {
        return h(QBtn, {
          staticClass: 'absolute',
          style: {
            top: '15px',
            right: '15px'
          },
          props: {
            color: this.$q.dark.isActive ? 'amber' : 'primary',
            dense: true,
            flat: true,
            round: true,
            icon: this.copyIcon
          },
          on: {
            click: v => { this.__copyTab(tab) }
          }
        }, [
          h(QTooltip, this.copyLabel)
        ])
      }
    },

    __renderTabPanel (h) {
      const type = {}
      type.style = '```css\n'
      type.template = '```html\n'
      type.script = '```js\n'
      const end = '\n```'

      return [ ...Object.keys(this.tabs).map(tab => h(QTabPanel, {
        key: `panel-${this.tabs[tab]}`,
        staticClass: 'q-pa-none relative-position',
        props: {
          name: this.tabs[tab]
        }
      }, [
        h(QMarkdown, {
          staticClass: '',
          props: {
            noLineNumbers: this.noLineNumbers
          }
        }, [
          `${type[this.tabs[tab]]}${this.parts[this.tabs[tab]]}${end}`
        ]),
        this.__renderCopy(h, tab)
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
      return h(QSlideTransition, [
        this.expanded && h('div', {
        }, [
          this.__renderInnerCard(h)
        ])
      ])
    },

    __renderComponent (h) {
      return h('div', {
        staticClass: 'row'
      }, [
        h(this.component, {
          staticClass: 'col'
        })
      ])
    },

    __renderSlot (h, slot) {
      return h(QCardSection, [
        slot()
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
        slot ? this.__renderSlot(h, slot) : void 0,
        slot ? h(QSeparator) : void 0,
        h(QCardSection, {
          staticClass: 'no-shadow',
          style: {
            padding: 0
          }
        }, [
          this.__renderComponent(h)
        ])
      ])
    },

    __renderCodepen (h) {
      return h(Codepen, {
        ref: 'codepen',
        props: {
          title: this.title,
          slugifiedTitle: this.slugifiedTitle,
          jsPaths: this.jsPaths,
          cssPaths: this.cssPaths
        }
      })
    }
  },

  render (h) {
    return h('section', {
      staticClass: 'q-pa-md overflow-auto',
      attrs: {
        id: this.slugifiedTitle
      }
    }, [
      this.__renderCard(h),
      this.__renderCodepen(h)
    ])
  }
}
