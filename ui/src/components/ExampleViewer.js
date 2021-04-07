import {
  computed,
  defineComponent,
  h,
  onBeforeMount,
  ref,
  reactive,
  markRaw
} from 'vue'

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
  openURL,
  useQuasar
} from 'quasar'

// import { QRibbon } from '@quasar/quasar-ui-qribbon'
// import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import { slugify } from '../utils/pageUtils'
import Codepen from './Codepen.js'
import CodePrism from './CodePrism.js'

export default defineComponent({
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
    locationIcon: String,
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

  setup (props, { slots, emit }) {
    const
      component = ref(null),
      def = reactive({
        tabs: [],
        parts: {}
      }),
      $q = useQuasar(),
      currentTab = ref('template'),
      expanded = ref(false),
      codepenRef = ref(null)

    const parsedSlugifiedTitle = computed(() => {
      return slugify('example-' + props.title)
    })

    const parsedLocationIcon = computed(() => {
      // default icon is Github
      return props.locationIcon
        ? props.locationIcon
        : 'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z'
    })

    const parsedCopyIcon = computed(() => {
      // default mdiContentCopy
      return props.copyIcon
        ? props.copyIcon
        : 'M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z'
    })

    const parsedCodeIcon = computed(() => {
      return 'M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z'
    })

    const parseCodepenIcon = computed(() => {
      return 'M 16 2.84375 L 15.4375 3.21875 L 3.4375 11.25 L 3 11.53125 L 3 20.46875 L 3.4375 20.75 L 15.4375 28.78125 L 16 29.15625 L 16.5625 28.78125 L 28.5625 20.75 L 29 20.46875 L 29 11.53125 L 28.5625 11.25 L 16.5625 3.21875 Z M 15 5.90625 L 15 11.34375 L 9.84375 14.8125 L 5.8125 12.09375 Z M 17 5.90625 L 26.1875 12.09375 L 22.15625 14.8125 L 17 11.34375 Z M 16 13.09375 L 20.34375 16 L 16 18.90625 L 11.65625 16 Z M 5 13.9375 L 8.0625 16 L 5 18.0625 Z M 27 13.9375 L 27 18.0625 L 23.9375 16 Z M 9.875 17.1875 L 15 20.65625 L 15 26.09375 L 5.8125 19.90625 Z M 22.125 17.1875 L 26.1875 19.90625 L 17 26.09375 L 17 20.65625 Z|0 0 32 32'
    })

    const parsedDoneIcon = computed(() => {
      return props.doneIcon
        ? props.doneIcon
        : 'M0 0h24v24H0z@@fill:none;&&M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z'
    })

    onBeforeMount(() => {
      import(
        /* webpackChunkName: "examples" */
        /* webpackMode: "lazy-once" */
        `examples/${ props.file }.vue`
      ).then(comp => {
        component.value = markRaw(comp.default)

        import(
          /* webpackChunkName: "examples-source" */
          /* webpackMode: "lazy-once" */
          `!raw-loader!examples/${ props.file }.vue`
        ).then(comp => {
          __parseComponent(comp.default)
        })
      })
    })

    function __copyHeading () {
      if (props.noAnchor === true) {
        return
      }

      if (window && window.location && document) {
        const text = window.location.origin + window.location.pathname + '#' + parsedSlugifiedTitle.value
        const el = document.getElementById(parsedSlugifiedTitle.value)

        if (el) {
          el.id = ''

          window.location.hash = '#' + parsedSlugifiedTitle.value

          setTimeout(() => {
            el.id = parsedSlugifiedTitle.value
          }, 300)

          copyToClipboard(text)

          $q.notify({
            message: props.anchorResponse,
            color: $q.dark.isActive ? 'grey-10' : 'white',
            textColor: $q.dark.isActive ? 'amber' : 'primary',
            icon: parsedDoneIcon.value,
            position: 'top',
            timeout: 2000
          })
        }
      }
    }

    function __parseComponent (comp) {
      const
        template = __parseTemplate('template', comp),
        script = __parseTemplate('script', comp),
        style = __parseTemplate('style', comp)

      def.parts = {
        template,
        script,
        style
      }

      def.tabs = [ 'template', 'script', 'style' ]
        .filter(type => def.parts[ type ])
    }

    function __parseTemplate (target, template) {
      const
        string = `(<${ target }(.*)?>[\\w\\W]*<\\/${ target }>)`,
        regex = new RegExp(string, 'g'),
        parsed = regex.exec(template) || []

      return parsed[ 1 ] || ''
    }

    function __openLocation () {
      openURL(`${ props.locationUrl }/${ props.file }.vue`)
    }

    function __openCodepen () {
      codepenRef.value.open(def.parts)
    }

    function __copyTab (tab) {
      copyToClipboard(def.parts[ def.tabs[ tab ] ])

      $q.notify({
        message: props.copyResponse,
        color: $q.dark.isActive ? 'grey-10' : 'white',
        textColor: $q.dark.isActive ? 'amber' : 'primary',
        icon: parsedDoneIcon.value,
        position: 'top',
        timeout: 2000
      })
    }

    function __renderRibbon () {
      return h(QToolbarTitle, {
        class: props.noAnchor !== true ? 'example-title' : '',
        onClick: __copyHeading
      }, {
        default: () => h('span', {
          class: 'ellipsis'
        }, props.title)
      })

      // return h(QRibbon, {
      //   props: {
      //     position: 'left',
      //     color: props.ribbonTextColor,
      //     backgroundColor: props.ribbonColor,
      //     leafColor: props.ribbonLeafColor,
      //     leafPosition: 'bottom',
      //     decoration: 'rounded-out'
      //   }
      // }, [
      //   h(QToolbarTitle, {
      //     class: props.noAnchor !== true ? 'example-title' : '',
      //     onClick: __copyHeading
      //   }, [
      //     h('span', {
      //       class: 'ellipsis'
      //     }, props.title)
      //   ])
      // ])
    }

    function __renderToolbar () {
      return h(QToolbar, {}, {
        default: () => [
          __renderRibbon(),
          h(QSpace),
          h('div', {
            class: 'col-auto'
          }, {
            default: () => [
              props.locationUrl && h(QBtn, {
                dense: true,
                flat: true,
                round: true,
                icon: parsedLocationIcon.value,
                onClick: __openLocation
              }),
              props.noEdit !== true && h(QBtn, {
                dense: true,
                flat: true,
                round: true,
                icon: parseCodepenIcon.value,
                onClick: __openCodepen
              }),
              h(QBtn, {
                dense: true,
                flat: true,
                round: true,
                icon: parsedCodeIcon.value,
                onClick: v => { expanded.value = !expanded.value }
              }, { default: () => { h(QTooltip, {}, props.tooltipLabel) } })
            ]
          })
        ]
      })
    }

    function __renderTabs () {
      return h(QTabs, {
        class: 'text-caption' + (!$q.dark.isActive ? ' bg-grey-2 text-grey-7' : ''),
        modelValue: currentTab.value,
        align: 'left',
        activeColor: $q.dark.isActive ? 'amber' : void 0,
        indicatorColor: $q.dark.isActive ? 'amber' : 'primary',
        dense: true,
        breakpoint: 0,
        'onUpdate:modelValue': v => { currentTab.value = v }
      }, {
        default: () => [
          ...Object.keys(def.tabs)
            .map(tab => h(QTab, {
              key: `tab-${ def.tabs[ tab ] }`,
              name: def.tabs[ tab ],
              label: def.tabs[ tab ]
            }))
        ]
      })
    }

    function __renderCopy (tab) {
      if (props.noCopy !== true) {
        return h(QBtn, {
          class: 'absolute',
          style: {
            top: '15px',
            right: '15px'
          },
          color: $q.dark.isActive ? 'amber' : 'primary',
          dense: true,
          flat: true,
          round: true,
          icon: parsedCopyIcon.value,
          onClick: v => { __copyTab(tab) }
        }, { default: () => { h(QTooltip, {}, props.copyLabel) } })
      }
    }

    function __renderTabPanel () {
      const type = {
        style: 'css',
        template: 'html',
        script: 'js'
      }

      return Object.keys(def.tabs)
        .map(tab => h(QTabPanel, {
          key: `panel-${ def.tabs[ tab ] }`,
          class: 'q-pa-none relative-position',
          name: def.tabs[ tab ]
        }, {
          default: () => [
            h(CodePrism, {
              lang: type[ def.tabs[ tab ] ],
              code: def.parts[ def.tabs[ tab ] ]
            }),
            __renderCopy(tab)
          ]
        }))
    }

    function __renderTabPanels () {
      return h(QTabPanels, {
        modelValue: currentTab.value,
        animated: true,
        'onUpdate:ModelValue': v => { currentTab.value = v }
      }, { default: () => __renderTabPanel() })
    }

    function __renderInnerCard () {
      return h(QCard, {}, {
        default: () => [
          __renderTabs(),
          __renderTabPanels()
        ]
      })
    }

    function __renderExpansionItem () {
      return h(QSlideTransition, {
        modelValue: expanded.value
      }, {
        default: () => [
          expanded.value && h('div', {}, __renderInnerCard())
        ]
      })
    }

    function __renderComponent () {
      return h('div', {
        class: 'row'
      }, {
        default: () => [
          component.value && h(component.value, {
            class: 'col'
          })
        ]
      })
    }

    function __renderSlot (slot) {
      return h(QCardSection, {}, { default: () => slot() })
    }

    function __renderCard () {
      const slot = slots.default

      return h(QCard, {
        class: 'no-shadow',
        flat: true,
        bordered: true
      }, {
        default: () => [
          __renderToolbar(),
          h(QSeparator),
          __renderExpansionItem(),
          slot ? __renderSlot(slot) : void 0,
          slot ? h(QSeparator) : void 0,
          h(QCardSection, {
            class: 'no-shadow',
            style: {
              padding: 0
            }
          }, {
            default: () => __renderComponent()
          })
        ]
      })
    }

    function __renderCodepen () {
      return h(Codepen, {
        ref: codepenRef,
        codepenTitle: props.codepenTitle,
        title: props.title,
        slugifiedTitle: parsedSlugifiedTitle.value,
        jsPaths: props.jsPaths,
        cssPaths: props.cssPaths
      })
    }

    function __renderExampleViewer () {
      return h('section', {
        class: 'q-pa-md overflow-auto',
        id: parsedSlugifiedTitle.value
      }, {
        default: () => [
          __renderCard(),
          __renderCodepen()
        ]
      })
    }

    return () => __renderExampleViewer()
  }
})
