<template>
  <div class="row justify-center q-pa-md" style="max-width: 800px; width: 100%; overflow: hidden;">
    <q-calendar-month
      ref="calendar"
      v-model="selectedDate"
      view="month"
      locale="en-us"
      mini-mode
      style="max-width: 300px;"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MiniModeBasic',

  setup () {
    const selectedDate = ref('')

    return {
      selectedDate
    }
  }
})
</script>
