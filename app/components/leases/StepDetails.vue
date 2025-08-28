<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import { useToast } from '#imports'
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

// Helper functions for formatting
const formatDate = (date: string | Date, format: string): string => {
  return new Date(date).toLocaleDateString()
}

const formatMoney = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

type NumericField = number | string

interface LeaseDetails {
  start_date: string
  end_date: string
  rent: number
  deposit: number
  billing_day: number
  grace_days: number
  late_fee_flat: number
  late_fee_percent: number
  notes: string | null
  market_rent: number | null
  timezone: string
}

const props = defineProps<{
  unitInfo: any | null
  tenants: Array<{ id: number; first_name: string; last_name: string }>
  modelValue: LeaseDetails
}>()

const emit = defineEmits<{
  'update:modelValue': [typeof props.modelValue]
  back: []
  next: []
}>()

const formRef = ref<HTMLFormElement | null>(null)

// Initialize form state with defaults
const state = reactive<LeaseDetails>({
  start_date: props.modelValue.start_date || '',
  end_date: props.modelValue.end_date || '',
  rent: props.modelValue.rent ? Number(props.modelValue.rent) : 0,
  deposit: props.modelValue.deposit ? Number(props.modelValue.deposit) : 0,
  billing_day: props.modelValue.billing_day ? Number(props.modelValue.billing_day) : 1,
  grace_days: props.modelValue.grace_days ? Number(props.modelValue.grace_days) : 0,
  late_fee_flat: props.modelValue.late_fee_flat ? Number(props.modelValue.late_fee_flat) : 0,
  late_fee_percent: props.modelValue.late_fee_percent ? Number(props.modelValue.late_fee_percent) : 0,
  notes: props.modelValue.notes || null,
  market_rent: props.modelValue.market_rent !== undefined ? Number(props.modelValue.market_rent) : 0,
  timezone: props.modelValue.timezone || ''
})

// Sync props to state
watch(() => props.modelValue, (newVal) => {
  Object.assign(state, {
    ...newVal,
    rent: Number(newVal.rent) || 0,
    deposit: Number(newVal.deposit) || 0,
    billing_day: Number(newVal.billing_day) || 1,
    grace_days: Number(newVal.grace_days) || 0,
    late_fee_flat: Number(newVal.late_fee_flat) || 0,
    late_fee_percent: Number(newVal.late_fee_percent) || 0,
    market_rent: newVal.market_rent ? Number(newVal.market_rent) : null
  })
}, { deep: true, immediate: true })

// Emit updates when state changes
watch(() => state, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })


// Valibot schema for lease details
// Valibot schema for lease details — modern API
const schema = v.object({
  start_date: v.pipe(
    v.string(),
    v.minLength(1, 'Start date is required')
  ),
  end_date: v.pipe(
    v.string(),
    v.minLength(1, 'End date is required')
  ),
  rent: v.pipe(
    v.number(),
    v.minValue(0.01, 'Rent must be greater than 0')
  ),
  deposit: v.pipe(
    v.number(),
    v.minValue(0, 'Deposit cannot be negative')
  ),
  billing_day: v.pipe(
    v.number(),
    v.minValue(1, 'Billing day must be at least 1'),
    v.maxValue(31, 'Billing day cannot be greater than 31')
  ),
  grace_days: v.pipe(
    v.number(),
    v.minValue(0, 'Grace days cannot be negative')
  ),
  // Set default values for optional number fields
  late_fee_flat: v.pipe(
    v.union([v.number(), v.string(), v.null_()]),
    v.transform((val) => {
      if (val === null || val === '') return 0
      return Number(val)
    }),
    v.minValue(0, 'Late fee cannot be negative')
  ),
  late_fee_percent: v.pipe(
    v.union([v.number(), v.string(), v.null_()]),
    v.transform((val) => {
      if (val === null || val === '') return 0
      return Number(val)
    }),
    v.minValue(0, 'Late fee percent cannot be negative'),
    v.maxValue(100, 'Late fee percent cannot exceed 100%')
  ),
  notes: v.optional(v.string()),
  market_rent: v.optional(
    v.pipe(
      v.union([v.number(), v.null_()]),
      v.transform((val) => val === null ? 0 : val),
      v.minValue(0, 'Market rent cannot be negative')
    )
  )
})

