<template>
  <UModal
    v-model:open="openModel"
    :title="modalTitle"
    :ui="modalUi"
  >
    <template #body>
      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        class="space-y-4 sm:space-y-6"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
          <!-- Amount -->
          <UFormField label="Amount" name="amount">
            <UInput
              v-model.number="state.amount"
              type="number"
              min="0.01"
              step="0.01"
              :disabled="!!props.totalAmount"
              :ui="inputUi"
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

          <!-- Method -->
          <UFormField label="Payment Method" name="payment_method">
            <USelect
              v-model="state.payment_method"
              :items="paymentMethods"
              placeholder="Select payment method"
              class="w-full"
            />
          </UFormField>

          <!-- Date -->
          <UFormField label="Date" name="received_at">
            <UInput
              v-model="state.received_at"
              type="date"
              :max="today"
              class="w-full"
            />
          </UFormField>

          <!-- Reference -->
          <UFormField label="Reference" name="reference">
            <UInput
              v-model="state.reference"
              placeholder="Optional reference number"
              class="w-full"
            />
          </UFormField>

          <!-- Notes -->
          <UFormField class="sm:col-span-2" label="Notes" name="notes">
            <UTextarea
              v-model="state.notes"
              rows="3"
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
            class="w-full sm:w-auto justify-center"
          >
            Cancel
          </UButton>

          <UButton
            type="submit"
            color="primary"
            :loading="props.loading"
            icon="i-heroicons-banknotes"
            class="w-full sm:w-auto justify-center"
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

interface Invoice {
  id?: string
  totalAmount?: number
  paidAmount?: number
  dueAmount?: number
}

interface PaymentFormState {
  amount: number
  payment_method: string
  received_at: string
  reference: string
  notes: string
  lease_id: string
  [key: string]: any
}

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

// ─── Helpers ────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0]

const getToday = () => today

const modalTitle = computed(() =>
  props.invoice.id ? 'Record Invoice Payment' : 'Record Payment'
)

const modalUi = {
  container: 'relative',
  width: 'sm:max-w-lg',
  padding: 'p-4 sm:p-6'
}

const inputUi = {
  icon: { trailing: { pointer: '' } },
  disabled: 'cursor-not-allowed opacity-75'
}

// ─── Form State ─────────────────────────────────────────────
const state = reactive<PaymentFormState>({
  amount: props.invoice.totalAmount ?? 0,
  payment_method: 'bank_transfer',
  received_at: getToday(),
  reference: '',
  notes: '',
  lease_id: props.leaseId
})

const form = ref()

const resetForm = () => {
  // Reset all form fields to their initial state
  Object.assign(state, {
    amount: props.invoice.totalAmount ?? 0,
    payment_method: 'bank_transfer',
    received_at: getToday(),
    reference: '',
    notes: '',
    lease_id: props.leaseId
  })
  
  // Reset any form validation errors if using form validation library
  if (form) {
    form.reset()
  }
}

// Auto-sync amount when invoice/total changes
watchEffect(() => {
  if (props.invoice.id) {
    state.amount = props.totalAmount || props.invoice.totalAmount || 0
  } else {
    state.amount = 0
  }
})

// ─── Validation ─────────────────────────────────────────────
const validateAmount = (val: unknown): boolean => {
  const num = Number(val)
  if (isNaN(num) || num <= 0) return false
  const max = props.invoice.totalAmount ?? props.totalAmount ?? Infinity
  return num <= max
}

const schema = v.object({
  amount: v.pipe(
    v.number('Amount must be a number'),
    v.minValue(0.01, 'Amount must be greater than 0'),
    v.custom(validateAmount)
  ),
  payment_method: v.string('Payment method is required'),
  received_at: v.string('Date is required'),
  reference: v.optional(v.string()),
  notes: v.optional(v.string()),
  lease_id: v.string('Lease ID is required')
})

// ─── Modal State ────────────────────────────────────────────
const openModel = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val)
})

// ─── Submit ─────────────────────────────────────────────────
const userStore = useUserStore()

const onSubmit = async () => {
  try {
    // Get user store and current user
    const userStore = useUserStore()
    
    if (!userStore.user?.id) {
      throw new Error('User not authenticated')
    }
    
    // Emit the submitted event with the form data and user_id
    const paymentData = {
      ...state,
      user_id: userStore.user.id.toString() // Ensure user_id is a string
    }
    
    emit('submitted', paymentData)
    
    // Reset the form
    resetForm()
    
    // Close the modal after a short delay to show success state
    setTimeout(() => {
      emit('update:open', false)
    }, 300)
  } catch (error) {
    console.error('Error submitting payment:', error)
    emit('error', error.message || 'Failed to process payment')
  }
}
</script>
