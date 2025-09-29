<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll">
    <div class="flex items-center justify-between gap-2">
      <UTooltip
        text="Manage your buildings and addresses. Properties contain one or more units."
        :content="{ side: 'right' }"
      >
        <div class="flex gap-2 cursor-pointer">
          <h1 class="text-xl md:text-2xl font-semibold">Properties</h1>
          <UButton
            icon="i-heroicons-information-circle"
            color="neutral"
            variant="ghost"
            aria-label="About Properties"
            class="p-1"
          />
        </div>
      </UTooltip>
      <UButton icon="i-heroicons-plus" @click="() => { formModel = null; isViewing = false; isFormOpen = true }" :disabled="!selectedPortfolioId" >Add Property</UButton>
    </div>

    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <UInput v-model="searchQuery" color="neutral" highlight placeholder="Search...">
        <template v-if="searchQuery?.length" #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-circle-x"
            aria-label="Clear input"
            @click="() => { searchQuery = '' }"
          />
        </template>
      </UInput>

      <UButton color="primary" icon="i-lucide-search" label="Search" @click="search" />

      <!-- Parent-level Portfolio Filter/Selector -->
      <USelect
        v-model.number="selectedPortfolioId"
        :items="portfolioOptions"
        placeholder="All Portfolios"
        class="min-w-[220px]"
      />
    </div>

    <UCard>
      <div v-if="pending">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <USkeleton class="h-28 rounded-xl" v-for="i in 3" :key="i" />
        </div>
      </div>
      <div v-else-if="rowsArray.length === 0" class="py-10 flex flex-col items-center text-center gap-3">
        <div class="i-lucide-building-2 h-12 w-12 text-primary/80" aria-hidden="true" />
        <p class="text-lg font-medium">No properties yet</p>
        <p class="text-sm text-gray-500 max-w-md">
          Start by adding your first property to manage units, leases, and collect rent.
        </p>
        <UButton 
          icon="i-heroicons-plus" 
          class="mt-2" 
          @click="() => { formModel = null; isViewing = false; isFormOpen = true }"
          :disabled="!selectedPortfolioId"
        >
          Add Your First Property
        </UButton>
      </div>
      <UTable
        v-else
        :data="rowsArray"
        :columns="columns"
        class="flex-1"
        :loading="pending"
        loading-color="primary"
        loading-animation="carousel"
      />
    </UCard>

    <div class="mt-2 text-xs text-gray-500">
      <div v-if="error">Error: {{ error?.message || error }}</div>
    </div>

    <ConfirmDeleteModal
      :open="isDeleteOpen"
      :loading="isDeleting"
      title="Delete Property"
      :message="`Are you sure you want to delete property #${deletingId}? This action cannot be undone.`"
      @update:open="(v: boolean) => { if (!v) { isDeleteOpen = false; deletingId = null } }"
      @confirm="confirmDelete"
      @cancel="() => { isDeleteOpen = false; deletingId = null }"
    />

    <PropertyForm
      v-model:open="isFormOpen"
      :model="formModel"
      :view="isViewing"
      :selected-portfolio-id="selectedPortfolioId"
      @created="onCreated"
      @updated="onUpdated"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { h, resolveComponent, nextTick } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal.vue'
import PropertyForm from '../components/properties/PropertyForm.vue'
import { createProtectedApiClient } from '../utils/api'
import { useAuth } from '../composables/useAuth'

// We will pass full property items to the table (no mapping)

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  // Units: read from number_of_units or fallback to units
  { accessorKey: 'units', header: 'Units', cell: ({ row }) => h('pre', row.original.units.length) },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'property_type', header: 'Property Type' },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: { align: 'end' },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]

const api = createProtectedApiClient()
const { user, checkAuth } = useAuth()
const landlordId = computed(() => {
  const id = user.value?.id
  return typeof id === 'string' ? Number(id) : id
})

await checkAuth()

const searchQuery = ref('')

// Fetch portfolios (includes properties arrays) and derive rows from selection
const { data: portfoliosResponse, pending, error } = await useAsyncData(
  'landlord-portfolios',
  async () => {
    if (!landlordId.value) return []
    const endpoint = `/portfolios/landlord/${landlordId.value}`
    const res = await api.get<any>(endpoint)
    return res
  },
  {
    watch: [landlordId],
    server: false,
    immediate: true,
    transform: (res: any) => {
      const payload = res?.data ?? res
      const list = Array.isArray(payload) ? payload : (payload?.data ?? [])
      if (process.client) {
        console.log('[Portfolios] Loaded:', list?.length)
      }
      return list
    }
  }
)

