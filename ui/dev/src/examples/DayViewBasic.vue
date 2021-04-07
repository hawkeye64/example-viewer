<template>
  <q-calendar-day
    v-model="selectedDate"
    view="day"
    locale="en-us"
    style="height: 400px;"
  />
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DayViewBasic',

  setup () {
    const selectedDate = ref('')

    return {
      selectedDate
    }
  }
})
</script>
