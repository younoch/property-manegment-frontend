<!-- app/pages/leases/index.vue -->
<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll">
    <div class="flex items-center justify-between gap-2">
      <UTooltip
        text="Create and manage lease agreements for a unit."
        :content="{ side: 'right' }"
      >
        <div class="flex gap-2 cursor-pointer">
          <h1 class="text-2xl font-semibold">Leases</h1>
          <UButton
            icon="i-heroicons-information-circle"
            color="neutral"
            variant="ghost"
            aria-label="About Leases"
            class="p-1"
          />
        </div>
      </UTooltip>
      <UButton 
        icon="i-heroicons-plus" 
        :disabled="!selectedPortfolioId || !selectedUnitId || !selectedPropertyId"
        :to="`/leases/new?unitId=${selectedUnitId}&propertyId=${selectedPropertyId}&portfolioId=${selectedPortfolioId}`"
      >Add Lease
      </UButton>
    </div>

    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <USelect
        v-model.number="selectedPortfolioId"
        :items="portfolioOptions"
        placeholder="Select Portfolio"
        class="min-w-[220px]"
      />

      <USelect
        v-model.number="selectedPropertyId"
        :items="propertyOptions"
        placeholder="Select Property"
        class="min-w-[220px]"
      />
      <USelect
        v-model.number="selectedUnitId"
        :items="unitOptions"
        placeholder="Select Unit"
        class="min-w-[220px]"
      />
    </div>

    <UCard>
      <div v-if="loading">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <USkeleton class="h-28 rounded-xl" v-for="i in 3" :key="i" />
        </div>
      </div>
      <div v-else-if="rowsArray.length === 0" class="py-10 flex flex-col items-center text-center gap-3">
        <div class="i-lucide-file-text h-12 w-12 text-primary/80" aria-hidden="true" />
        <p class="text-lg font-medium">No leases yet</p>
        <p class="text-sm text-gray-500 max-w-md">
          Create your first lease agreement to start tracking rent payments and lease terms.
        </p>
        <UButton 
          icon="i-heroicons-plus" 
          class="mt-2" 
          :to="`/leases/new?unitId=${selectedUnitId}&propertyId=${selectedPropertyId}&portfolioId=${selectedPortfolioId}`"
          :disabled="!selectedPortfolioId || !selectedUnitId || !selectedPropertyId"
        >
          Create Your First Lease
        </UButton>
      </div>
      <UTable
        v-else
        :data="rowsArray"
        :columns="columns"
        class="flex-1"
        :loading="loading"
        loading-color="primary"
        loading-animation="carousel"
      />
    </UCard>

    <div class="mt-2 text-xs text-gray-500">
      <div v-if="error">Error: {{ error?.message || error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { h, resolveComponent } from 'vue'
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

const landlordId = computed(() => {
  const id = user.value?.id
  return typeof id === 'string' ? Number(id) : id
})

const selectedPortfolioId = ref<number | undefined>(undefined)
const selectedUnitId = ref<number | undefined>(undefined)
const selectedPropertyId = ref<number | undefined>(undefined)

// Load portfolios with units
const { data: portfoliosResponse, pending, error } = await useAsyncData(
  'landlord-portfolios-for-leases',
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
      return list
    }
  }
)

const portfolios = computed(() => Array.isArray(portfoliosResponse.value) ? portfoliosResponse.value : [])
const portfolioOptions = computed(() => (portfolios.value || []).map((p: any) => ({
  label: p?.name ?? `Portfolio #${p?.id}`,
  value: typeof p?.id === 'string' ? Number(p.id) : (p?.id ?? 0)
})))

