<template>
  <UCard class="mb-4 sm:mb-6">
    <!-- Header Actions -->
    <div class="flex justify-between items-center mb-2 sm:mb-4">
      <!-- Edit/View Toggle -->
      <UButton :icon="isEditMode ? 'i-lucide-eye' : 'i-lucide-pencil'" @click="isEditMode = !isEditMode">
        {{ isEditMode ? 'View' : 'Edit' }}
      </UButton>
      
      <!-- Delete Button -->
      <UButton 
        color="red" 
        variant="ghost" 
        icon="i-lucide-trash-2" 
        @click="isDeleteModalOpen = true"
        :disabled="isUpdating"
      >
        Delete
      </UButton>
    </div>
    
    <!-- Delete Portfolio Modal -->
    <DeletePortfolioModal
      v-model="isDeleteModalOpen"
      :portfolio-name="portfolio.name"
      :is-deleting="isDeleting"
      @confirm="confirmDelete"
      @cancel="isDeleteModalOpen = false"
    />
    <!-- View Mode -->
    <div v-if="!isEditMode" class="px-2 sm:px-0">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <!-- Basic Information -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Basic Information</h3>
          <div class="space-y-2">
            <div><strong>Name:</strong> {{ portfolio.name || 'N/A' }}</div>
            <div>
              <strong>Status:</strong>
              <span :class="{
                'text-green-500': portfolio.status === 'Active',
                'text-red-500': portfolio.status === 'Inactive',
                'text-yellow-500': portfolio.status === 'Pending'
              }">
                {{ portfolio.status || 'N/A' }}
              </span>
            </div>
            <div><strong>Subscription Plan:</strong> {{ getSubscriptionPlanLabel(portfolio.subscription_plan) }}</div>
            <div><strong>Currency:</strong> {{ portfolio.currency || 'N/A' }}</div>
            <div><strong>Timezone:</strong> {{ formatTimezone(portfolio.timezone) }}</div>
          </div>
        </div>

        <!-- Contact -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Contact Information</h3>
          <div class="space-y-2">
            <div><strong>Email:</strong> {{ portfolio.email || 'N/A' }}</div>
            <div><strong>Phone:</strong> {{ portfolio.phone || 'N/A' }}</div>
            <div>
              <strong>Website:</strong>
              <a v-if="portfolio.website"
                :href="portfolio.website.startsWith('http') ? portfolio.website : 'https://' + portfolio.website"
                target="_blank" class="text-primary-600 hover:underline">
                {{ portfolio.website }}
              </a>
              <span v-else>N/A</span>
            </div>
          </div>
        </div>

        <!-- Address -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Address</h3>
          <div class="space-y-2">
            <div><strong>Street:</strong> {{ portfolio.address || 'N/A' }}</div>
            <div><strong>City:</strong> {{ portfolio.city || 'N/A' }}</div>
            <div><strong>State:</strong> {{ portfolio.state || 'N/A' }}</div>
            <div><strong>Postal Code:</strong> {{ portfolio.postal_code || 'N/A' }}</div>
            <div><strong>Country:</strong> {{ portfolio.country || 'N/A' }}</div>
          </div>
        </div>

        <!-- Business -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Business Details</h3>
          <div class="space-y-2">
            <div><strong>Tax ID:</strong> {{ portfolio.tax_id || 'N/A' }}</div>
            <div><strong>Registration #:</strong> {{ portfolio.registration_number || 'N/A' }}</div>
            <div><strong>VAT #:</strong> {{ portfolio.vat_number || 'N/A' }}</div>
            <div><strong>External ID:</strong> {{ portfolio.provider_customer_id || 'N/A' }}</div>
            <div v-if="portfolio.logo_url" class="mt-2">
              <strong>Logo:</strong>
              <div class="mt-1">
                <img 
                  :src="portfolio.logo_url" 
                  alt="Portfolio logo"
                  :width="120"
                  :height="60"
                  format="webp"
                  quality="80"
                  img-class="max-h-12 w-auto rounded border border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Audit -->
      <div class="mt-4 pt-4 border-t text-xs text-gray-500">
        <div>Created: {{ formatDate(portfolio.created_at) }}</div>
        <div>Last Updated: {{ formatDate(portfolio.updated_at) }}</div>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else>
      <div class="space-y-4 px-2 sm:px-0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <!-- Basic -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>

            <!-- Name -->
            <UFormField label="Name" name="name">
              <UInput :model-value="editModel.name" @update:model-value="(val: string) => editModel.name = val"
                placeholder="Enter portfolio name" class="w-full" :ui="{
                  base: 'w-full',
                  rounded: 'rounded-md',
                  size: 'md',
                  padding: 'px-3 py-2',
                  color: {
                    white: {
                      outline: 'shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
                    }
                  }
                }" />
            </UFormField>

            <!-- Status -->
            <UFormField label="Status">
              <USelect :model-value="editModel.status" @update:model-value="(val: string) => editModel.status = val"
                :items="portfolioStatuses" option-attribute="label" placeholder="Select status" class="w-full" />
            </UFormField>

            <UFormField label="Currency" name="currency" class="space-y-1">
              <USelectMenu :model-value="selectedCurrency" @update:model-value="updateCurrency" :items="currencies"
                placeholder="Select currency" class="w-full" searchable searchable-placeholder="Search currency..."
                :uiMenu="{ option: { base: 'w-full' } }">
                <template #label>
                  {{ selectedCurrency?.label || 'Select currency' }}
                </template>
              </USelectMenu>
            </UFormField>

            <UFormField label="Timezone" class="space-y-1">
              <div class="flex gap-2 max-w-full">
                <USelect :model-value="selectedEditTimezone" @update:model-value="updateEditTimezone"
                  :items="timezoneOptions" placeholder="Select timezone" class="w-full" searchable
                  searchable-placeholder="Search timezone..." />
                <UButton size="xs" variant="outline" @click="useMyEditTimezone" :disabled="!browserTimezone"
                  :title="browserTimezone ? 'Use my timezone: ' + browserTimezone : 'Could not detect timezone'" :ui="{
                    base: 'justify-center',
                    rounded: 'rounded-md',
                    size: {
                      xs: 'px-2 py-0',
                    },
                  }">
                  <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                  <span class="hidden md:inline-block">My Timezone</span>
                </UButton>
              </div>
              <p v-if="editModel.timezone" class="text-xs text-gray-500 mt-1">
                Current time: {{ getCurrentTimeInTimezone(editModel.timezone) }}
              </p>
            </UFormField>
          </div>

          <!-- Contact -->
          <div class="space-y-3 sm:space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3 sm:mb-4">Contact
              Information</h3>
            <UFormField label="Email" name="email">
              <UInput :model-value="editModel.email" @update:model-value="(val: string) => editModel.email = val"
                type="email" class="w-full" />
            </UFormField>
            <UFormField label="Phone" name="phone">
              <UInput :model-value="editModel.phone" @update:model-value="(val: string) => editModel.phone = val"
                type="tel" class="w-full" />
            </UFormField>
            <UFormField label="Website" name="website">
              <UInput :model-value="editModel.website" @update:model-value="(val: string) => editModel.website = val"
                type="url" class="w-full" />
            </UFormField>
            <UFormField label="Logo URL" name="logo_url">
              <UInput :model-value="editModel.logo_url" @update:model-value="(val: string) => editModel.logo_url = val"
                type="url" class="w-full" />
            </UFormField>
          </div>

          <!-- Address -->
          <div class="space-y-3 sm:space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3 sm:mb-4">Address</h3>
            <UFormField label="Street Address" name="address">
              <UTextarea :model-value="editModel.address" @update:model-value="(val: string) => editModel.address = val"
                class="w-full" />
            </UFormField>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <UFormField label="City" name="city">
                <UInput :model-value="editModel.city" @update:model-value="(val: string) => editModel.city = val"
                  class="w-full" />
              </UFormField>
              <UFormField label="State/Province" name="state">
                <UInput :model-value="editModel.state" @update:model-value="(val: string) => editModel.state = val"
                  class="w-full" />
              </UFormField>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <UFormField label="Postal Code" name="postal_code">
                <UInput :model-value="editModel.postal_code"
                  @update:model-value="(val: string) => editModel.postal_code = val" class="w-full" />
              </UFormField>
              <UFormField label="Country" name="country">
                <UInput :model-value="editModel.country" @update:model-value="(val: string) => editModel.country = val"
                  class="w-full" />
              </UFormField>
            </div>
          </div>

          <!-- Business -->
          <div class="space-y-3 sm:space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3 sm:mb-4">Business Details
            </h3>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Tax ID</label>
              <UInput :model-value="editModel.tax_id" @update:model-value="(val: string) => editModel.tax_id = val"
                class="w-full" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Registration Number</label>
              <UInput :model-value="editModel.registration_number"
                @update:model-value="(val: string) => editModel.registration_number = val" class="w-full" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">VAT Number</label>
              <UInput :model-value="editModel.vat_number"
                @update:model-value="(val: string) => editModel.vat_number = val" class="w-full" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">External ID</label>
              <UInput :model-value="editModel.provider_customer_id"
                @update:model-value="(val: string) => editModel.provider_customer_id = val" class="w-full" />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 mt-4 sm:mt-6 pt-4 border-t">
          <UButton type="button" color="gray" @click="isEditMode = false" :disabled="isUpdating">
            Cancel
          </UButton>
          <UButton type="button" color="primary" @click="handleSave" :loading="isUpdating" :disabled="isUpdating">
            {{ isUpdating ? 'Saving...' : 'Save Changes' }}
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineComponent, onMounted, defineAsyncComponent } from 'vue'
import ImageOptimizer from '~/components/common/ImageOptimizer.vue'
import { useToast } from '#imports'
import DeletePortfolioModal from './DeletePortfolioModal.vue'
import { createProtectedApiClient } from '~/utils/api'
import type { PortfolioRow } from '~/types/portfolio'
import timezones from 'timezones-list'

