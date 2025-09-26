<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Rental Portfolios</h1>
      <UButton icon="i-heroicons-plus" color="primary" @click="openCreate">
        Add Portfolio
      </UButton>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center items-center h-32">
      <USkeleton class="h-28 w-full rounded-xl" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="rowsArray.length === 0"
      class="py-10 flex flex-col items-center text-center gap-3"
    >
      <div class="i-lucide-briefcase h-8 w-8 text-primary/80"></div>
      <p class="text-lg font-medium">No portfolios yet</p>
      <UButton icon="i-heroicons-plus" class="mt-2" @click="openCreate">
        Create your first portfolio
      </UButton>
    </div>

    <!-- List -->
    <div v-else>
      <UTabs
        :items="rowsArray.map(p => ({ id: p.id, label: p.name, slot: 'portfolio', data: p }))"
        variant="link"
        :ui="{
          root: 'w-full text-xs sm:text-sm items-start',
          wrapper: 'w-full overflow-x-auto overflow-y-hidden hide-scrollbar',
          base: 'flex-1',
          list: 'flex-nowrap',
          container: 'border-b border-gray-200 dark:border-gray-700',
          tab: {
            padding: 'py-1.5 px-2 sm:py-2 sm:px-4',
            size: 'text-xs sm:text-sm md:text-base'
          }
        }"
      >
        <template #portfolio="{ item }">
          <UCard class="mb-6">
            <!-- Edit/View Toggle -->
            <div class="flex justify-between items-center mb-4">
              <UButton
                :icon="isEditMode ? 'i-lucide-eye' : 'i-lucide-pencil'"
                @click="toggleEditMode(item.data)"
              >
                {{ isEditMode ? 'View' : 'Edit' }}
              </UButton>
            </div>

            <!-- View Mode -->
            <div v-if="!isEditMode">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Basic Information -->
                <div class="space-y-2">
                  <h3 class="font-semibold border-b pb-1">Basic Information</h3>
                  <div><strong>Name:</strong> {{ item.data.name || 'N/A' }}</div>
                  <div>
                    <strong>Status:</strong>
                    <span :class="{
                      'text-green-500': item.data.status === 'Active',
                      'text-red-500': item.data.status === 'Inactive',
                      'text-yellow-500': item.data.status === 'Pending'
                    }">{{ item.data.status || 'N/A' }}</span>
                  </div>
                  <div><strong>Plan:</strong> {{ item.data.subscription_plan || 'N/A' }}</div>
                  <div><strong>Currency:</strong> {{ item.data.currency || 'N/A' }}</div>
                  <div><strong>Timezone:</strong> {{ item.data.timezone || 'N/A' }}</div>
                </div>

                <!-- Contact -->
                <div class="space-y-2">
                  <h3 class="font-semibold border-b pb-1">Contact Information</h3>
                  <div><strong>Email:</strong> {{ item.data.email || 'N/A' }}</div>
                  <div><strong>Phone:</strong> {{ item.data.phone || 'N/A' }}</div>
                  <div>
                    <strong>Website:</strong>
                    <a
                      v-if="item.data.website"
                      :href="item.data.website.startsWith('http') ? item.data.website : 'https://' + item.data.website"
                      target="_blank"
                      class="text-primary-600 hover:underline"
                    >
                      {{ item.data.website }}
                    </a>
                    <span v-else>N/A</span>
                  </div>
                </div>

                <!-- Address -->
                <div class="space-y-2">
                  <h3 class="font-semibold border-b pb-1">Address</h3>
                  <div><strong>Street:</strong> {{ item.data.address || 'N/A' }}</div>
                  <div><strong>City:</strong> {{ item.data.city || 'N/A' }}</div>
                  <div><strong>State:</strong> {{ item.data.state || 'N/A' }}</div>
                  <div><strong>Postal Code:</strong> {{ item.data.postal_code || 'N/A' }}</div>
                  <div><strong>Country:</strong> {{ item.data.country || 'N/A' }}</div>
                </div>

                <!-- Business -->
                <div class="space-y-2">
                  <h3 class="font-semibold border-b pb-1">Business Details</h3>
                  <div><strong>Tax ID:</strong> {{ item.data.tax_id || 'N/A' }}</div>
                  <div><strong>Registration #:</strong> {{ item.data.registration_number || 'N/A' }}</div>
                  <div><strong>VAT #:</strong> {{ item.data.vat_number || 'N/A' }}</div>
                  <div><strong>External ID:</strong> {{ item.data.provider_customer_id || 'N/A' }}</div>
                  <div v-if="item.data.logo_url" class="mt-2">
                    <strong>Logo:</strong>
                    <img :src="item.data.logo_url" alt="Logo" class="mt-1 h-12 w-auto rounded" />
                  </div>
                </div>
              </div>

              <!-- Audit -->
              <div class="mt-4 pt-4 border-t text-xs text-gray-500">
                <div>Created: {{ formatDate(item.data.created_at) }}</div>
                <div>Last Updated: {{ formatDate(item.data.updated_at) }}</div>
              </div>
            </div>

            <!-- Edit Mode -->
            <div v-else>
              <div v-if="editModel" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Basic -->
                  <div class="space-y-2">
                    <h3 class="font-semibold">Basic Information</h3>
                    <div><strong>Name:</strong><UInput v-model="editModel.name" class="w-full mt-1" /></div>
                    <div>
                      <strong>Status:</strong>
                      <USelect
                        v-model="editModel.status"
                        :options="['Active','Inactive','Pending']"
                        class="w-full mt-1"
                      />
                    </div>
                    <div><strong>Plan:</strong><UInput v-model="editModel.subscription_plan" class="w-full mt-1" /></div>
                    <div><strong>Currency:</strong><UInput v-model="editModel.currency" class="w-full mt-1" /></div>
                    <div><strong>Timezone:</strong><UInput v-model="editModel.timezone" class="w-full mt-1" /></div>
                  </div>

                  <!-- Contact -->
                  <div class="space-y-2">
                    <h3 class="font-semibold">Contact Information</h3>
                    <div><strong>Email:</strong><UInput v-model="editModel.email" type="email" class="w-full mt-1" /></div>
                    <div><strong>Phone:</strong><UInput v-model="editModel.phone" type="tel" class="w-full mt-1" /></div>
                    <div><strong>Website:</strong><UInput v-model="editModel.website" type="url" class="w-full mt-1" /></div>
                    <div><strong>Logo URL:</strong><UInput v-model="editModel.logo_url" type="url" class="w-full mt-1" /></div>
                  </div>

                  <!-- Address -->
                  <div class="space-y-2">
                    <h3 class="font-semibold">Address</h3>
                    <UTextarea v-model="editModel.address" class="w-full mt-1" />
                    <div class="grid grid-cols-2 gap-2">
                      <UInput v-model="editModel.city" placeholder="City" class="w-full mt-1" />
                      <UInput v-model="editModel.state" placeholder="State" class="w-full mt-1" />
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <UInput v-model="editModel.postal_code" placeholder="Postal" class="w-full mt-1" />
                      <UInput v-model="editModel.country" placeholder="Country" class="w-full mt-1" />
                    </div>
                  </div>

                  <!-- Business -->
                  <div class="space-y-2">
                    <h3 class="font-semibold">Business Details</h3>
                    <UInput v-model="editModel.tax_id" placeholder="Tax ID" class="w-full mt-1" />
                    <UInput v-model="editModel.registration_number" placeholder="Registration" class="w-full mt-1" />
                    <UInput v-model="editModel.vat_number" placeholder="VAT" class="w-full mt-1" />
                    <UInput v-model="editModel.provider_customer_id" placeholder="External ID" class="w-full mt-1" />
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
                  <UButton color="gray" variant="ghost" @click="cancelEdit">Cancel</UButton>
                  <UButton color="primary" @click="updatePortfolio">Save Changes</UButton>
                </div>
              </div>
            </div>
          </UCard>
        </template>
      </UTabs>
    </div>

    <!-- Portfolio Form Modal -->
    <PortfolioForm
      v-model:open="isFormOpen"
      :model="formModel"
      :view="isViewing"
      @created="onCreated"
      @updated="onUpdated"
      @update:open="onFormOpenChange"
    />

    <!-- Error -->
    <div class="mt-2 text-xs text-red-500" v-if="error">
      Error: {{ error?.message || error }}
    </div>

    <!-- Delete -->
    <ConfirmDeleteModal
      :open="isDeleteOpen"
      :loading="isDeleting"
      title="Delete Portfolio"
      :message="`Are you sure you want to delete “${selectedRow?.name || ('#' + deletingId)}”?`"
      @update:open="(v) => { if (!v) resetDeleteState() }"
      @confirm="confirmDelete"
      @cancel="resetDeleteState"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, toRaw } from 'vue'
