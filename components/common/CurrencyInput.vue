<template>
  <UInput
    ref="inputRef"
    v-model="displayValue"
    v-bind="$attrs"
    type="text"
    inputmode="decimal"
    v-on="{
      ...$attrs,
      'update:modelValue': undefined,
      'onUpdate:modelValue': undefined,
      'onBlur': onBlur,
      'onFocus': onFocus,
      'onInput': formatCurrency
    }"
  >
    <template #leading v-if="!$slots.leading">
      <span class="text-gray-500 dark:text-gray-400 text-sm">
        {{ currencySymbol }}
      </span>
    </template>
    
    <template #trailing v-if="!$slots.trailing && showClear && modelValue">
      <UButton
        color="gray"
        variant="ghost"
        size="2xs"
        icon="i-heroicons-x-mark-20-solid"
        :padded="false"
        @click="clearInput"
      />
    </template>
  </UInput>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useMoney } from '~/composables/useMoney'

const props = withDefaults(defineProps<{
  modelValue: number | string | null | undefined
  currency?: string
  locale?: string
  showClear?: boolean
  allowNegative?: boolean
  min?: number
  max?: number
  decimalPlaces?: number
}>(), {
  modelValue: 0,
  currency: 'USD',
  locale: 'en-US',
  showClear: true,
  allowNegative: false,
  min: undefined,
  max: undefined,
  decimalPlaces: 2
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()

const { formatCurrency: formatMoney } = useMoney()
const inputRef = ref()
const focused = ref(false)

const currencySymbol = computed(() => {
  try {
    return (0).toLocaleString(props.locale, {
      style: 'currency',
      currency: props.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace(/[0-9.,\s]/g, '')
  } catch (e) {
    return '$' // Fallback
  }
})

const displayValue = ref('')

// Format the display value
const formatDisplayValue = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return ''
  
  const num = typeof value === 'string' 
    ? parseFloat(value.replace(/[^0-9.-]/g, '')) 
    : value
    
  if (isNaN(num as number)) return ''
  
  return formatMoney(num, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: props.decimalPlaces,
    useGrouping: true
  })
}

// Parse the input value to a number
const parseInput = (value: string): number | null => {
  if (!value) return null
  
  // Remove all non-numeric characters except decimal point and minus sign
  const numericValue = value.replace(/[^0-9.-]/g, '')
  
  if (!numericValue) return null
  
  let num = parseFloat(numericValue)
  
  // Handle negative values
  if (!props.allowNegative && num < 0) {
    num = Math.abs(num)
  }
  
  // Apply min/max constraints
  if (props.min !== undefined && num < props.min) {
    num = props.min
  }
  
  if (props.max !== undefined && num > props.max) {
    num = props.max
  }
  
  // Round to specified decimal places
  const factor = Math.pow(10, props.decimalPlaces)
  return Math.round(num * factor) / factor
}

// Format the currency when input changes
const formatCurrency = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = target.value
  
  const num = parseInput(value)
  
  if (num === null) {
    emit('update:modelValue', null)
    displayValue.value = ''
    return
  }
  
  emit('update:modelValue', num)
  
  // Only format if not focused (to allow typing decimals)
  if (!focused.value) {
    displayValue.value = formatDisplayValue(num) || ''
  } else {
    // Keep the raw value while typing
    displayValue.value = value
  }
}

// Handle blur event
const onBlur = (e: Event) => {
  focused.value = false
  const target = e.target as HTMLInputElement
  const num = parseInput(target.value)
  
  if (num !== null) {
    displayValue.value = formatDisplayValue(num) || ''
  } else {
    displayValue.value = ''
  }
  
  emit('blur')
}

// Handle focus event
const onFocus = (e: Event) => {
  focused.value = true
  const num = parseInput(displayValue.value)
  
  if (num !== null) {
    // Show raw number without formatting when focused
    displayValue.value = num.toString()
  }
  
  // Select all text on focus for easier editing
  const target = e.target as HTMLInputElement
  setTimeout(() => target.select(), 0)
  
  emit('focus')
}

// Clear the input
const clearInput = () => {
  emit('update:modelValue', null)
  displayValue.value = ''
  inputRef.value?.$el?.querySelector('input')?.focus()
}

// Watch for external modelValue changes
watch(() => props.modelValue, (newVal) => {
  if (!focused.value) {
    displayValue.value = formatDisplayValue(newVal) || ''
  }
}, { immediate: true })

// Focus method that can be called from parent
const focus = () => {
  inputRef.value?.$el?.querySelector('input')?.focus()
}

// Expose focus method to parent
defineExpose({
  focus
})
</script>
