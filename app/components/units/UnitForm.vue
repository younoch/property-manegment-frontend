<!-- app/components/units -->
<template>
  <UModal 
    v-model:open="isOpen" 
    title="Add Unit"
    :ui="{  content: 'w-full sm:max-w-2xl',  header: 'p-2 sm:p-4 min-h-14', body: 'p-2 sm:p-4 ', width: 'w-full sm:max-w-2xl' }" 
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full'}"
    >
    
    <template #body>
        <UForm :state="form" :validate="validate" @submit="onSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Portfolio" name="portfolio_id" :error="errors.portfolio_id">
              <USelect
                v-model.number="form.portfolio_id"
                :items="portfolioOptions"
                placeholder="Select Portfolio"
                class="w-full"
                :disabled="true"
              />
            </UFormField>

            <UFormField label="Property" name="property_id" :error="errors.property_id">
              <USelect
                v-model.number="form.property_id"
                :items="propertyOptions"
                placeholder="Select Property"
                class="w-full"
                :disabled="true"
              />
            </UFormField>

            <UFormField label="Label" name="label" :error="errors.label">
              <UInput v-model="form.label" placeholder="Unit 2B" class="w-full" :disabled="isViewing"/>
            </UFormField>

            <UFormField label="Bedrooms" name="bedrooms" :error="errors.bedrooms">
              <UInput v-model.number="form.bedrooms" type="number" min="0" step="1" class="w-full" :disabled="isViewing"/>
            </UFormField>

            <UFormField label="Bathrooms" name="bathrooms" :error="errors.bathrooms">
              <UInput v-model.number="form.bathrooms" type="number" min="0" step="0.5" class="w-full"  :disabled="isViewing"/>
            </UFormField>

            <UFormField label="Square Feet" name="sqft" :error="errors.sqft">
              <UInput v-model.number="form.sqft" type="number" min="0" step="1" class="w-full" :disabled="isViewing" />
            </UFormField>

            <UFormField label="Market Rent" name="market_rent" :error="errors.market_rent">
              <UInput v-model.number="form.market_rent" type="number" min="0" step="1" class="w-full" :disabled="isViewing" />
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
import { object, number, string, minLength, pipe, safeParse, nullable, optional, message } from 'valibot'
import { createProtectedApiClient } from '../../utils/api'
import { UNIT_STATUSES } from '../../constants/units'
import { useApiToast } from '../../composables/useApiToast'

const props = defineProps<{ open: boolean; model?: Partial<any> | null; view?: boolean; portfolioId?: number; propertyId?: number; portfolioOptions?: any[]; propertyOptions?: any[] }>()
const emit = defineEmits<{
  'update:open': [value: boolean];
  created: [value: any];
  updated: [value: any];
}>()

const { success: toastSuccess, error: toastError } = useApiToast()
const isEditing = computed(() => !!props.model?.id)
const isViewing = computed(() => !!props.view)

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

const submitting = ref(false)
const api = createProtectedApiClient()

const form = reactive({
  portfolio_id: props.portfolioId ?? 0,
  property_id: props.propertyId ?? 0,
  label: '',
  bedrooms: 0,
  bathrooms: 0,
  sqft: 0,
  market_rent: 0,
})
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      if (props.model && props.model.id) {
        form.portfolio_id = props.model.portfolio_id ?? props.portfolioId ?? 0
        form.property_id = props.model.property_id ?? props.propertyId ?? 0
        form.label = String(props.model.label ?? '')
        form.bedrooms = Number(props.model.bedrooms ?? 0)
        form.bathrooms = Number(props.model.bathrooms ?? 0)
        form.sqft = Number(props.model.sqft ?? 0)
        form.market_rent = Number(props.model.market_rent ?? 0)
      } else {
        resetForm()
      }
    }
  }
)

watch(() => props.portfolioId, (id) => {
  if (typeof id === 'number' && id > 0) form.portfolio_id = id
}, { immediate: true })

watch(() => props.propertyId, (id) => {
  if (typeof id === 'number' && id > 0) form.property_id = id
}, { immediate: true })

const errors = reactive<Record<string, string | undefined>>({})

const Schema = object({
  portfolio_id: number(),
  property_id: number(),
  label: pipe(string(), minLength(1)),
  bedrooms: number(),
  bathrooms: number(),
  sqft: number(),
  market_rent: number()
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
  form.portfolio_id = props.portfolioId ?? 0
  form.property_id = props.propertyId ?? 0
  form.label = ''
  form.bedrooms = 0
  form.bathrooms = 0
  form.sqft = 0
  form.market_rent = 0
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
    if (isEditing.value && props.model?.id) {
      const response = await api.patch<any>(`/units/${props.model.id}`, { ...form })
      emit('updated', response?.data ?? { ...form, id: props.model.id })
      isOpen.value = false
    } else {
      const portfolioId = form.portfolio_id
      const propertyId = form.property_id
      const response = await api.post<any>(`/portfolios/${portfolioId}/properties/${propertyId}/units`, { ...form })
      toastSuccess(response?.message || 'unit updated')
      emit('created', response?.data ?? { ...form, id: response?.data?.id })
      isOpen.value = false
    }
  } catch (err: any) {
    // Error toast handled by api client
  } finally {
    submitting.value = false
  }
}

const portfolioOptions = computed(() => Array.isArray(props.portfolioOptions) ? props.portfolioOptions : (form.portfolio_id ? [{ label: `Portfolio #${form.portfolio_id}`, value: form.portfolio_id }] : []))
const propertyOptions = computed(() => Array.isArray(props.propertyOptions) ? props.propertyOptions : [])
const statusOptions = computed(() => UNIT_STATUSES.map(s => ({ label: s.label, value: s.value })))

</script>