// Initialize API client
const api = createProtectedApiClient()

// Timezone options from the timezones-list package
const timezoneOptions = (timezones as unknown as Array<{ label: string; tzCode: string; name: string; offset: string; offsetInMinutes: number }>).map(tz => ({
  label: `${tz.name} (${tz.tzCode})`,
  value: tz.tzCode
}))

// Browser's timezone
const browserTimezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)

// For edit form
const selectedEditTimezone = ref<{ label: string; value: string } | null>(null)
const selectedCurrency = ref<{ label: string; value: string } | null>(null)

const props = defineProps({
  portfolio: {
    type: Object as () => PortfolioRow,
    required: true
  },
  isEditMode: {
    type: Boolean,
    default: false
  },
  currencies: {
    type: Array as () => Array<{ label: string, value: string }>,
    default: () => []
  },
  portfolioStatuses: {
    type: Array as () => Array<{ label: string, value: string }>,
    default: () => []
  }
})

const emit = defineEmits(['saved', 'error', 'deleted'])
const isUpdating = ref(false)
const isDeleting = ref(false)
const isDeleteModalOpen = ref(false)

// Initialize timezone options
onMounted(() => {
  // Timezone initialization logic here
})
const toast = useToast()

// Track original data for comparison
const originalData = ref<PortfolioRow>({ ...props.portfolio })

