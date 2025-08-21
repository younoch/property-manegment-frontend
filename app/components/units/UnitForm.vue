<template>
  <UModal 
    v-model:open="isOpen" 
    title="Add Unit"
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
              <UInput v-model="form.label" placeholder="Unit 2B" class="w-full" />
            </UFormField>

            <UFormField label="Bedrooms" name="bedrooms" :error="errors.bedrooms">
              <UInput v-model.number="form.bedrooms" type="number" min="0" step="1" class="w-full" />
            </UFormField>

            <UFormField label="Bathrooms" name="bathrooms" :error="errors.bathrooms">
              <UInput v-model.number="form.bathrooms" type="number" min="0" step="0.5" class="w-full" />
            </UFormField>

            <UFormField label="Square Feet" name="sqft" :error="errors.sqft">
              <UInput v-model.number="form.sqft" type="number" min="0" step="1" class="w-full" />
            </UFormField>

            <UFormField label="Market Rent" name="market_rent" :error="errors.market_rent">
              <UInput v-model.number="form.market_rent" type="number" min="0" step="1" class="w-full" />
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
import { object, number, string, minLength, pipe, safeParse, nullable, optional } from 'valibot'
import { createProtectedApiClient } from '../../utils/api'

const props = defineProps<{ open: boolean; portfolioId?: number; propertyId?: number; portfolioOptions?: any[]; propertyOptions?: any[] }>()
const emit = defineEmits<{
  'update:open': [value: boolean];
  created: [value: any];
}>()

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
  market_rent: 0
})

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
  label: pipe(string(), minLength(1, 'Label is required')),
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

const onClose = () => { isOpen.value = false }

const onSubmit = async () => {
  const validation = validate(form)
  if (validation.length) return
  submitting.value = true
  try {
    const portfolioId = form.portfolio_id
    const propertyId = form.property_id
    const response = await api.post<any>(`/portfolios/${portfolioId}/properties/${propertyId}/units`, { ...form })
    emit('created', response?.data ?? { ...form, id: response?.data?.id })
    isOpen.value = false
  } catch (err: any) {
    // Error toast handled by api client
  } finally {
    submitting.value = false
  }
}

const portfolioOptions = computed(() => Array.isArray(props.portfolioOptions) ? props.portfolioOptions : (form.portfolio_id ? [{ label: `Portfolio #${form.portfolio_id}`, value: form.portfolio_id }] : []))
const propertyOptions = computed(() => Array.isArray(props.propertyOptions) ? props.propertyOptions : [])

</script>


