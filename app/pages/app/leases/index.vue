<!-- app/pages/leases/index.vue -->
<template>
  <div class="max-w-6xl mx-auto p-3 sm:p-4 md:p-6 overflow-x-hidden">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div class="flex items-center gap-2">
        <h1 class="text-xl sm:text-xl md:text-2xl font-semibold">Leases</h1>
        <UTooltip
          text="Create and manage lease agreements for a unit."
          :content="{ side: 'right' }"
        >
          <UButton
            icon="i-heroicons-information-circle"
            color="gray"
            variant="ghost"
            aria-label="About Leases"
            class="p-1"
          />
        </UTooltip>
      </div>
      <UButton 
        icon="i-heroicons-plus"
        size="sm"
        class="w-full sm:w-auto justify-center"
        :disabled="!selectedPortfolioId || !selectedUnitId || !selectedPropertyId"
        :to="`/app/leases/new?unitId=${selectedUnitId}&propertyId=${selectedPropertyId}`"
      >
        <span class="hidden sm:inline">Add Lease</span>
        <span class="sm:hidden">New Lease</span>
      </UButton>
    </div>

    <!-- Filters Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
      <USelect
        v-model.string="selectedPortfolioId"
        :items="portfolioOptions"
        placeholder="Select Portfolio"
        size="sm"
        class="w-full"
        :ui="{ width: 'w-full' }"
      />

      <USelect
        v-model.string="selectedPropertyId"
        :items="propertyOptions"
        placeholder="Select Property"
        size="sm"
        class="w-full"
        :ui="{ width: 'w-full' }"
        :disabled="!selectedPortfolioId"
      />
      
      <USelect
        v-model.string="selectedUnitId"
        :items="unitOptions"
        placeholder="Select Unit"
        size="sm"
        class="w-full"
        :ui="{ width: 'w-full' }"
        :disabled="!selectedPropertyId"
      />
    </div>

    <UCard>
      <div v-if="loading">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <USkeleton class="h-28 rounded-xl" v-for="i in 3" :key="i" />
        </div>
      </div>
      <template v-else>
        <div v-if="rowsArray.length === 0" class="py-8 sm:py-12 flex flex-col items-center text-center px-4">
          <div class="i-lucide-file-text h-10 w-10 sm:h-12 sm:w-12 text-primary/80 mb-3" aria-hidden="true" />
          <h2 class="text-lg sm:text-xl font-medium mb-2">No leases found</h2>
          <p class="text-sm text-gray-500 max-w-md mb-4">
            Create your first lease agreement to start tracking rent payments and lease terms.
          </p>
          <UButton 
            icon="i-heroicons-plus"
            size="sm"
            :to="`/app/leases/new?unitId=${selectedUnitId}&propertyId=${selectedPropertyId}`"
            :disabled="!selectedPortfolioId || !selectedUnitId || !selectedPropertyId"
            class="w-full sm:w-auto"
          >
            Create Lease
          </UButton>
        </div>
        <div v-else class="overflow-x-auto -mx-2 sm:mx-0">
          <UTable
            :data="rowsArray"
            :columns="columns"
            class="min-w-full"
            :loading="loading"
            loading-color="primary"
            loading-animation="carousel"
            :ui="{
              wrapper: 'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
              th: { padding: 'py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase trng-wider' },
              td: { padding: 'py-2 px-4 text-sm text-gray-900' },
              thead: 'bg-gray-50 dark:bg-gray-800',
              tbody: 'divide-y divide-gray-200 dark:divide-gray-700',
            }"
          >
            <template #empty-state>
              <div class="text-center py-6 text-gray-500">
                No leases match your current filters
              </div>
            </template>
          </UTable>
        </div>
      </template>
    </UCard>
    <div class="mt-2 text-xs text-gray-500">
      <div v-if="error">Error: {{ error?.message || error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { h, resolveComponent, onMounted, nextTick } from 'vue'
import { useRoute } from '#imports'
import type { TableColumn } from '@nuxt/ui'
import { createProtectedApiClient } from '../../utils/api'
import { useAuth } from '../../composables/useAuth'
import { getLeaseStatusColor } from '../../constants/leases'

const UButton = resolveComponent('UButton')
const ULink = resolveComponent('ULink')
const UBadge = resolveComponent('UBadge')

const columns: TableColumn<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) =>
      h(
        ULink,
        { 
          to: `/leases/${row.original.id}`, 
          class: 'text-primary-600 hover:underline cursor-pointer' 
        },
        () => `#${row.original.id}`
      )
  },
  { accessorKey: 'start_date', header: 'Start' },
  { accessorKey: 'end_date', header: 'End' },
  { accessorKey: 'rent', header: 'Rent' },
  { accessorKey: 'deposit', header: 'Deposit' },
  { accessorKey: 'status', header: 'Status', 
    cell: ({ row }) => 
      h(
        UBadge,
        { color: getLeaseStatusColor(row.original.status), variant: 'soft', class: 'capitalize' },
        () => row.original.status || 'draft'
      )
  },
]

const api = createProtectedApiClient()
const { user, checkAuth } = useAuth()
await checkAuth()

const selectedPortfolioId = ref<string | undefined>(undefined)
const selectedUnitId = ref<string | undefined>(undefined)
const selectedPropertyId = ref<string | undefined>(undefined)

// Load portfolios with units
const { data: portfoliosResponse, pending, error } = await useAsyncData(
  'landlord-portfolios-for-leases',
  async () => {
    if (!user.value?.id) return []
    const endpoint = `/portfolios/landlord/${user.value.id}`
    const res = await api.get<any>(endpoint)
    return res
  },
  {
    watch: [user],
    server: false,
    immediate: true,
    transform: (res: any) => {
      const payload = res?.data ?? res
      const list = Array.isArray(payload) ? payload : (payload?.data ?? [])
      return list
    }
  }
)

