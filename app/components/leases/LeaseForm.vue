<template>
  <UModal 
    v-model:open="isOpen" 
    title="Add Lease"
    :ui="{  content: 'w-full sm:max-w-2xl',  header: 'p-2 sm:p-4 min-h-14', body: 'p-2 sm:p-4 ', width: 'w-full sm:max-w-2xl' }" 
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full'
    }">
    
    <template #body>
      <UPlaceholder class="h-fit">
        <UForm :state="form" :validate="validate" @submit="onSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Portfolio" name="portfolio_id" :error="errors.portfolio_id">
              <USelect
                v-model.number="form.portfolio_id"
                :items="portfolioOptions"
                class="w-full"
                :disabled="true"
              />
            </UFormField>

            <UFormField label="Unit" name="unit_id" :error="errors.unit_id">
              <USelect
                v-model.number="form.unit_id"
                :items="unitOptions"
                class="w-full"
                :disabled="true"
              />
            </UFormField>

            <UFormField label="Start Date" name="start_date" :error="errors.start_date">
              <UInput v-model="form.start_date" type="date" class="w-full" />
            </UFormField>

            <UFormField label="End Date" name="end_date" :error="errors.end_date">
              <UInput v-model="form.end_date" type="date" class="w-full" />
            </UFormField>

            <UFormField label="Rent" name="rent" :error="errors.rent">
              <UInput v-model.number="form.rent" type="number" min="0" step="1" class="w-full" />
            </UFormField>

            <UFormField label="Deposit" name="deposit" :error="errors.deposit">
              <UInput v-model.number="form.deposit" type="number" min="0" step="1" class="w-full" />
            </UFormField>

            <UFormField label="Status" name="status" :error="errors.status">
              <USelect
                v-model="form.status"
                :items="statusOptions"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="flex items-center justify-end gap-2 mt-6">
            <UButton color="gray" variant="soft" @click.prevent="onClose">Cancel</UButton>
            <UButton type="submit" :loading="submitting">Create</UButton>
          </div>
        </UForm>
      </UPlaceholder>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { object, number, string, minLength, pipe, safeParse } from 'valibot'
import { createProtectedApiClient } from '../../utils/api'
import { LEASE_STATUSES } from '../../constants/leases'

const props = defineProps<{ open: boolean; portfolioId?: number; unitId?: number; portfolioOptions?: any[]; unitOptions?: any[] }>()
const emit = defineEmits<{ 'update:open': [value: boolean]; created: [value: any]; }>()

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

const submitting = ref(false)
const api = createProtectedApiClient()

const form = reactive({
  portfolio_id: props.portfolioId ?? 0,
  unit_id: props.unitId ?? 0,
  start_date: '',
  end_date: '',
  rent: 0,
  deposit: 0,
  status: 'draft'
})

watch(() => props.portfolioId, (id) => {
  if (typeof id === 'number' && id > 0) form.portfolio_id = id
}, { immediate: true })

watch(() => props.unitId, (id) => {
  if (typeof id === 'number' && id > 0) form.unit_id = id
}, { immediate: true })

const errors = reactive<Record<string, string | undefined>>({})

const Schema = object({
  portfolio_id: number(),
  unit_id: number(),
  start_date: string(),
  end_date: string(),
  rent: number(),
  deposit: number(),
  status: string()
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

const onClose = () => { isOpen.value = false }

const statusOptions = LEASE_STATUSES.map(s => ({ label: s.label, value: s.value }))

const onSubmit = async () => {
  const validation = validate(form)
  if (validation.length) return
  submitting.value = true
  try {
    const portfolioId = form.portfolio_id
    const unitId = form.unit_id
    const response = await api.post<any>(`/portfolios/${portfolioId}/units/${unitId}/leases`, { ...form })
    emit('created', response?.data ?? { ...form, id: response?.data?.id })
    isOpen.value = false
  } catch (err: any) {
  } finally {
    submitting.value = false
  }
}

const portfolioOptions = computed(() => Array.isArray(props.portfolioOptions) ? props.portfolioOptions : (form.portfolio_id ? [{ label: `Portfolio #${form.portfolio_id}`, value: form.portfolio_id }] : []))
const unitOptions = computed(() => Array.isArray(props.unitOptions) ? props.unitOptions : (form.unit_id ? [{ label: `Unit #${form.unit_id}`, value: form.unit_id }] : []))

</script>


