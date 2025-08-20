<template>
  <UModal 
    v-model:open="isOpen" 
    title="Create Portfolio" 
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
            <UFormField label="Name" name="name" :error="errors.name" class="sm:col-span-2">
              <UInput v-model="form.name" placeholder="Rental Portfolio A" class="w-full" />
            </UFormField>

            <UFormField label="Subscription Plan" name="subscription_plan" :error="errors.subscription_plan">
              <USelect
                v-model="form.subscription_plan"
                :items="subscriptionPlanOptions"
                placeholder="Select plan"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Provider Customer ID" name="provider_customer_id" :error="errors.provider_customer_id">
              <UInput v-model="form.provider_customer_id" placeholder="Optional external customer id" class="w-full" />
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
import { object, string, minLength, safeParse, optional } from 'valibot'
import { createProtectedApiClient } from '../../utils/api'
import { useApiToast } from '../../composables/useApiToast'
import { useAuth } from '../../composables/useAuth'
import { SUBSCRIPTION_PLAN_OPTIONS } from '../../constants'

interface AddPortfolioPayload {
  name: string
  landlord_id: number
  subscription_plan: string
  provider_customer_id?: string
}

interface CreatedPortfolio {
  id?: number | string
  name: string
  landlord_id?: number | string
  subscription_plan?: string
  provider_customer_id?: string
  [key: string]: any
}

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean]; created: [value: CreatedPortfolio] }>()

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

const submitting = ref(false)
const api = createProtectedApiClient()
const { success: toastSuccess, error: toastError } = useApiToast()
const { user } = useAuth()

const subscriptionPlanOptions = SUBSCRIPTION_PLAN_OPTIONS

const form = reactive<Pick<AddPortfolioPayload, 'name' | 'subscription_plan' | 'provider_customer_id'>>({
  name: '',
  subscription_plan: 'basic',
  provider_customer_id: ''
})

const errors = reactive<Record<string, string | undefined>>({})

const Schema = object({
  name: string([minLength(2, 'Name must be at least 2 characters')]),
  subscription_plan: string([minLength(1, 'Please select a plan')]),
  provider_customer_id: optional(string())
})

const validate = (state: typeof form) => {
  const result = safeParse(Schema, state)
  if (result.success) {
    Object.keys(errors).forEach((k) => delete errors[k])
    return []
  }
  Object.keys(errors).forEach((k) => delete errors[k])
  result.issues.forEach((issue: any) => {
    const path = Array.isArray(issue.path) && issue.path.length > 0 ? issue.path[0]?.key : undefined
    if (path && typeof path === 'string') {
      errors[path] = issue.message
    }
  })
  return result.issues
}

const resetForm = () => {
  form.name = ''
  form.subscription_plan = 'basic'
  form.provider_customer_id = ''
  Object.keys(errors).forEach((k) => delete errors[k])
}

const onClose = () => {
  isOpen.value = false
}

watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      resetForm()
    }
  }
)

const onSubmit = async () => {
  const validation = validate(form)
  if (validation.length) return
  submitting.value = true
  try {
    const landlordIdRaw = user.value?.id
    const landlordIdNumber = typeof landlordIdRaw === 'string' ? Number(landlordIdRaw) : (landlordIdRaw as any)

    const payload: AddPortfolioPayload = {
      name: form.name,
      landlord_id: Number.isFinite(landlordIdNumber) ? landlordIdNumber : 0,
      subscription_plan: form.subscription_plan,
      provider_customer_id: form.provider_customer_id || ''
    }

    const response = await api.post<CreatedPortfolio>('/portfolios', payload)
    toastSuccess(response?.message || 'Portfolio created')
    emit('created', response?.data ?? { ...payload })
    isOpen.value = false
  } catch (err: any) {
    const message = err?.data?.message || err?.message || 'Failed to create portfolio'
    toastError(message)
    console.error('Portfolio create error:', err)
  } finally {
    submitting.value = false
  }
}
</script>