import { format } from 'date-fns'
import { createProtectedApiClient } from '../utils/api'

definePageMeta({ middleware: ['auth'] })

// Types
type PortfolioRow = Record<string, any>

// API
const api = createProtectedApiClient()
const { user, checkAuth } = useAuth()
await checkAuth()

const landlordId = computed(() =>
  typeof user.value?.id === 'string' ? Number(user.value.id) : user.value?.id
)

// Data
const { data: rows, pending, error, refresh } = await useAsyncData(
  'landlord-portfolios',
  async () => {
    if (!landlordId.value) return []
    const endpoint = `/portfolios/landlord/${landlordId.value}?page=1&limit=100`
    return api.get<any>(endpoint)
  },
  {
    watch: [landlordId],
    server: false,
    immediate: true,
    transform: (res: any) => {
      const payload = res?.data ?? res
      const list = Array.isArray(payload) ? payload : (payload?.data ?? [])
      return (list || []).map((p: any) => ({
        ...p,
        status: p?.status
          ? String(p.status).charAt(0).toUpperCase() + String(p.status).slice(1)
          : 'Active'
      }))
    }
  }
)

const rowsArray = computed(() =>
  Array.isArray(rows.value) ? rows.value as PortfolioRow[] : []
)

// Form
const isFormOpen = ref(false)
const formModel = ref<PortfolioRow | null>(null)
const isViewing = ref(false)

