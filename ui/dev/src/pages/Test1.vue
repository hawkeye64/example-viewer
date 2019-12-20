<template>
  <q-page padding class="row justify-center">
    <example-viewer
      title="Code Test"
      file="DayViewBasic"
      :location-url="locationUrl"
      :js-paths="jsPaths"
      :css-paths="cssPaths"
      style="max-width: 800px; width: 100%;"
    >
    <p>Testing the slot</p>
    </example-viewer>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      locationUrl: 'https://github.com/hawkeye64/example-viewer/blob/master/ui/dev/src/pages/',
      jsPaths: [ 'https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@latest/dist/index.umd.min.js' ],
      cssPaths: [ 'https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@latest/dist/index.min.css' ]
    }
  }
}
</script>