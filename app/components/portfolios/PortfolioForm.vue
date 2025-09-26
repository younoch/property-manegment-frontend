<template>
  <UModal
    v-model:open="isOpen"
    :title="modalTitle"
    :ui="{ content: 'w-full sm:max-w-2xl', header: 'p-3 sm:p-4 min-h-14', body: 'p-3 sm:p-4', width: 'w-full sm:max-w-2xl' }"
    :close="{ color: 'error', variant: 'outline', class: 'rounded-full' }"
  >
    <template #body>
      <div class="h-fit">
        <div class="mb-3 text-sm text-muted-foreground" v-if="!isViewing">
          A portfolio is a simple container for your properties (e.g., “Personal”, “Family”, “Investments”).
        </div>

        <UForm :state="form" :validate="validate" @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Name" name="name" :error="errors.name" class="sm:col-span-2" help="Pick something recognizable." required>
              <UInput
                v-model="form.name"
                :disabled="isViewing"
                placeholder="e.g., Personal Portfolio"
                class="w-full"
                :autofocus="true"
              />
            </UFormField>

            <UFormField label="Subscription Plan" name="subscription_plan" :error="errors.subscription_plan" help="You can change this later.">
              <USelect
                v-model="form.subscription_plan"
                :items="subscriptionPlanOptions"
                :disabled="isViewing"
                placeholder="Select plan"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Provider Customer ID" name="provider_customer_id" :error="errors.provider_customer_id" help="Optional. For external billing systems.">
              <UInput
                v-model="form.provider_customer_id"
                :disabled="isViewing"
                placeholder="Optional external customer id"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Timezone" name="timezone" :error="errors.timezone" class="sm:col-span-2">
              <USelectMenu
                v-model="selectedTimezone"
                :items="timezoneOptions"
                :disabled="isViewing"
                placeholder="Select timezone"
                class="w-full"
                searchable
                searchable-placeholder="Search timezone..."
                :uiMenu="{ option: { base: 'w-full' } }"
                @update:model-value="updateTimezone"
              >
                <template #label>
                  {{ selectedTimezone?.label || 'Select timezone' }}
                </template>
              </USelectMenu>
              <template #help>
                <div class="text-xs text-muted-foreground">This will be used for all date-related operations in this portfolio.</div>
              </template>
            </UFormField>
          </div>

          <div class="flex items-center justify-end gap-2 mt-6">
            <UButton color="gray" variant="soft" @click.prevent="onClose">{{ isViewing ? 'Close' : 'Cancel' }}</UButton>
            <UButton v-if="!isViewing" type="submit" :loading="submitting">{{ isEditing ? 'Save changes' : 'Create portfolio' }}</UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { object, string, minLength, pipe, safeParse } from 'valibot'
import { createProtectedApiClient } from '../../utils/api'
import { useApiToast } from '../../composables/useApiToast'
import { useAuth } from '../../composables/useAuth'
import { SUBSCRIPTION_PLAN_OPTIONS } from '../../constants'
import timezones from 'timezones-list'

interface TimezoneOption {
  label: string
  value: string
}

interface AddPortfolioPayload {
  name: string
  landlord_id: number
  subscription_plan: string
  provider_customer_id?: string
  timezone: string
}
interface CreatedPortfolio {
  id?: number | string
  name: string
  landlord_id?: number | string
  subscription_plan?: string
  provider_customer_id?: string
  [key: string]: any
}

const props = defineProps<{ open: boolean; model?: Partial<CreatedPortfolio> | null; view?: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean]; created: [value: CreatedPortfolio]; updated: [value: CreatedPortfolio]; }>()

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

const submitting = ref(false)
const api = createProtectedApiClient()
const { success: toastSuccess, error: toastError } = useApiToast()
const { user } = useAuth()

const subscriptionPlanOptions = SUBSCRIPTION_PLAN_OPTIONS