// Local edit state
const isEditMode = ref(false)
const editModel = ref<PortfolioRow>({ ...props.portfolio })

import { toRaw, toValue } from 'vue'

// Deep compare two values, handling Vue proxies and reactive objects
const deepEqual = (a: any, b: any): boolean => {
  // Get raw values to handle Vue proxies
  const rawA = toRaw(a)
  const rawB = toRaw(b)

  // Handle primitive types and null/undefined
  if (Object.is(rawA, rawB)) return true
  if (rawA === null || rawB === null) return false
  if (typeof rawA !== 'object' || typeof rawB !== 'object') return false

  // Handle arrays
  if (Array.isArray(rawA) && Array.isArray(rawB)) {
    if (rawA.length !== rawB.length) return false
    return rawA.every((val, i) => deepEqual(val, rawB[i]))
  }

  // Handle objects
  const keysA = Object.keys(rawA)
  const keysB = Object.keys(rawB)

  if (keysA.length !== keysB.length) return false

  return keysA.every(key => {
    return Object.prototype.hasOwnProperty.call(rawB, key) &&
      deepEqual(rawA[key], rawB[key])
  })
}

// Handle save button click
const handleSave = async () => {
  // Ensure the latest timezone is included in the changes
  if (selectedEditTimezone.value) {
    const timezoneValue = selectedEditTimezone.value.value || selectedEditTimezone.value

    editModel.value = {
      ...editModel.value,
      timezone: typeof timezoneValue === 'string' ? timezoneValue : timezoneValue.value
    }
  }

  const changes = getChangedFields()

  const portfolioId = props.portfolio.id

  if (!portfolioId) {
    toast.add({
      title: 'Error',
      description: 'Cannot update portfolio: No ID provided',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })
    return
  }

  // Remove ID from payload since it's in the URL
  const { id, ...payload } = changes

  try {
    isUpdating.value = true

    // Make the PATCH request to update the portfolio
    const response = await api.patch(`/portfolios/${portfolioId}`, payload)

    // Update local state with the response data
    const responseData = (response as any)?.data?.data || (response as any)?.data
    if (!responseData) {
      throw new Error('No data returned from server')
    }

    // Update the local edit model and original data
    originalData.value = { ...originalData.value, ...responseData }
    editModel.value = { ...editModel.value, ...responseData }

    // Update the selected timezone if it was changed
    if (responseData.timezone) {
      const tz = timezoneOptions.find(t => t.value === responseData.timezone)
      if (tz) {
        selectedEditTimezone.value = tz
      }
    }

    // Exit edit mode
    isEditMode.value = false

    // Show success message
    toast.add({
      title: 'Portfolio updated',
      description: 'Your portfolio has been updated successfully.',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })

    // Emit saved event with the updated data
    emit('saved', responseData)

  } catch (error: any) {
    // Show error message from API if available
    const errorMessage = error?.response?.data?.message ||
      error?.data?.message ||
      error?.message ||
      'Failed to update portfolio. Please try again.'

    toast.add({
      title: 'Error',
      description: errorMessage,
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })

    // Emit error event
    emit('error', { error, portfolioId })
  } finally {
    isUpdating.value = false
  }
}