watch(portfolios, (list) => {
  const options = (list || []).map((p: any) => ({
    id: typeof p?.id === 'string' ? Number(p.id) : p?.id,
    properties: p?.properties || []
  })).filter((p: any) => Number.isFinite(p.id))
  
  // Auto-select first portfolio if none selected
  if ((!selectedPortfolioId.value || !options.some((p: any) => p.id === selectedPortfolioId.value)) && options.length > 0) {
    const firstPortfolio = options[0]
    selectedPortfolioId.value = firstPortfolio.id
    
    // Auto-select first property if available
    if (firstPortfolio.properties?.length > 0) {
      const firstProperty = firstPortfolio.properties[0]
      selectedPropertyId.value = typeof firstProperty.id === 'string' ? Number(firstProperty.id) : firstProperty.id
      
      // Auto-select first unit if available
      if (firstProperty.units?.length > 0) {
        const firstUnit = firstProperty.units[0]
        selectedUnitId.value = typeof firstUnit.id === 'string' ? Number(firstUnit.id) : firstUnit.id
      }
    }
  }
}, { immediate: true, deep: true })

const propertyOptions = computed(() => {
  const selected = portfolios.value.find((p: any) => p?.id === selectedPortfolioId.value)
  const properties = Array.isArray(selected?.properties) ? selected.properties : []
  return properties.map((p: any) => ({
    label: p?.name ? `${p.name} (#${p.id})` : `Property #${p.id}`,
    value: typeof p?.id === 'string' ? Number(p.id) : (p?.id ?? 0)
  }))
})

const unitOptions = computed(() => {
  const portfolio = portfolios.value.find((p: any) => p?.id === selectedPortfolioId.value)
  const properties = Array.isArray(portfolio?.properties) ? portfolio.properties : []
  const property = properties.find((pr: any) => (typeof pr?.id === 'string' ? Number(pr.id) : pr?.id) === selectedPropertyId.value)
  const units = Array.isArray(property?.units) ? property.units : []
  return units.map((u: any) => ({
    label: u?.label ? `${u.label} (#${u.id})` : `Unit #${u.id}`,
    value: typeof u?.id === 'string' ? Number(u.id) : (u?.id ?? 0)
  }))
})

// Leases list
const leases = ref<any[]>([])
const pendingLeases = ref(false)

async function loadLeases() {
  leases.value = []
  const pid = selectedPortfolioId.value
  const uid = selectedUnitId.value
  if (!pid || !uid) return
  try {
    pendingLeases.value = true
    const res = await api.get<any>(`/portfolios/${pid}/units/${uid}/leases`)
    const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? [])
    leases.value = list || []
  } catch (e) {
  } finally {
    pendingLeases.value = false
  }
}

interface Portfolio {
  id: number | string;
  name?: string;
  properties?: Array<{
    id: number | string;
    name?: string;
    units?: Array<{
      id: number | string;
      label?: string;
    }>;
  }>;
}

const findPortfolioById = (id: number | string | undefined): Portfolio | undefined => {
  return portfolios.value.find((p: Portfolio) => {
    const pid = typeof p?.id === 'string' ? Number(p.id) : p?.id;
    const searchId = typeof id === 'string' ? Number(id) : id;
    return pid === searchId;
  });
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
        selectedPropertyId.value = typeof firstProperty.id === 'string' 
          ? Number(firstProperty.id) 
          : firstProperty.id;
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
    const property = portfolio?.properties?.find((p: any) => {
      const pid = typeof p?.id === 'string' ? Number(p.id) : p?.id;
      const searchId = typeof id === 'string' ? Number(id) : id;
      return pid === searchId;
    });
    
    const firstUnit = property?.units?.[0];
    if (firstUnit?.id !== undefined) {
      selectedUnitId.value = typeof firstUnit.id === 'string' 
        ? Number(firstUnit.id) 
        : firstUnit.id;
    } else {
      selectedUnitId.value = undefined;
    }
  }
}, { immediate: true });

watch(selectedUnitId, async () => {
  await loadLeases()
})

const rowsArray = computed(() => leases.value || [])
const loading = computed(() => pending.value || pendingLeases.value)
</script>


