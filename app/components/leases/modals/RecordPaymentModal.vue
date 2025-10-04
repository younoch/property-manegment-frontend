<template>
  <UModal 
    :open="openModel" 
    @update:open="(val: boolean) => emit('update:open', val)" 
    :title="props.invoice.id ? 'Record Invoice Payment' : 'Record Payment'"
    :ui="{ 
      container: 'relative',
      width: 'sm:max-w-lg',
      padding: 'p-4 sm:p-6',
    }"
  >
    <template #body>
      <UForm 
        :schema="schema" 
        :state="state" 
        class="space-y-4 sm:space-y-6" 
        @submit="onSubmit"
        @error="() => {}"
      >
        <div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
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
              :items="paymentMethods"
              placeholder="Select payment method"
              class="w-full"
            />
          </UFormField>
          
          <UFormField label="Date" name="received_at">
            <UInput 
              v-model="state.received_at" 
              type="date" 
              :max="new Date().toISOString().split('T')[0]"
              class="w-full"
            />
          </UFormField>
          
          <UFormField label="Reference" name="reference">
            <UInput 
              v-model="state.reference" 
              placeholder="Optional reference number"
              class="w-full"
            />
          </UFormField>
          
          <UFormField class="sm:col-span-2" label="Notes" name="notes">
            <UTextarea 
              v-model="state.notes" 
              :rows="3" 
              placeholder="Add any additional notes about this payment"
              class="w-full"
            />
          </UFormField>
        </div>
        
        <div class="flex flex-col-reverse gap-3 mt-6 sm:flex-row sm:justify-end sm:gap-4">
          <UButton 
            variant="soft" 
            color="gray" 
            @click="emit('update:open', false)"
            class="w-full sm:w-auto"
          >
            Cancel
          </UButton>
          
          <UButton 
            type="submit" 
            color="primary"
            :loading="loading" 
            :disabled="!isValid"
            icon="i-heroicons-banknotes"
            class="w-full sm:w-auto"
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
import { paymentMethods } from '~/constants/expense'

// Types
interface PaymentFormState {
  amount: number | null
  method: string
  received_at: string
  reference: string
  notes: string
  lease_id: string
  [key: string]: any // Add index signature to handle dynamic properties
}

interface Invoice {
  id?: string
  totalAmount?: number
  paidAmount?: number
  dueAmount?: number
  [key: string]: any // Allow additional properties
}

// Props & Emits
const props = withDefaults(defineProps<{ 
  open: boolean
  loading: boolean
  invoice: Invoice
  totalAmount?: number
  paidAmount?: number
  leaseId: string
  portfolioId?: string
}>(), {
  totalAmount: undefined,
  paidAmount: 0,
  portfolioId: undefined
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submitted', value: PaymentFormState): void
  (e: 'error', message: string): void
}>()

// State
// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateString = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Format currency helper
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// Watch for invoice ID and total amount changes
watch(() => props.invoice.id, (newInvoiceId) => {
  if (newInvoiceId) {
    state.amount = props.totalAmount || props.invoice.totalAmount || 0
  } else {
    state.amount = 0
  }
})

watch(() => props.totalAmount, (newTotal) => {
  if (props.invoice.id) {
    state.amount = newTotal || props.invoice.totalAmount || 0
  }
})

const state = reactive<PaymentFormState>({
  amount: props.invoice.totalAmount ? Number(props.invoice.totalAmount.toFixed(2)) : 0,
  method: 'bank_transfer',
  received_at: getTodayDateString(),
  reference: '',
  notes: '',
  lease_id: props.leaseId
})

// Custom validation function for amount
const validateAmount = (value: number): string | boolean => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'Amount must be a valid number';
  }
  if (value <= 0) {
    return 'Amount must be greater than 0';
  }
  if (props.invoice.id && props.totalAmount) {
    const maxAmount = props.totalAmount - (props.paidAmount || 0);
    if (value > maxAmount) {
      return `Amount cannot exceed ${formatCurrency(maxAmount)}`;
    }
  }
  return true;
};

// Form validation schema
const schema = v.object({
  amount: v.pipe(
    v.number('Amount must be a number'),
    v.minValue(0.01, 'Amount must be greater than 0'),
    v.custom(validateAmount)
  ),
  method: v.union([
    v.literal('credit_card'),
    v.literal('debit_card'),
    v.literal('bank_transfer'),
    v.literal('ach_transfer'),
    v.literal('wire_transfer'),
    v.literal('check'),
    v.literal('money_order'),
    v.literal('cash'),
    v.literal('paypal'),
    v.literal('venmo'),
    v.literal('zelle'),
    v.literal('cash_app'),
    v.literal('cryptocurrency'),
    v.literal('other')
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
const openModel = computed<boolean>({
  get() {
    return props.open
  },
  set(value: boolean) {
    emit('update:open', value)
  }
})

const isValid = computed(() => {
  try {
    const result = v.safeParse(schema, state)
    return result.success
  } catch (error) {
    return false
  }
})

// Methods
const userStore = useUserStore()

function resetForm() {
  state.amount = 0
  state.method = 'cash'
  state.received_at = getTodayDateString()
  state.reference = ''
  state.notes = ''
}

const onSubmit = async () => {
  try {
    const paymentData: PaymentFormState = {
      amount: Number(state.amount),
      method: state.method,
      received_at: state.received_at,
      reference: state.reference || '',
      notes: state.notes || '',
      lease_id: props.leaseId,
      portfolio_id: props.portfolioId,
      user_id: userStore.user?.id,
      invoice_id: props.invoice.id || null,
      payment_method: state.method
    };

    emit('submitted', paymentData as any);
    resetForm()
    
  } catch (error) {
    console.error('Payment submission error:', error)
    emit('error', 'Failed to process payment. Please try again.')
  }
}
</script>
