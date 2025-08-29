<template>
  <UModal :open="openModel" @update:open="val => emit('update:open', val)" 
    :title="props.invoice.id ? 'Record Invoice Payment' : 'Record Payment'">
    <template #body>
      <UForm 
        :schema="schema" 
        :state="state" 
        class="space-y-4" 
        @submit="onSubmit"
        @error="(errors: any) => console.log('Form errors:', errors)"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField label="Amount" name="amount">
            <UInput 
              v-model.number="state.amount" 
              type="number" 
              min="0.01" 
              step="0.01"
              :disabled="!!props.totalAmount"
              :ui="{ 
                icon: { trailing: { pointer: '' } },
                disabled: 'cursor-not-allowed opacity-75'
              }"
            >
              <template #trailing>
                <span class="text-gray-500 dark:text-gray-400 text-xs">BDT</span>
              </template>
              <template #description v-if="props.invoice.id">
                <span class="text-xs text-gray-500">
                  {{ props.totalAmount ? 'Invoice amount' : 'No invoice amount set' }}
                </span>
              </template>
            </UInput>
          </UFormField>
          
          <UFormField label="Method" name="method">
            <USelect 
              v-model="state.method" 
              :items="methods"
              placeholder="Select payment method"
            />
          </UFormField>
          
          <UFormField label="Date" name="received_at">
            <UInput 
              v-model="state.received_at" 
              type="date" 
              :max="new Date().toISOString().split('T')[0]"
            />
          </UFormField>
          
          <UFormField label="Reference" name="reference">
            <UInput 
              v-model="state.reference" 
              placeholder="Optional reference number"
            />
          </UFormField>
          
          <UFormField class="sm:col-span-2" label="Notes" name="notes">
            <UTextarea 
              v-model="state.notes" 
              :rows="3" 
              placeholder="Add any additional notes about this payment"
            />
          </UFormField>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <UButton 
            variant="soft" 
            color="gray" 
            @click="emit('update:open', false)"
          >
            Cancel
          </UButton>
          
          <UButton 
            type="submit" 
            color="primary"
            :loading="loading" 
            :disabled="!isValid"
            icon="i-heroicons-banknotes"
          >
            Record Payment
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as v from 'valibot'

// Types
type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'ach' | 'mobile'

interface PaymentFormState {
  amount: number | null
  method: PaymentMethod
  received_at: string
  reference: string
  notes: string
  lease_id: number
  [key: string]: any // Add index signature to handle dynamic properties
}

// Props & Emits
const props = defineProps<{ 
  open: boolean
  loading: boolean
  portfolioId: number
  leaseId: number
  invoice?: any
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submitted', value: any): void
  (e: 'error', message: string): void
}>()

// Payment methods
const methods = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'ach', label: 'ACH Payment' },
  { value: 'mobile', label: 'Mobile Payment' }
] as const

// State
// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateString = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Watch for invoice ID and total amount changes
watch(() => props.invoice.id, (newInvoiceId) => {
  if (newInvoiceId) {
    console.log('Invoice ID updated:', newInvoiceId)
  }
})

watch(() => props.invoice.amount, (newTotal) => {
  if (newTotal && newTotal > 0) {
    state.amount = Number(newTotal.toFixed(2))
  }
}, { immediate: true })

const state = reactive<PaymentFormState>({
  amount: props.invoice.amount ? Number(props.invoice.amount.toFixed(2)) : 0,
  method: 'bank_transfer',
  received_at: getTodayDateString(),
  reference: '',
  notes: '',
  lease_id: props.leaseId
})

// Form validation schema
const schema = v.object({
  amount: v.pipe(
    v.number(),
    v.minValue(0.01, 'Amount must be greater than 0')
  ),
  method: v.union([
    v.literal('cash'),
    v.literal('bank_transfer'),
    v.literal('card'),
    v.literal('ach'),
    v.literal('mobile')
  ], 'Please select a valid payment method'),
  received_at: v.pipe(
    v.string(),
    v.minLength(1, 'Date is required')
  ),
  reference: v.optional(v.string()),
  notes: v.optional(v.string()),
  lease_id: v.pipe(
    v.number(),
    v.minValue(1, 'Lease ID is required')
  )
})

// Computed
const openModel = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const isValid = computed(() => {
  try {
    const result = v.safeParse(schema, state)
    return result.success
  } catch (error) {
    console.error('Validation error:', error)
    return false
  }
})

// Methods
const user = useUserStore()

function resetForm() {
  state.amount = 0
  state.method = 'cash'
  state.received_at = getTodayDateString()
  state.reference = ''
  state.notes = ''
}

async function onSubmit() {
  if (!isValid.value) {
    emit('error', 'Please fill in all required fields correctly')
    return
  }

  try {
    const paymentData = {
      portfolio_id: props.portfolioId,
      lease_id: props.leaseId,
      user_id: user.user?.id || null,
      invoice_id: props.invoice.id || null,
      received_at: new Date(state.received_at).toISOString(),
      method: state.method,
      amount: Number(state.amount),
      reference: state.reference || undefined,
      notes: state.notes || undefined
    }

    console.log('Submitting payment:', paymentData)
    emit('submitted', paymentData)
    resetForm()
    
  } catch (error) {
    console.error('Payment submission error:', error)
    emit('error', 'Failed to process payment. Please try again.')
  }
}
</script>