const portfolios = computed(() => Array.isArray(portfoliosResponse.value) ? portfoliosResponse.value : [])
const portfolioOptions = computed(() => (portfolios.value || []).map((p: any) => ({
  label: p?.name ?? `Portfolio #${p?.id}`,
  value: typeof p?.id === 'string' ? p.id : (p?.id ?? 0)
})))

watch(portfolios, (list) => {
  const options = (list || []).map((p: any) => ({
    id: String(p?.id || ''),
    properties: (p?.properties || []).map((prop: any) => ({
      ...prop,
      id: String(prop?.id || ''),
      units: (prop?.units || []).map((unit: any) => ({
        ...unit,
        id: String(unit?.id || '')
      }))
    }))
  })).filter((p: any) => p.id !== '')
  
  // Auto-select first portfolio if none selected
  if ((!selectedPortfolioId.value || !options.some((p: any) => p.id === String(selectedPortfolioId.value))) && options.length > 0) {
    const firstPortfolio = options[0]
    selectedPortfolioId.value = firstPortfolio.id
    
    // Auto-select first property if available
    if (firstPortfolio.properties?.length > 0) {
      const firstProperty = firstPortfolio.properties[0]
      selectedPropertyId.value = firstProperty.id
      
      // Auto-select first unit if available
      if (firstProperty.units?.length > 0) {
        const firstUnit = firstProperty.units[0]
        selectedUnitId.value = firstUnit.id
      }
    }
  }
}, { immediate: true, deep: true })

const propertyOptions = computed(() => {
  const selected = portfolios.value.find((p: any) => p?.id === selectedPortfolioId.value)
  const properties = Array.isArray(selected?.properties) ? selected.properties : []
  return properties.map((p: any) => ({
    label: p?.name ? `${p.name} (#${p.id})` : `Property #${p.id}`,
    value: typeof p?.id === 'string' ? p.id : (p?.id ?? 0)
  }))
})

const unitOptions = computed(() => {
  const portfolio = portfolios.value.find((p: any) => String(p?.id) === String(selectedPortfolioId.value))
  const properties = Array.isArray(portfolio?.properties) ? portfolio.properties : []
  const property = properties.find((pr: any) => String(pr?.id) === String(selectedPropertyId.value))
  const units = Array.isArray(property?.units) ? property.units : []
  return units.map((u: any) => ({
    label: u?.label ? `${u.label} (#${u.id})` : `Unit #${u.id}`,
    value: String(u?.id || '')
  }))
})

// Leases list
const leases = ref<any[]>([])
const pendingLeases = ref(false)

async function loadLeases() {
  leases.value = []
  const pid = selectedPropertyId.value
  const uid = selectedUnitId.value
  if (!pid || !uid) return
  try {
    pendingLeases.value = true
    const res = await api.get<any>(`/units/${uid}/leases`)
    const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? [])
    leases.value = list || []
  } catch (e) {
  } finally {
    pendingLeases.value = false
  }
}

interface Portfolio {
  id: string;
  name?: string;
  properties?: Array<{
    id: string;
    name?: string;
    units?: Array<{
      id: string;
      label?: string;
    }>;
  }>;
}

const findPortfolioById = (id: string | undefined): Portfolio | undefined => {
  if (!id) return undefined;
  return portfolios.value.find((p: Portfolio) => String(p?.id) === String(id));
};

watch(selectedPortfolioId, async (id, oldId) => {
  if (id !== oldId) {
    selectedPropertyId.value = undefined;
    selectedUnitId.value = undefined;
    
    // Auto-select first property when portfolio changes
    if (id) {
      const portfolio = findPortfolioById(id);
      const firstProperty = portfolio?.properties?.[0];
      if (firstProperty?.id !== undefined) {
        selectedPropertyId.value = String(firstProperty.id);
      } else {
        selectedPropertyId.value = undefined;
      }
    }
  }
  await loadLeases();
}, { immediate: true });

watch(selectedPropertyId, (id, oldId) => {
  if (id === oldId) return;
  
  selectedUnitId.value = undefined;
  
  // Auto-select first unit when property changes
  if (id && selectedPortfolioId.value) {
    const portfolio = findPortfolioById(selectedPortfolioId.value);
    const property = portfolio?.properties?.find(p => String(p?.id) === String(id));
    
    const firstUnit = property?.units?.[0];
    if (firstUnit?.id !== undefined) {
      selectedUnitId.value = String(firstUnit.id);
    } else {
      selectedUnitId.value = undefined;
    }
  }
}, { immediate: true });

// Watch for unit changes and load leases
watch(selectedUnitId, async (newId, oldId) => {
  if (newId !== oldId && newId) {
    await loadLeases();
  }
});

watch(selectedUnitId, async () => {
  await loadLeases()
})

const rowsArray = computed(() => leases.value || [])
const loading = computed(() => pending.value || pendingLeases.value)

// Handle initial load and query parameters
onMounted(async () => {
  const route = useRoute()
  const query = route.query
  
  // If we have query params, set the selected values
  if (query.portfolioId) {
    selectedPortfolioId.value = String(query.portfolioId)
  }
  if (query.propertyId) {
    selectedPropertyId.value = String(query.propertyId)
  }
  if (query.unitId) {
    selectedUnitId.value = String(query.unitId)
  }
  
  // Wait for the next tick to ensure all refs are updated
  await nextTick()
  
  // If we have a unit ID, load the leases
  if (selectedUnitId.value) {
    await loadLeases()
  }
})
</script>


