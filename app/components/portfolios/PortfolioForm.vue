<template>
  <UModal
    v-model:open="isOpen"
    title="Create New Portfolio"
    :ui="{ content: 'w-full sm:max-w-2xl', header: 'p-3 sm:p-4 min-h-14', body: 'p-3 sm:p-4', width: 'w-full sm:max-w-2xl' }"
    :close="{ color: 'error', variant: 'outline', class: 'rounded-full' }"
  >
    <template #body>
      <div class="h-fit">
        <div class="mb-3 text-sm text-muted-foreground">
          A portfolio is a simple container for your properties (e.g., "Personal", "Family", "Investments").
        </div>

        <UForm :state="form" :validate="validate" @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Name" name="name" :error="errors.name" class="sm:col-span-2" help="Pick something recognizable." required>
              <UInput
                v-model="form.name"
                placeholder="e.g., Personal Portfolio"
                class="w-full"
                autofocus
              />
            </UFormField>

            <UFormField label="Provider Customer ID" name="provider_customer_id" :error="errors.provider_customer_id" help="Optional. For external billing systems.">
              <UInput
                v-model="form.provider_customer_id"
                placeholder="Optional external customer id"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Timezone" name="timezone" :error="errors.timezone">
              <USelectMenu
                v-model="selectedTimezone"
                :items="timezoneOptions"
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
            <UButton color="gray" variant="soft" @click.prevent="onClose">Cancel</UButton>
            <UButton type="submit" :loading="submitting">Create portfolio</UButton>
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
import timezones from 'timezones-list'

interface TimezoneOption {
  label: string
  value: string
}

interface AddPortfolioPayload {
  name: string
  landlord_id: string
  subscription_plan: string
  provider_customer_id?: string
  timezone: string
}
interface CreatedPortfolio {
  id: string
  name: string
  landlord_id: string
  subscription_plan: string
  provider_customer_id?: string
  timezone: string
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
  subscription_plan: 'free',
  provider_customer_id: '',
  timezone: selectedTimezone.value?.value || defaultTimezone
})

const errors = reactive<Record<string, string | undefined>>({})

const Schema = object({
  name: pipe(string(), minLength(1, 'Portfolio name is required')),
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
    subscription_plan: 'free',
    provider_customer_id: '',
    timezone: defaultTz?.value || defaultTimezone
  })
  Object.keys(errors).forEach(key => delete errors[key])
}

const onClose = () => { isOpen.value = false }

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm()
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

  submitting.value = true
  try {
    // Ensure form data is properly formatted
    const formData = {
      name: form.name.trim(),
      subscription_plan: form.subscription_plan,
      provider_customer_id: form.provider_customer_id?.trim() || undefined,
      timezone: form.timezone
    }
    
    const landlordId = user.value?.id
    
    if (!landlordId) {
      throw new Error('User ID not found')
    }

    const payload: AddPortfolioPayload = {
      ...formData,
      landlord_id: landlordId.toString()
    }

    const response = await api.post<CreatedPortfolio>('/portfolios', payload)
    toastSuccess(response?.message || 'Portfolio created successfully')
    
    // Create a complete portfolio object with the response data
    const createdPortfolio: CreatedPortfolio = {
      id: response.data?.id?.toString() || '',
      name: payload.name,
      landlord_id: payload.landlord_id,
      subscription_plan: payload.subscription_plan,
      provider_customer_id: payload.provider_customer_id,
      timezone: payload.timezone,
      ...(response.data || {}) // Include any additional fields from the response
    }
    
    emit('created', createdPortfolio)
    isOpen.value = false
  } catch (err: any) {
    const errorMessage = err?.data?.message || err?.message || 'Failed to create portfolio'
    toastError(errorMessage)
  } finally {
    submitting.value = false
  }
}
</script>
