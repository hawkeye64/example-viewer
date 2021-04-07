<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar-month
      v-model="selectedDate"
      view="month"
      locale="en-us"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MonthViewBasic',

  setup () {
    const selectedDate = ref('')

    return {
      selectedDate
    }
  }
})
</script>
