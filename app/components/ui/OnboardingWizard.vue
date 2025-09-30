<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { object, string, minLength, pipe, safeParse, email as validateEmail } from 'valibot'
import { createProtectedApiClient } from '../../utils/api'
import { useApiToast } from '../../composables/useApiToast'
import { useAuth } from '../../composables/useAuth'
import { PROPERTY_TYPES } from '../../constants/property'

interface Property {
  name: string
  type: string
}

interface Tenant {
  name: string
  email: string
  phone: string
}

interface ApiResponse<T = any> {
  data: T
  message?: string
}

interface PortfolioResponse {
  id: number | string
  [key: string]: any
}

interface OnboardingData {
  portfolio: { name: string }
  property: Property
  tenant: Tenant
  [key: string]: any
}

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean]; completed: [void] }>()

const step = ref(1)
const skippedSteps = useStorage<number[]>('onboarding-skipped', [])
const submitting = ref(false)
const api = createProtectedApiClient()
const { success: toastSuccess, error: toastError } = useApiToast()
const { user } = useAuth()

// Form schemas for validation
const portfolioSchema = object({
  name: pipe(string(), minLength(1, 'Portfolio name is required'))
})

const propertySchema = object({
  name: pipe(string(), minLength(1, 'Property name is required')),
  type: pipe(string(), minLength(1, 'Property type is required'))
})

const tenantSchema = object({
  name: pipe(string(), minLength(1, 'Tenant name is required')),
  email: pipe(string(), validateEmail('Please enter a valid email')),
  phone: string()
})

// Property type options from constants
 PROPERTY_TYPES

// Form data with types
const form = reactive<OnboardingData>({
  portfolio: { name: '' },
  property: { name: '', type: 'apartment' },
  tenant: { name: '', email: '', phone: '' },
})

const errors = reactive<Record<string, string>>({})

const showOnboardingWizard = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

function validateCurrentStep() {
  let schema
  if (step.value === 1) schema = portfolioSchema
  else if (step.value === 2) schema = propertySchema
  else schema = tenantSchema

  const result = safeParse(schema, form[step.value === 1 ? 'portfolio' : step.value === 2 ? 'property' : 'tenant'])
  
  if (!result.success) {
    result.issues.forEach(issue => {
      if (issue.path && issue.path[0] && 'key' in issue.path[0]) {
        const path = issue.path[0].key as string
        errors[path] = issue.message
      }
    })
    return false
  }
  return true
}

function next() {
  if (!validateCurrentStep()) return
  // Clear all errors when moving to next step
  Object.keys(errors).forEach(key => delete errors[key])
  if (step.value < 3) step.value++
}
function back() {
  if (step.value > 1) step.value--
}
function skip() {
  skippedSteps.value.push(step.value)
  next()
}

const steps = [
  { id: 1, title: 'Portfolio', icon: 'i-heroicons-check-circle' },
  { id: 2, title: 'Property', icon: 'i-heroicons-home' },
  { id: 3, title: 'Tenant', icon: 'i-heroicons-users' }
]

