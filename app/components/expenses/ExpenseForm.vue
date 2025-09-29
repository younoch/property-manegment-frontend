<!-- app/components/expenses/ExpenseForm.vue -->
<template>
  <UModal 
    v-model:open="isOpen" 
    :title="isEditing ? 'Edit Expense' : 'Add Expense'"
    :ui="{ content: 'w-full sm:max-w-2xl', header: 'p-2 sm:p-4 min-h-14', body: 'p-2 sm:p-4', width: 'w-full sm:max-w-2xl' }" 
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full'}" 
  >
    <template #body>
      <UForm :state="form" :validate="validate" @submit="onSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField label="Property" name="property_id" :error="errors.property_id">
            <USelect
              v-model.number="form.property_id"
              :items="propertyOptions"
              placeholder="Select Property"
              class="w-full"
              :disabled="isViewing || !!propertyId"
            />
          </UFormField>

          <UFormField label="Amount" name="amount" :error="errors.amount">
            <UInput 
              v-model.number="form.amount" 
              type="number" 
              min="0" 
              step="0.01" 
              class="w-full" 
              :disabled="isViewing"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template #leading>
                <span class="text-gray-500 dark:text-gray-400 text-sm">$</span>
              </template>
            </UInput>
          </UFormField>

          <UFormField label="Category" name="category" :error="errors.category">
            <USelect
              v-model="form.category"
              :items="categoryOptions"
              placeholder="Select Category"
              class="w-full"
              :disabled="isViewing"
            />
          </UFormField>

          <UFormField label="Date Incurred" name="date_incurred" :error="errors.date_incurred">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton
                color="gray"
                variant="outline"
                :disabled="isViewing"
                class="w-full justify-start text-left font-normal"
                :class="!form.date_incurred ? 'text-gray-400' : ''"
              >
                <UIcon name="i-heroicons-calendar" class="mr-2 h-4 w-4" />
                {{ form.date_incurred ? format(form.date_incurred, 'PPP') : 'Pick a date' }}
              </UButton>
              <template #panel="{ close }">
                <DatePicker
                  v-model="form.date_incurred"
                  @close="close"
                />
              </template>
            </UPopover>
          </UFormField>

          <UFormField label="Status" name="status" :error="errors.status">
            <USelect
              v-model="form.status"
              :items="statusOptions"
              placeholder="Select Status"
              class="w-full"
              :disabled="isViewing"
            />
          </UFormField>

          <UFormField label="Payment Method" name="payment_method" :error="errors.payment_method">
            <USelect
              v-model="form.payment_method"
              :items="paymentMethods"
              placeholder="Select payment method"
              class="w-full"
              :disabled="isViewing"
            />
          </UFormField>

          <UFormField label="Vendor" name="vendor" :error="errors.vendor">
            <UInput v-model="form.vendor" placeholder="Vendor name" class="w-full" :disabled="isViewing" />
          </UFormField>

          <UFormField label="Receipt URL" name="receipt_url" :error="errors.receipt_url">
            <UInput v-model="form.receipt_url" type="url" placeholder="https://example.com/receipt.pdf" class="w-full" :disabled="isViewing" />
          </UFormField>

          <UFormField label="Tax Information" class="sm:col-span-2">
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Tax Amount" name="tax_amount" :error="errors.tax_amount">
                <UInput 
                  v-model.number="form.tax_amount" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  class="w-full" 
                  :disabled="isViewing"
                  :ui="{ icon: { trailing: { pointer: '' } } }"
                >
                  <template #leading>
                    <span class="text-gray-500 dark:text-gray-400 text-sm">$</span>
                  </template>
                </UInput>
              </UFormField>
              <UFormField label="Tax Rate %" name="tax_rate" :error="errors.tax_rate">
                <UInput 
                  v-model.number="form.tax_rate" 
                  type="number" 
                  min="0" 
                  max="100" 
                  step="0.01" 
                  class="w-full" 
                  :disabled="isViewing"
                >
                  <template #trailing>
                    <span class="text-gray-500 dark:text-gray-400 text-sm">%</span>
                  </template>
                </UInput>
              </UFormField>
            </div>
          </UFormField>

          <UFormField label="Description" name="description" :error="errors.description" class="sm:col-span-2">
            <UTextarea v-model="form.description" placeholder="Expense description" class="w-full" :disabled="isViewing" />
          </UFormField>

          <UFormField label="Notes" name="notes" :error="errors.notes" class="sm:col-span-2">
            <UTextarea v-model="form.notes" placeholder="Additional notes" class="w-full" :disabled="isViewing" />
          </UFormField>
        </div>

          <div class="flex items-center justify-end gap-2 mt-6" v-if="!isViewing">
            <UButton color="gray" variant="soft" @click.prevent="onClose">{{ isViewing ? 'Close' : 'Cancel' }}</UButton>
            <UButton type="submit" :loading="submitting">{{ isEditing ? 'Save' : 'Create' }}</UButton>
          </div>
        </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { object, number, string, minLength, pipe, safeParse, nullable, optional, message, instance, minValue, url } from 'valibot'
import { createProtectedApiClient } from '../../utils/api'
import { UNIT_STATUSES } from '../../constants/units'
import { useApiToast } from '../../composables/useApiToast'

const props = defineProps<{ open: boolean; model?: Partial<any> | null; view?: boolean; portfolioId?: number; propertyId?: number; portfolioOptions?: any[]; propertyOptions?: any[] }>()
const emit = defineEmits<{
  'update:open': [value: boolean];
  created: [value: any];
  updated: [value: any];
}>()