// Function to get only changed fields
const getChangedFields = (): Partial<PortfolioRow> => {

  const changes: Partial<PortfolioRow> = {}

  // Get raw values for comparison
  const currentRaw = toRaw(editModel.value)
  const originalRaw = toRaw(originalData.value)

  // Check all fields in both objects
  const allKeys = new Set([...Object.keys(currentRaw), ...Object.keys(originalRaw)])

  for (const key of allKeys) {
    // Skip the ID field since it's already in the URL
    if (key === 'id') continue

    const modelKey = key as keyof PortfolioRow
    const currentValue = currentRaw[modelKey]
    const originalValue = originalRaw[modelKey]

    // Skip if values are deeply equal
    if (deepEqual(currentValue, originalValue)) continue

    // Handle removed or updated fields
    changes[modelKey] = key in currentRaw ? toValue(currentValue) : null
  }

  return changes
}

// Function to initialize form fields
const initializeFormFields = (portfolio: PortfolioRow) => {
  // Update selected timezone
  if (portfolio.timezone) {
    const tz = timezoneOptions.find(tz => tz.value === portfolio.timezone)
    if (tz) {
      selectedEditTimezone.value = tz
    }
  } else {
    // Set default timezone if not set
    const defaultTz = timezoneOptions.find(tz => tz.value === browserTimezone.value)
    if (defaultTz) {
      selectedEditTimezone.value = defaultTz
      portfolio.timezone = defaultTz.value
    }
  }

  // Update selected currency
  if (portfolio.currency) {
    const currency = props.currencies.find(c => c.value === portfolio.currency)
    if (currency) {
      selectedCurrency.value = currency
    }
  }
}

// Watch for changes in the portfolio prop
watch(() => props.portfolio, (newVal) => {
  if (newVal) {
    originalData.value = { ...newVal }
    editModel.value = { ...newVal }

    // Set the selected timezone if it exists
    if (newVal.timezone) {
      const tz = timezoneOptions.find(t => t.value === newVal.timezone)
      if (tz) {
        selectedEditTimezone.value = tz
        // Ensure timezone is set in editModel
        editModel.value = { ...editModel.value, timezone: tz.value }
      } else {
        selectedEditTimezone.value = null
        const { timezone, ...rest } = editModel.value
        editModel.value = rest as PortfolioRow
      }
    } else {
      selectedEditTimezone.value = null
      const { timezone, ...rest } = editModel.value
      editModel.value = rest as PortfolioRow
    }

  }
}, { immediate: true, deep: true })

