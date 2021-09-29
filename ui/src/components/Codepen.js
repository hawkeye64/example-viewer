import { defineComponent, h, ref, reactive, computed, nextTick, onBeforeMount } from 'vue'

const replace = name => function (match, p1) {
  const parts = p1
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .reduce((acc, p) => {
      acc.push(p)
      return acc
    }, [])

  const text = []
  if (parts.length > 0) {
    text.push('const { ' + parts.join(', ') + ' } = ' + name)
  }
  return text.join('\n')
}

const replaceQuasarImports = replace('Quasar')
const replaceVueImports = replace('Vue')

export default defineComponent({
  name: 'Codepen',

  props: {
    title: String,
    codepenTitle: {
      type: String,
      default: 'Quasar Playground'
    },
    slugifiedTitle: String,
    jsPaths: Array,
    cssPaths: Array
  },

  setup (props, { slots, emit, expose }) {
    const
      form = ref(null),
      isMounted = ref(false),
      active = ref(false),
      location = ref(''),
      def = reactive({
        parts: {}
      })

    const cssResources = computed(() => {
      return [
        'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons',
        'https://cdn.jsdelivr.net/npm/quasar@2/dist/quasar.min.css'
      ].concat(props.cssPaths).join(';')
    })

    const jsResources = computed(() => {
      return [
        'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js',
        'https://cdn.jsdelivr.net/npm/quasar@2/dist/quasar.umd.min.js'
      ].concat(props.jsPaths).join(';')
    })

    const css = computed(() => {
      return (def.parts.style || '')
        .replace(/(<style.*?>|<\/style>)/g, '')
        .replace(/:deep /g, '')
        .replace(/>>> /g, '')
        .replace(/\/deep\/ /g, '')
        .trim()
    })

    const cssPreprocessor = computed(() => {
      const lang = /<style.*lang=["'](.*)["'].*>/
        .exec(def.parts.style || '')

      return lang ? lang[ 1 ] : 'none'
    })

    const js = computed(() => {
      const quasarImports = /import\s+{([^}'\n]+)}\s+from\s+'quasar'/g
      const vueImports = /import\s+{([^}'\n]+)}\s+from\s+'vue'/g
      const otherImports = /import ([^'\n]*) from ([^\n]*)/g
      let component = /export default {([\s\S]*)}/g.exec(def.parts.script || '')

      component = ((component && component[ 1 ]) || '').trim()
      if (component.length > 0) {
        component = '\n  ' + component + '\n'
      }

      let script = /<script>([\s\S]*)export default {/g.exec(def.parts.script || '')
      script = ((script && script[ 1 ]) || '')
        .replace(quasarImports, replaceQuasarImports)
        .replace(vueImports, replaceVueImports)
        .replace(otherImports, '')
        .trim()

      script += script ? '\n\n' : ''
      return script
        + `const app = Vue.createApp({${ component }})

app.use(Quasar, { config: {} })
app.mount('#q-app')
`
    })

    const html = computed(() => {
      return (def.parts.template || '')
        .replace(/(<template>|<\/template>$)/g, '')
        .replace(/\n/g, '\n  ')
        .replace(/([\w]+=")([^"]*?)(")/g, function (match, p1, p2, p3) {
          return p1 + p2.replace(/>/g, '___TEMP_REPLACEMENT___') + p3
        })
        .replace(/<(q-[\w-]+|div)([^>]*?)\s*?([\n\r][\t ]+)?\/>/gs, '<$1$2$3></$1>')
        .replace(/<(thead|tbody)(.*?)[\n\r]?(\s*)<\/\1>/gs, function (match, p1, p2, p3) {
          return '<template>\n' + p3 + '  <' + p1 + p2.split(/[\n\r]+/g).join('\n  ') + '\n' + p3 + '  </' + p1 + '>\n' + p3 + '</template>'
        })
        .replace(/___TEMP_REPLACEMENT___/g, '>')
        .replace(/^\s{2}/gm, '')
        .trim()
    })

    const editors = computed(() => {
      const flag = (html.value && 0b100) | (css.value && 0b010) | (js.value && 0b001)
      return flag.toString(2)
    })

    const computedTitle = computed(() => {
      return (typeof document !== 'undefined' ? document.title.split(' | ')[ 0 ] + ': ' : '')
        + (props.title ? props.title + ' - ' : '')
        + (props.codepenTitle ? props.codepenTitle : 'Quasar Playground')
    })

    const options = computed(() => {
      const data = {
        title: computedTitle.value,
        html:
          `<!--
  Forked from:
  ${ location.value }#${ props.slugifiedTitle }
-->
<div id="q-app" style="min-height: 100vh;">
  ${ html.value }
</div>`,
        head: '',
        html_pre_processor: 'none',
        css: css.value,
        css_pre_processor: cssPreprocessor.value,
        css_external: cssResources.value,
        js: js.value,
        js_pre_processor: 'babel',
        js_external: jsResources.value,
        editors: editors.value
      }
      return JSON.stringify(data)
    })

    onBeforeMount(() => {
      isMounted.value = true
      location.value = window.location.origin + window.location.pathname
    })

    async function open (whichParts) {
      def.parts = whichParts

      if (active.value) {
        form.value.submit()
        return
      }

      active.value = true

      await nextTick()
      form.value.submit()
    }

    function render () {
      return h('form', {
        ref: form,
        method: 'POST',
        action: 'https://codepen.io/pen/define/',
        target: '_blank',
        rel: 'noopener',
        class: 'hidden'
      }, h('input', {
        type: 'hidden',
        name: 'data',
        value: isMounted.value ? options.value : ''
      })
      )
    }

    expose({
      active,
      options,
      open
    })

    return () => render()
  }
})