const portfolios = computed(() => Array.isArray(portfoliosResponse.value) ? portfoliosResponse.value : [])
const rowsArray = computed(() => {
  const selected = portfolios.value.find((p: any) => p?.id === selectedPortfolioId.value) || portfolios.value[0]
  const props = Array.isArray(selected?.properties) ? selected.properties : []
  const q = (searchQuery.value || '').toLowerCase()
  const filtered = q
    ? props.filter((p: any) => String(p?.name || '').toLowerCase().includes(q) || String(p?.city || '').toLowerCase().includes(q))
    : props
  // Return full property objects (no mapping)
  return filtered || []
})

// Portfolio options for AddPropertyForm
const portfolioOptions = computed(() => (portfolios.value || []).map((p: any) => ({
  label: p?.name ?? `Portfolio #${p?.id}`,
  value: typeof p?.id === 'string' ? Number(p.id) : (p?.id ?? 0)
})))
const selectedPortfolioId = ref<number | undefined>(undefined)
watch(portfolios, (list) => {
  const options = (list || []).map((p: any) => (typeof p?.id === 'string' ? Number(p.id) : p?.id)).filter((id: any) => Number.isFinite(id))
  if ((!selectedPortfolioId.value || !options.includes(selectedPortfolioId.value)) && options.length > 0) {
    selectedPortfolioId.value = options[0]
  }
})

const isFormOpen = ref(false)
const formModel = ref<any | null>(null)
const isViewing = ref(false)
const isDeleteOpen = ref(false)
const deletingId = ref<number | string | null>(null)
const isDeleting = ref(false)

function search() {
  // Filtering handled by rowsArray computed
}

const toast = useToast()
function getRowItems(row: any) {
  return [
    { type: 'label', label: 'Actions' },
    { label: 'View', icon: 'i-lucide-eye', color: 'info', class: 'text-info', onSelect() {
      formModel.value = { ...row.original }
      isViewing.value = true
      isFormOpen.value = true
    } },
    { label: 'Edit', icon: 'i-lucide-pencil', color: 'primary', class: 'text-primary', onSelect() {
      formModel.value = { ...row.original }
      isViewing.value = false
      isFormOpen.value = true
    } },
    { type: 'separator' },
    { label: 'Delete', icon: 'i-lucide-trash', color: 'error', class: 'text-error', onSelect() {
      deletingId.value = row.original.id
      isDeleteOpen.value = true
    } }
  ]
}

async function confirmDelete() {
  if (!deletingId.value) return
  try {
    isDeleting.value = true
    await api.delete(`/properties/${deletingId.value}`)
    toast.add({ title: `Property #${deletingId.value} deleted`, color: 'success', icon: 'i-lucide-check' })
    // No server refresh; remove locally from selected portfolio if present
    const selected = portfolios.value.find((p: any) => p?.id === selectedPortfolioId.value) || portfolios.value[0]
    if (selected && Array.isArray(selected.properties)) {
      const idx = selected.properties.findIndex((r: any) => r?.id === deletingId.value)
      if (idx >= 0) selected.properties.splice(idx, 1)
    }
  } catch (e: any) {
    toast.add({ title: e?.data?.message || e?.message || 'Delete failed', color: 'error', icon: 'i-lucide-x' })
  } finally {
    isDeleting.value = false
    isDeleteOpen.value = false
    deletingId.value = null
  }
}

const onCreated = (created: any) => {
  const selected = portfolios.value.find((p: any) => p?.id === selectedPortfolioId.value) || portfolios.value[0]
  if (selected) {
    if (!Array.isArray(selected.properties)) selected.properties = []
    // Insert full created item as-is
    selected.properties.unshift({ ...created })
  }
}
  
const onUpdated = (updated: any) => {
  const selected = portfolios.value.find((p: any) => p?.id === selectedPortfolioId.value) || portfolios.value[0]
  if (selected && Array.isArray(selected.properties)) {
    const idx = selected.properties.findIndex((r: any) => r?.id === updated?.id)
    if (idx >= 0) {
      // Replace with full updated item
      selected.properties[idx] = { ...updated }
    }
  }
}
</script>