async function submitForm() {
  if (!validateCurrentStep()) return
  
  submitting.value = true
  try {
    // Create portfolio
    const portfolioResponse = await api.post<PortfolioResponse>('/portfolios', {
      name: form.portfolio.name.trim(),
      subscription_plan: 'free', 
      landlord_id: user.value?.id
    }) as ApiResponse<PortfolioResponse>

    // Create property if user filled in property details (name is required)
    if (form.property.name.trim() && portfolioResponse?.data?.id) {
      try {
        await api.post('/api/properties', {
          name: form.property.name.trim(),
          property_type: form.property.type,
          portfolio_id: portfolioResponse.data.id, 
        });
      } catch (error: any) {
        if (error.response) {
          // If it's a validation error, show the actual error message
          const errorMessage = error.response.data?.message || 'Failed to create property';
          toastError(errorMessage);
        } else {
          toastError('An error occurred while creating the property');
        }
        throw error; 
      }
    }

    // Create tenant if not skipped
    if (!skippedSteps.value.includes(3) && form.tenant.email && portfolioResponse?.data?.id) {
      
      const [first_name, ...lastNameParts] = form.tenant.name.trim().split(' ')
      const last_name = lastNameParts.join(' ')
      
      await api.post(`/portfolios/${portfolioResponse.data.id}/tenants`, {
        first_name: first_name || 'New',
        last_name: last_name || 'Tenant',
        email: form.tenant.email.trim(),
        phone: form.tenant.phone?.trim() || '',
        is_active: true,
        portfolio_id: portfolioResponse.data.id
      })
    }

    toastSuccess('Onboarding completed successfully!')
    emit('completed')
    showOnboardingWizard.value = false
  } catch (error: any) {
    toastError(error?.data?.message || 'Failed to complete onboarding. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UModal 
    v-model:open="showOnboardingWizard"
    :dismissible="false"
    :ui="{
      container: 'items-center sm:items-start',
      width: 'w-full sm:max-w-2xl',
      margin: 'sm:my-8 mx-auto',
      overlay: { background: 'bg-gray-900/50 dark:bg-gray-900/75' },
      base: 'relative flex flex-col max-h-[90vh] sm:max-h-[90vh] mx-4 sm:mx-0',
      content: 'w-full max-w-full sm:max-w-2xl overflow-y-auto',
      header: 'p-3 sm:p-4 min-h-14', 
      body: 'p-3 sm:p-4 flex-1 overflow-y-auto',
      close: {
        color: 'error',
        variant: 'outline',
        class: 'rounded-full'
      }
    }"
  >
    <template #header>
      <!-- Progress Indicator -->
      <div class="flex items-center justify-between w-full px-4 py-2">
        <h2 class="text-lg font-semibold">Onboarding</h2>
        <span class="text-sm text-gray-500">Step {{ step }} of 3</span>
      </div>
      <div class="w-full h-1 bg-gray-200 rounded-full">
        <div
          class="h-1 bg-primary-500 rounded-full transition-all"
          :style="{ width: `${(step / 3) * 100}%` }"
        />
      </div>
    </template>

    <template #body>
      <div class="min-h-[40vh] flex flex-col justify-center">
        <div class="px-4">
          <div class="flex gap-2">
            <UIcon :name="steps[step-1]?.icon" class="mt-1 text-primary-500 text-2xl" />
            <div>
              <h3 class="text-xl font-bold">{{ steps[step-1]?.title }}</h3>
              <p class="text-sm text-gray-500">
            {{
              step === 1
                ? 'Give your portfolio a name to get started.'
                : step === 2
                  ? 'Add your first property to organize your units.'
                  : 'Invite a tenant who will be part of your lease.'
            }}
          </p>
            </div>
          </div>
  
          
        </div>
        <!-- Step Title + Icon -->

        <!-- Step Forms -->
        <div class="bg-white rounded-xl p-4 space-y-4">
          <!-- Step 1: Portfolio -->
          <UForm v-if="step === 1" :state="form.portfolio">
            <UFormField label="Portfolio Name" name="name" :error="errors.name" required help="Pick something recognizable.">
              <UInput v-model="form.portfolio.name" class="w-full" placeholder="e.g. My Rental Portfolio" />
            </UFormField>
          </UForm>

          <!-- Step 2: Property -->
          <UForm v-if="step === 2" :state="form.property" class="grid sm:grid-cols-2 gap-2 sm:gap-4">
            <UFormField label="Property Name" name="name" :error="errors.name" required help="Pick something recognizable.">
              <UInput 
                v-model="form.property.name" 
                placeholder="e.g. Greenview Apartments"
                :disabled="submitting"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Property Type" name="type" :error="errors.type" required help="You can change this later.">
              <USelect 
                v-model="form.property.type" 
                :items="PROPERTY_TYPES"
                :disabled="submitting"
                placeholder="Select property type"
                class="w-full"
              />
            </UFormField>
          </UForm>

          <!-- Step 3: Tenant -->
          <UForm v-if="step === 3" :state="form.tenant" class="grid sm:grid-cols-2 gap-2 sm:gap-4">
            <UFormField label="Tenant Name" class="sm:col-span-2" name="name" :error="errors.name" required>
              <UInput v-model="form.tenant.name" class="w-full" placeholder="e.g. John Doe" />
            </UFormField>
            <UFormField label="Tenant Email" name="email" :error="errors.email" required>
              <UInput type="email" v-model="form.tenant.email" class="w-full" placeholder="e.g. john@email.com" />
            </UFormField>
            <UFormField label="Tenant Phone" name="phone" :error="errors.phone">
              <UInput v-model="form.tenant.phone" class="w-full" placeholder="+880 123-456-789" />
            </UFormField>
          </UForm>
        </div>
      </div>
    </template>

    <template #footer>
      <!-- Sticky Footer Buttons -->
      <div class="flex justify-between items-center w-full">
        <UButton v-if="step > 1" color="gray" variant="soft" @click="back">Back</UButton>
        <div class="ml-auto space-x-2">
          <UButton v-if="step < 3" color="gray" variant="ghost" @click="skip">Skip</UButton>
          <UButton 
            @click="step < 3 ? next() : submitForm()" 
            class="font-semibold px-6"
            :loading="submitting"
            :disabled="submitting"
          >
            {{ step < 3 ? 'Next' : 'Complete Setup' }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