function openCreate() {
  formModel.value = null
  isViewing.value = false
  isFormOpen.value = true
}

function onCreated(created: PortfolioRow) {
  rows.value = [{ ...created }, ...(rowsArray.value || [])]
  refresh()
  isFormOpen.value = false
}

function onUpdated(updated: PortfolioRow) {
  const idx = rowsArray.value.findIndex(r => r.id === updated.id)
  if (idx !== -1) {
    rows.value[idx] = { ...updated }
    refresh()
  }
  isFormOpen.value = false
}

function onFormOpenChange(v: boolean) {
  isFormOpen.value = v
  if (!v) {
    formModel.value = null
    isViewing.value = false
  }
}

// Edit
const isEditMode = ref(false)
const editModel = ref<PortfolioRow | null>(null)

function toggleEditMode(portfolio: PortfolioRow) {
  isEditMode.value = !isEditMode.value
  if (isEditMode.value) {
    editModel.value = structuredClone(toRaw(portfolio))
  } else {
    editModel.value = null
  }
}

function cancelEdit() {
  isEditMode.value = false
  editModel.value = null
}

function updatePortfolio() {
  if (!editModel.value) return
  const idx = rowsArray.value.findIndex(r => r.id === editModel.value!.id)
  if (idx !== -1) {
    rows.value[idx] = { ...editModel.value }
    refresh()
  }
  isEditMode.value = false
  editModel.value = null
}

// Delete
const isDeleteOpen = ref(false)
const deletingId = ref<number | string | null>(null)
const selectedRow = ref<PortfolioRow | null>(null)
const isDeleting = ref(false)

function resetDeleteState() {
  isDeleteOpen.value = false
  deletingId.value = null
  selectedRow.value = null
}

async function confirmDelete() {
  if (!deletingId.value) return
  try {
    isDeleting.value = true
    await api.delete(`/portfolios/${deletingId.value}`)
    rows.value = rowsArray.value.filter(r => r.id !== deletingId.value)
    await refresh()
  } finally {
    resetDeleteState()
    isDeleting.value = false
  }
}

// Utils
const formatDate = (date: string) => {
  if (!date) return 'N/A'
  try {
    return format(new Date(date), 'PPpp')
  } catch {
    return date
  }
}
</script>
