<template>
  <span :title="fullDate">
    {{ formattedDate }}
    <span v-if="showTz" class="text-xs text-gray-500 dark:text-gray-400 ml-1">
      ({{ timezoneAbbr }})
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioDates } from '~/composables/usePortfolioDates'

const props = defineProps({
  date: {
    type: [Date, String, Number],
    required: true
  },
  format: {
    type: String,
    default: 'PPP' // Default format from date-fns
  },
  showTz: {
    type: Boolean,
    default: true
  },
  customTz: {
    type: String,
    default: ''
  }
})

const { formatDate, getTimezoneAbbreviation } = usePortfolioDates()

const formattedDate = computed(() => {
  return formatDate(props.date, props.format)
})

const fullDate = computed(() => {
  return formatDate(props.date, 'PPPppp')
})

const timezoneAbbr = computed(() => {
  return props.customTz || getTimezoneAbbreviation()
})
</script>
