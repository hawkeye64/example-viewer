<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar-scheduler
      v-model="selectedDate"
      view="week-scheduler"
      :resources="resources"
      :resource-height="50"
      locale="en-us"
      style="height: 400px;"
    />
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  name: 'DayViewBasic',

  setup () {
    const selectedDate = ref(''),
      resources = reactive([
        { label: 'John' },
        { label: 'Mary' },
        { label: 'Susan' },
        { label: 'Olivia' },
        { label: 'Board Room' },
        { label: 'Room-1' },
        { label: 'Room-2' }
      ])

    return {
      selectedDate,
      resources
    }
  }
})
</script>