// Prepare timezone options for the select
const timezoneOptions = timezones.map(tz => ({
  label: `${tz.name} (${tz.tzCode})`,
  value: tz.tzCode
}))

// Default timezone to system timezone if available
const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const selectedTimezone = ref<TimezoneOption | null>(
  timezoneOptions.find(tz => tz.value === defaultTimezone) || null
)

const form = reactive<Omit<AddPortfolioPayload, 'landlord_id'>>({
  name: '',
  subscription_plan: '',
  provider_customer_id: '',
  timezone: selectedTimezone.value?.value || defaultTimezone
})
const errors = reactive<Record<string, string | undefined>>({})
const isEditing = computed(() => !!props.model?.id)
const isViewing = computed(() => !!props.view)
const modalTitle = computed(() => isViewing.value ? 'View Portfolio' : (isEditing.value ? 'Edit Portfolio' : 'Create Portfolio'))

const Schema = object({
  name: pipe(string(), minLength(1, 'Portfolio name is required')),
  subscription_plan: pipe(string(), minLength(1, 'Please select a subscription plan')),
  timezone: pipe(string(), minLength(1, 'Please select a timezone')),
  provider_customer_id: string()
})

const updateTimezone = (value: TimezoneOption | null) => {
  if (value) {
    form.timezone = value.value
  }
}

const validate = (state: typeof form) => {
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
  const defaultTz = timezoneOptions.find(tz => tz.value === defaultTimezone) || null
  selectedTimezone.value = defaultTz
  Object.assign(form, {
    name: '',
    subscription_plan: '',
    provider_customer_id: '',
    timezone: defaultTz?.value || defaultTimezone
  })
  Object.keys(errors).forEach((k) => delete errors[k])
}

const onClose = () => { isOpen.value = false }

watch(
  () => props.open,
  (v) => {
    if (v) {
      resetForm()
      if (props.model) {
        // Only copy model properties that exist in the form
        Object.keys(form).forEach(key => {
          if (key in props.model!) {
            if (key === 'timezone') {
              const tz = timezoneOptions.find(tz => tz.value === props.model?.[key])
              if (tz) {
                selectedTimezone.value = tz
                form.timezone = tz.value
              }
            } else {
              // @ts-ignore - We know the key exists in model
              form[key] = props.model[key] || form[key]
            }
          }
        })
      }
    }
  },
  { immediate: true }
)

const onSubmit = async (event: Event) => {
  event.preventDefault()
  
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])
  
  // Validate form
  const validation = validate(form)
  if (Object.keys(validation).length > 0) {
    Object.assign(errors, validation)
    return
  }
  console.log('Form is valid')

  submitting.value = true
  try {
    // Ensure form data is properly formatted
    const formData = {
      name: form.name.trim(),
      subscription_plan: form.subscription_plan,
      provider_customer_id: form.provider_customer_id?.trim() || undefined,
      timezone: form.timezone
    }
    const landlordIdRaw = user.value?.id
    const landlordIdNumber = typeof landlordIdRaw === 'string' ? Number(landlordIdRaw) : (landlordIdRaw as any)
    const payload: AddPortfolioPayload = {
      ...formData,
      landlord_id: Number.isFinite(landlordIdNumber) ? landlordIdNumber : 0
    }

    if (isEditing.value && props.model?.id) {
      const response = await api.patch<CreatedPortfolio>(`/portfolios/${props.model.id}`, payload)
      toastSuccess(response?.message || 'Portfolio updated')
      emit('updated', response?.data ?? { id: props.model.id, ...payload })
    } else {
      const response = await api.post<CreatedPortfolio>('/portfolios', payload)
      toastSuccess(response?.message || 'Portfolio created')
      emit('created', response?.data ?? { ...payload })
    }
    isOpen.value = false
  } catch (err: any) {
    toastError(err?.data?.message || err?.message || 'Request failed')
    console.error('Portfolio submit error:', err)
  } finally {
    submitting.value = false
  }
}
</script>
