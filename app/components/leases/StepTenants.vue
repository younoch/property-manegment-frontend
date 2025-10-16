<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { createProtectedApiClient } from '@/utils/api'
import { useApiToast } from '../../composables/useApiToast'

type Tenant = { id: string; first_name: string; last_name: string; email?: string | null; phone?: string | null }

const props = defineProps<{
  portfolioId?: string
  modelValue: Tenant[]            // v-model for selectedTenants
}>()

const emit = defineEmits<{
  'update:modelValue': [Tenant[]]
  back: []
  next: []
}>()

const api = createProtectedApiClient()
const { error: toastError, success: toastSuccess } = useApiToast()

const tenantSearch = ref('')
const tenantsLoading = ref(false)
const tenantOptions = ref<Tenant[]>([])
const selectedTenants = computed({
  get: () => props.modelValue || [],
  set: (v: Tenant[]) => emit('update:modelValue', v)
})

const searchTenants = useDebounceFn(async () => {
  if (!props.portfolioId) return
  tenantsLoading.value = true
  try {
    const search = tenantSearch.value ? `?search=${encodeURIComponent(tenantSearch.value)}&limit=20` : ''
    const res = await api.get<any>(`/portfolios/${props.portfolioId}/tenants${search}`)
    const payload = res?.data?.data ?? res?.data ?? res
    tenantOptions.value = Array.isArray(payload) ? payload : []
  } catch {
    toastError('Failed to load tenants')
  } finally {
    tenantsLoading.value = false
  }
}, 300)

watch(tenantSearch, () => searchTenants(), { immediate: true })

// inline add
const newTenant = reactive({ first_name: '', last_name: '', email: '', phone: '' })
const addingTenant = ref(false)
async function addTenantInline() {
  if (!props.portfolioId) return
  if (!newTenant.first_name || !newTenant.last_name || !newTenant.email) {
    toastError('First name, last name, and email are required')
    return
  }
  addingTenant.value = true
  try {
    const payload = {
      portfolio_id: props.portfolioId,
      first_name: newTenant.first_name,
      last_name: newTenant.last_name,
      email: newTenant.email || null,
      phone: newTenant.phone || null,
      is_active: true
    }
    const res = await api.post<any>(`/portfolios/${props.portfolioId}/tenants`, payload)
    const created = res?.data?.data ?? res?.data ?? res
    tenantOptions.value.unshift(created)
    selectedTenants.value = [...selectedTenants.value, created]
    Object.assign(newTenant, { first_name: '', last_name: '', email: '', phone: '' })
    toastSuccess('Tenant added')
  } catch {
    toastError('Failed to add tenant')
  } finally {
    addingTenant.value = false
  }
}
</script>

<template>
  <UCard>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Search existing -->
      <div class="lg:col-span-2 space-y-3">
        <UFormField label="Search Tenants (name, email, phone)">
          <UInput v-model="tenantSearch" placeholder="Type to search…" />
        </UFormField>

        <div class="rounded border border-gray-200 dark:border-white/10 p-2 min-h-24">
          <div v-if="tenantsLoading" class="text-sm text-gray-500 p-2">Searching…</div>
          <template v-else>
            <div v-if="tenantOptions.length === 0" class="text-sm text-gray-500 p-2">No tenants found.</div>
            <ul v-else class="divide-y divide-gray-100 dark:divide-white/10">
              <li v-for="t in tenantOptions" :key="t.id" class="flex items-center justify-between py-2">
                <div class="text-sm">
                  <div class="font-medium">{{ t.first_name }} {{ t.last_name }}</div>
                  <div class="text-gray-500">
                    <span v-if="t.email">{{ t.email }}</span>
                    <span v-if="t.phone" class="ml-2">· {{ t.phone }}</span>
                  </div>
                </div>
                <UButton
                  size="xs"
                  variant="soft"
                  :disabled="selectedTenants.some(s => s.id === t.id)"
                  @click="selectedTenants = [...selectedTenants, t]"
                >
                  Select
                </UButton>
              </li>
            </ul>
          </template>
        </div>
      </div>

      <!-- Add new inline -->
      <div class="space-y-3">
        <div class="text-sm font-medium">Add New Tenant</div>
        <UFormField label="First Name" required><UInput v-model="newTenant.first_name" /></UFormField>
        <UFormField label="Last Name" required><UInput v-model="newTenant.last_name" /></UFormField>
        <UFormField label="Email" required>
          <UInput v-model="newTenant.email" type="email" required />
        </UFormField>
        <UFormField label="Phone (optional)"><UInput v-model="newTenant.phone" /></UFormField>
        <UButton :loading="addingTenant" @click="addTenantInline">Add & Select</UButton>
      </div>
    </div>

    <!-- Selected tenants -->
    <div class="mt-6">
      <div class="text-sm font-medium mb-2">Selected Tenant(s)</div>
      <div class="flex flex-wrap gap-2">
        <UBadge v-for="t in selectedTenants" :key="t.id" variant="soft">
          {{ t.first_name }} {{ t.last_name }}
          <UButton
            size="2xs"
            variant="ghost"
            class="ml-2"
            @click="selectedTenants = selectedTenants.filter(s => s.id !== t.id)"
          >
            Remove
          </UButton>
        </UBadge>
      </div>
    </div>

    <div class="mt-6 flex justify-between">
      <UButton variant="soft" color="neutral" @click="emit('back')">Back</UButton>
      <UButton :disabled="selectedTenants.length === 0" @click="emit('next')">Next</UButton>
    </div>
  </UCard>
</template>
