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

const mdiGithub = 'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z'
// const mdiCodepen = 'M8.21 12L6.88 12.89V11.11L8.21 12M11.47 9.82V7.34L7.31 10.12L9.16 11.36L11.47 9.82M16.7 10.12L12.53 7.34V9.82L14.84 11.36L16.7 10.12M7.31 13.88L11.47 16.66V14.18L9.16 12.64L7.31 13.88M12.53 14.18V16.66L16.7 13.88L14.84 12.64L12.53 14.18M12 10.74L10.12 12L12 13.26L13.88 12L12 10.74M22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12M18.18 10.12C18.18 10.09 18.18 10.07 18.18 10.05L18.17 10L18.17 10L18.16 9.95C18.15 9.94 18.15 9.93 18.14 9.91L18.13 9.89L18.11 9.85L18.1 9.83L18.08 9.8L18.06 9.77L18.03 9.74L18 9.72L18 9.7L17.96 9.68L17.95 9.67L12.3 5.91C12.12 5.79 11.89 5.79 11.71 5.91L6.05 9.67L6.05 9.68L6 9.7C6 9.71 6 9.72 6 9.72L5.97 9.74L5.94 9.77L5.93 9.8L5.9 9.83L5.89 9.85L5.87 9.89L5.86 9.91L5.84 9.95L5.84 10L5.83 10L5.82 10.05C5.82 10.07 5.82 10.09 5.82 10.12V13.88C5.82 13.91 5.82 13.93 5.82 13.95L5.83 14L5.84 14L5.84 14.05C5.85 14.06 5.85 14.07 5.86 14.09L5.87 14.11L5.89 14.15L5.9 14.17L5.92 14.2L5.94 14.23C5.95 14.24 5.96 14.25 5.97 14.26L6 14.28L6 14.3L6.04 14.32L6.05 14.33L11.71 18.1C11.79 18.16 11.9 18.18 12 18.18C12.1 18.18 12.21 18.15 12.3 18.1L17.95 14.33L17.96 14.32L18 14.3L18 14.28L18.03 14.26L18.06 14.23L18.08 14.2L18.1 14.17L18.11 14.15L18.13 14.11L18.14 14.09L18.16 14.05L18.16 14L18.17 14L18.18 13.95C18.18 13.93 18.18 13.91 18.18 13.88V10.12M17.12 12.89V11.11L15.79 12L17.12 12.89Z'
const mdiContentCopy = 'M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z'
const mdiCodeTags = 'M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z'
const laCodepen = 'M 16 2.84375 L 15.4375 3.21875 L 3.4375 11.25 L 3 11.53125 L 3 20.46875 L 3.4375 20.75 L 15.4375 28.78125 L 16 29.15625 L 16.5625 28.78125 L 28.5625 20.75 L 29 20.46875 L 29 11.53125 L 28.5625 11.25 L 16.5625 3.21875 Z M 15 5.90625 L 15 11.34375 L 9.84375 14.8125 L 5.8125 12.09375 Z M 17 5.90625 L 26.1875 12.09375 L 22.15625 14.8125 L 17 11.34375 Z M 16 13.09375 L 20.34375 16 L 16 18.90625 L 11.65625 16 Z M 5 13.9375 L 8.0625 16 L 5 18.0625 Z M 27 13.9375 L 27 18.0625 L 23.9375 16 Z M 9.875 17.1875 L 15 20.65625 L 15 26.09375 L 5.8125 19.90625 Z M 22.125 17.1875 L 26.1875 19.90625 L 17 26.09375 L 17 20.65625 Z|0 0 32 32'
const matDone = 'M0 0h24v24H0z@@fill:none;&&M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z'

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
    codepenTitle: String,
    jsPaths: Array,
    cssPaths: Array,
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
    },
    noEdit: Boolean,
    noCopy: Boolean,
    copyIcon: String,
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

  created () {
    this.codepen = laCodepen
    this.github = mdiGithub
    this.copy = mdiContentCopy
    this.code = mdiCodeTags
    this.done = matDone
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
        this.__parseComponent(comp.default)
      })
    })
  },

  computed: {
    __slugifiedTitle () {
      return this.__slugify('example-' + this.title)
    }
  },

  methods: {
    __slugify: slugify,

    __copyHeading () {
      if (this.noAnchor === true) {
        return
      }

      if (window && window.location && document) {
        const text = window.location.origin + window.location.pathname + '#' + this.__slugifiedTitle
        const el = document.getElementById(this.__slugifiedTitle)

        if (el) {
          el.id = ''

          window.location.hash = '#' + this.__slugifiedTitle

          setTimeout(() => {
            el.id = this.__slugifiedTitle
          }, 300)

          copyToClipboard(text)

          this.$q.notify({
            message: this.anchorResponse,
            color: this.$q.dark.isActive ? 'grey-10' : 'white',
            textColor: this.$q.dark.isActive ? 'amber' : 'primary',
            icon: this.done,
            position: 'top',
            timeout: 2000
          })
        }
      }
    },

    __parseComponent (comp) {
      const
        template = this.__parseTemplate('template', comp),
        script = this.__parseTemplate('script', comp),
        style = this.__parseTemplate('style', comp)

      this.parts = {
        template,
        script,
        style
      }
      this.tabs = ['template', 'script', 'style'].filter(type => this.parts[type])
    },

    __parseTemplate (target, template) {
      const
        string = `(<${target}(.*)?>[\\w\\W]*<\\/${target}>)`,
        regex = new RegExp(string, 'g'),
        parsed = regex.exec(template) || []

      return parsed[1] || ''
    },

    __openLocation () {
      openURL(`${this.locationUrl}/${this.file}.vue`)
    },

    __openCodepen () {
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
            click: this.__copyHeading
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
              icon: (this.locationIcon ? this.locationIcon : this.github)
            },
            on: {
              click: this.__openLocation
            }
          }),
          this.noEdit !== true && h(QBtn, {
            props: {
              dense: true,
              flat: true,
              round: true,
              icon: this.codepen
            },
            on: {
              click: this.__openCodepen
            }
          }),
          h(QBtn, {
            props: {
              dense: true,
              flat: true,
              round: true,
              icon: this.code
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
            icon: (this.copyIcon ? this.copyIcon : this.copy)
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
          codepenTitle: this.codepenTitle,
          title: this.title,
          slugifiedTitle: this.__slugifiedTitle,
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
        id: this.__slugifiedTitle
      }
    }, [
      this.__renderCard(h),
      this.__renderCodepen(h)
    ])
  }
}