const route = useRoute()

const { success: toastSuccess, error: toastError } = useApiToast()
const isEditing = computed(() => !!props.model?.id)
const isViewing = computed(() => !!props.view)

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

const submitting = ref(false)
const api = createProtectedApiClient()

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface ExpenseFormData {
  property_id: number;
  amount: number;
  category: string;
  date_incurred: string;
  status: string;
  description: string;
  vendor: string;
  payment_method: string;
  receipt_url: string;
  tax_amount: number;
  tax_rate: number;
  notes: string;
}

const form = reactive<ExpenseFormData>({
  property_id: props.propertyId ?? 0,
  amount: 0,
  category: '',
  date_incurred: formatDate(new Date()), // Initialize with formatted date string
  status: 'pending',
  description: '',
  vendor: '',
  payment_method: '',
  receipt_url: '',
  tax_amount: 0,
  tax_rate: 0,
  notes: ''
})
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      if (props.model && props.model.id) {
        form.property_id = props.model.property_id ?? props.propertyId ?? 0
        form.amount = Number(props.model.amount ?? 0)
        form.category = String(props.model.category ?? '')
        // Ensure date_incurred is a properly formatted string
        form.date_incurred = props.model.date_incurred 
          ? formatDate(new Date(props.model.date_incurred))
          : formatDate(new Date())
        form.status = String(props.model.status ?? 'pending')
        form.description = String(props.model.description ?? '')
        form.vendor = String(props.model.vendor ?? '')
        form.payment_method = String(props.model.payment_method ?? '')
        form.receipt_url = String(props.model.receipt_url ?? '')
        form.tax_amount = Number(props.model.tax_amount ?? 0)
        form.tax_rate = Number(props.model.tax_rate ?? 0)
        form.notes = String(props.model.notes ?? '')
      } else {
        resetForm()
      }
    }
  }
)

watch(() => props.propertyId, (id) => {
  if (typeof id === 'number' && id > 0) form.property_id = id
}, { immediate: true })

const errors = reactive<Record<string, string | undefined>>({})

const Schema = object({
  property_id: number(),
  amount: pipe(number(), minValue(0.01, 'Amount must be greater than 0')),
  category: pipe(string(), minLength(1, 'Category is required')),
  date_incurred: pipe(string(), minLength(1, 'Date is required')), // Will be converted to Date object in the component
  status: string(),
  description: pipe(string(), minLength(1, 'Description is required')),
  vendor: pipe(string(), minLength(1, 'Vendor is required')),
  payment_method: pipe(string(), minLength(1, 'Payment method is required')),
  receipt_url: pipe(string(), url('Please enter a valid URL')),
  tax_amount: number(),
  tax_rate: number(),
  notes: string()
})

const validate = (state: any) => {
  const result = safeParse(Schema, state)
  if (result.success) {
    Object.keys(errors).forEach((k) => delete errors[k])
    return []
  }
  Object.keys(errors).forEach((k) => delete errors[k])
  result.issues.forEach((issue: any) => {
    const path = Array.isArray(issue.path) && issue.path.length > 0 ? issue.path[0]?.key : undefined
    if (path && typeof path === 'string') errors[path] = issue.message
  })
  return result.issues
}

const resetForm = () => {
  form.property_id = props.propertyId ?? 0
  form.amount = 0
  form.category = ''
  form.date_incurred = formatDate(new Date())
  form.status = 'pending'
  form.description = ''
  form.vendor = ''
  form.payment_method = ''
  form.receipt_url = ''
  form.tax_amount = 0
  form.tax_rate = 0
  form.notes = ''
}

const onClose = () => {
  isOpen.value = false
  resetForm()
}

const onSubmit = async () => {
  const validation = validate(form)
  if (validation.length) return
  
  submitting.value = true
  try {
    // Ensure date_incurred is a string in YYYY-MM-DD format
    let formattedDate = ''
    if (form.date_incurred) {
      const date = new Date(form.date_incurred)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      formattedDate = `${year}-${month}-${day}`
    }
  
    const payload = {
      ...form,
      date_incurred: formattedDate,
      tax_amount: Number(form.tax_amount) || 0,
      tax_rate: Number(form.tax_rate) || 0,
      amount: Number(form.amount)
    }

    if (isEditing.value && props.model?.id) {
      const propertyId = form.property_id
      const response = await api.patch<any>(`/properties/${propertyId}/expenses/${props.model.id}`, payload)
      emit('updated', response?.data ?? { ...form, id: props.model.id })
      toastSuccess('Expense updated successfully')
    } else {
      const propertyId = form.property_id
      const response = await api.post<any>(`/properties/${propertyId}/expenses`, payload)
      emit('created', response?.data ?? { ...form, id: response?.data?.id })
      toastSuccess('Expense created successfully')
    }
    
    isOpen.value = false
  } catch (err: any) {
    // Error toast handled by api client
  } finally {
    submitting.value = false
  }
}

import { expenseCategories, expenseStatuses, paymentMethods } from '~/constants/expense'
import { format } from 'date-fns'

const propertyOptions = computed(() => Array.isArray(props.propertyOptions) ? props.propertyOptions : (form.property_id ? [{ label: `Property #${form.property_id}`, value: form.property_id }] : []))

const categoryOptions = computed(() => expenseCategories.map(c => ({
  label: c.label,
  value: c.value,
  icon: c.icon
})))

const statusOptions = computed(() => expenseStatuses.map(s => ({
  label: s.label,
  value: s.value,
  color: s.color
})))

</script>