// Initialize toast
const toast = useToast()

// Handle form submission
async function onSubmit() {
  console.log('Form submitted with data:', JSON.parse(JSON.stringify(state)))
  
  // Basic date validation
  const startDate = new Date(state.start_date)
  const endDate = new Date(state.end_date)
  
  if (startDate >= endDate) {
    console.error('Validation failed: End date must be after start date')
    toast.add({
      title: 'Validation Error',
      description: 'End date must be after start date',
      color: 'red',
      duration: 5000
    })
    return
  }
  
  // Ensure we're working with numbers
  const deposit = Number(state.deposit)
  const rent = Number(state.rent)
  const lateFeePercent = Number(state.late_fee_percent)
  
  // Show warnings if needed
  if (deposit > rent * 2) {
    toast.add({
      title: 'Warning',
      description: 'Deposit is unusually high (more than 2x rent)',
      color: 'yellow',
      duration: 5000
    })
  }
  
  if (lateFeePercent > 10) {
    toast.add({
      title: 'Warning',
      description: 'Late fee percentage is high (over 10%)',
      color: 'yellow',
      duration: 5000,
      actions: [{
        label: 'Dismiss',
        onClick: () => {}
      }]
    })
  }
  
  // Prepare the payload with all fields
  const payload = {
    ...state,
    rent: Number(state.rent),
    deposit: Number(state.deposit),
    billing_day: Number(state.billing_day),
    grace_days: Number(state.grace_days),
    late_fee_flat: Number(state.late_fee_flat) || 0,
    late_fee_percent: Number(state.late_fee_percent) || 0,
    market_rent: state.market_rent ? Number(state.market_rent) : null,
    notes: state.notes || ''
  }

  // Update parent with the final payload
  emit('update:modelValue', payload)
  
  // Proceed to next step
  emit('next')
}

const isValid = computed(() => {
  try {
    console.log('Validating form with state:', JSON.parse(JSON.stringify(state)))
    const result = v.safeParse(schema, state)
    
    if (!result.success) {
      console.error('Validation failed. Issues found:')
      result.issues.forEach(issue => {
        console.error(`- ${issue.message} (path: ${issue.path?.map(p => p.key).join('.') || 'root'})`)
      })
      return false
    }
    
    if (state.start_date && state.end_date) {
      const start = new Date(state.start_date)
      const end = new Date(state.end_date)
      if (start >= end) {
        console.error('Date validation failed: End date must be after start date')
        return false
      }
    }
    
    console.log('Form is valid')
    return true
  } catch (error) {
    console.error('Unexpected validation error:', error)
    return false
  }
})

const prorationAmount = (rent: string | number, startDate: string): number => {
  if (!startDate) return 0
  const start = new Date(startDate)
  const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
  const occupiedDays = Math.max(0, daysInMonth - start.getDate() + 1)
  return Math.round(Number(rent) * (occupiedDays / daysInMonth))
}

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th' // covers 11th, 12th, 13th, etc.
  switch (day % 10) {
    case 1:  return 'st'
    case 2:  return 'nd'
    case 3:  return 'rd'
    default: return 'th'
  }
}

const showProration = computed(() => {
  if (!state.start_date) return false
  const d = new Date(state.start_date)
  const billingDay = Number(state.billing_day) || 1
  return d.getDate() !== billingDay
})

const prorated = computed(() => prorationAmount(Number(state.rent), state.start_date))