// Methods
const getSubscriptionPlanLabel = (plan?: string | null) => {
  if (!plan) return 'N/A'
  // Convert to title case for better display
  return plan
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const formatTimezone = (timezone?: string) => {
  if (!timezone) return 'N/A'
  try {
    const parts = timezone.replace(/_/g, ' ').split('/')
    return parts[parts.length - 1] || timezone
  } catch {
    return timezone
  }
}

const formatDate = (date?: string | null) => {
  if (!date) return 'N/A'
  try {
    const dateObj = new Date(date)
    return isNaN(dateObj.getTime()) ? 'Invalid date' : dateObj.toLocaleString()
  } catch {
    return 'Invalid date'
  }
}

const getCurrentTimeInTimezone = (timezone?: string) => {
  if (!timezone) return 'N/A'
  try {
    return new Date().toLocaleTimeString('en-US', { timeZone: timezone })
  } catch (e) {
    return 'Invalid timezone'
  }
}

const updateCurrency = (value: { label: string, value: string } | null) => {
  selectedCurrency.value = value
  if (value) {
    editModel.value = { ...editModel.value, currency: value.value }
  } else {
    const { currency, ...rest } = editModel.value
    editModel.value = rest as PortfolioRow
  }
}

const updateEditTimezone = (value: { label: string; value: string } | string | null) => {
  // Handle different input types
  if (typeof value === 'string') {
    // If it's a string, try to find a matching timezone option
    const tzStr = value.trim()

    // First try exact match
    let tzOption = timezoneOptions.find(opt =>
      opt.value.toLowerCase() === tzStr.toLowerCase() ||
      opt.label.toLowerCase() === tzStr.toLowerCase()
    )

    // If no exact match, try partial match in label
    if (!tzOption) {
      tzOption = timezoneOptions.find(opt =>
        opt.label.toLowerCase().includes(tzStr.toLowerCase())
      )
    }

    if (tzOption) {
      selectedEditTimezone.value = tzOption
      editModel.value.timezone = tzOption.value
    } else {
      selectedEditTimezone.value = null
      editModel.value.timezone = tzStr // Fallback to the raw string if no match found
    }
  }
  // Handle object input {label: string, value: string}
  else if (value && typeof value === 'object' && 'value' in value) {
    selectedEditTimezone.value = value
    editModel.value.timezone = value.value
  }
  // Handle null/undefined
  else {
    selectedEditTimezone.value = null
    editModel.value.timezone = ''
  }
}

const useMyEditTimezone = (timezone?: string) => {
  try {
    const tz = timezone || browserTimezone.value

    if (!tz) {
      return false
    }

    // Try exact match first
    let timezoneOption = timezoneOptions.find(opt => opt.value === tz)

    // If no exact match, try case-insensitive match
    if (!timezoneOption) {
      const tzLower = tz.toLowerCase()
      timezoneOption = timezoneOptions.find(opt =>
        opt.value.toLowerCase() === tzLower ||
        opt.label.toLowerCase().includes(tzLower)
      )
    }

    if (timezoneOption) {
      selectedEditTimezone.value = timezoneOption
      editModel.value.timezone = timezoneOption.value
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

// Handle portfolio deletion
const confirmDelete = async () => {
  isDeleting.value = true
  
  try {
    const response = await api.delete(`/portfolios/${props.portfolio.id}`)
    
    if ((response as any)?.success) {
      toast.add({
        title: 'Portfolio deleted',
        description: `${props.portfolio.name} has been successfully deleted.`,
        icon: 'i-heroicons-check-circle',
        color: 'success'
      })
      emit('deleted', props.portfolio)
      isDeleteModalOpen.value = false
    } else {
      throw new Error((response as any)?.message || 'Failed to delete portfolio')
    }
  } catch (error: any) {
    console.error('Error deleting portfolio:', error)
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to delete portfolio',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })
  } finally {
    isDeleting.value = false
  }
}

// Expose any functions that need to be accessible from parent components
defineExpose({
  useMyEditTimezone
})
</script>
