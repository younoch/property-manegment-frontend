<template>
  <UModal
    v-model:open="openModel"
    :title="modalTitle"
    :ui="modalUi"
  >
    <template #body>
      <UForm
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
          <UFormField label="Method" name="method">
            <USelect
              v-model="state.method"
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
  method: string
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
  method: 'bank_transfer',
  received_at: getToday(),
  reference: '',
  notes: '',
  lease_id: props.leaseId
})

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
  method: v.string('Method is required'),
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

const resetForm = () => {
  Object.assign(state, {
    amount: 0,
    method: 'cash',
    received_at: getToday(),
    reference: '',
    notes: ''
  })
}

const onSubmit = () => {
  try {
    emit('submitted', {
      ...state,
      amount: Number(state.amount),
      portfolio_id: props.portfolioId,
      user_id: userStore.user?.id,
      invoice_id: props.invoice.id ?? null,
      payment_method: state.method
    })
    resetForm()
  } catch (err) {
    console.error('Payment submission error:', err)
    emit('error', 'Failed to process payment. Please try again.')
  }
}
</script>