</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit" @error="(errors: any) => console.log('Form errors:', errors)">
    <UCard>
    <!-- Read-only context -->
    <div class="mb-4 text-sm text-gray-600">
      <div>
        <strong>Unit:</strong> {{ unitInfo?.label || 'N/A' }}
        <span v-if="unitInfo?.id" class="text-gray-400">(#{{ unitInfo.id }})</span>
        · Property: {{ unitInfo?.property?.name ?? ('#' + unitInfo?.property_id) }}
      </div>
      <div>
        <strong>Tenant(s):</strong>
        <template v-if="tenants.length">
          {{ tenants.map(t => t.first_name + ' ' + t.last_name).join(', ') }}
        </template>
        <template v-else>—</template>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UFormField label="Start Date" name="start_date">
        <UInput 
          v-model="state.start_date"
          type="date" 
        />
      </UFormField>
      <UFormField label="End Date" name="end_date">
        <UInput 
          v-model="state.end_date"
          type="date" 
        />
      </UFormField>

      <UFormField label="Monthly Rent (BDT)" name="rent">
        <UInput 
          v-model.number="state.rent" 
          type="number" 
          min="0" 
          step="0.01" 
        />
      </UFormField>
      <UFormField label="Security Deposit (BDT)" name="deposit">
        <UInput 
          v-model.number="state.deposit" 
          type="number" 
          min="0" 
          step="1" 
        />
      </UFormField>

      <UFormField label="Billing Day (1–31)" name="billing_day">
        <UInput 
          v-model.number="state.billing_day" 
          type="number" 
          min="1" 
          max="31" 
          step="1"
        />
      </UFormField>
      <UFormField label="Grace Days" name="grace_days">
        <UInput 
          v-model.number="state.grace_days" 
          type="number" 
          min="0" 
          step="1"
        />
      </UFormField>

      <UFormField label="Late Fee Flat (BDT)" name="late_fee_flat">
        <UInput 
          v-model.number="state.late_fee_flat" 
          type="number" 
          min="0" 
          step="1"
        />
      </UFormField>
      <UFormField label="Late Fee Percent (%)" name="late_fee_percent">
        <UInput 
          v-model.number="state.late_fee_percent" 
          type="number" 
          min="0" 
          max="100"
          step="0.5"
        />
      </UFormField>

      <UFormField class="sm:col-span-2" label="Notes" name="notes">
        <UTextarea v-model="state.notes" placeholder="Optional notes or special terms" />
      </UFormField>
    </div>

    <div class="mt-6 border rounded-lg overflow-hidden">
      <div class="bg-blue-50 px-4 py-3 border-b flex items-center">
        <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-blue-500 mr-2" />
        <h3 class="font-semibold text-blue-800">Proration Information</h3>
      </div>
      <div class="p-4">
        <div v-if="showProration" class="space-y-2">
          <div class="flex items-center text-blue-700">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 mr-2 flex-shrink-0" />
            <p class="font-medium">Prorated First Month</p>
          </div>
          <p class="text-gray-700 pl-7">
            This lease will be prorated for the first month since it starts on {{ new Date(state.start_date).getDate() }}{{getOrdinalSuffix(new Date(state.start_date).getDate())}} instead of the billing day ({{state.billing_day}}{{getOrdinalSuffix(state.billing_day)}}).
          </p>
          <div class="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
            <p class="text-sm text-gray-600">Prorated amount for {{ formatDate(state.start_date, 'MMMM yyyy') }}:</p>
            <p class="text-lg font-bold text-blue-700">{{ formatMoney(prorated) }}</p>
            <p class="text-xs text-gray-500 mt-1">Based on daily rate of {{ formatMoney(Math.round((Number(state.rent) / 30) * 100) / 100) }}/day</p>
          </div>
        </div>
        <div v-else class="flex items-center text-green-700">
          <UIcon name="i-heroicons-check-circle" class="h-5 w-5 mr-2 text-green-500" />
          <p>No proration needed. The lease starts on the billing day ({{state.billing_day}}{{getOrdinalSuffix(state.billing_day)}}).</p>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-between">
      <UButton
        color="gray"
        variant="ghost"
        @click="$emit('back')"
      >
        Back
      </UButton>
      <UButton
        type="submit"
        color="primary"
        :disabled="!isValid"
        @click="console.log('Next button clicked, isValid:', isValid)"
      >
        Next
      </UButton>
    </div>
    </UCard>
  </UForm>
</template>
