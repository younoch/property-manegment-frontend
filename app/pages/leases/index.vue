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
        :to="`/leases/new?unitId=${selectedUnitId}&propertyId=${selectedPropertyId}`"
      >
        <span class="hidden sm:inline">Add Lease</span>
        <span class="sm:hidden">New Lease</span>
      </UButton>
    </div>

    <!-- Filters Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
      <USelect
        v-model="selectedPortfolioId"
        :items="portfolioOptions"
        placeholder="Select Portfolio"
        size="sm"
        class="w-full"
        :ui="{ width: 'w-full' }"
      />

      <USelect
        v-model="selectedPropertyId"
        :items="propertyOptions"
        placeholder="Select Property"
        size="sm"
        class="w-full"
        :ui="{ width: 'w-full' }"
        :disabled="!selectedPortfolioId"
      />
      
      <USelect
        v-model="selectedUnitId"
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
            :to="`/leases/new?unitId=${selectedUnitId}&propertyId=${selectedPropertyId}`"
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
const landlordId = computed(() => {
  const id = user.value?.id
  return typeof id === 'string' ? id : String(id)
})

const selectedPortfolioId = ref<string | undefined>(undefined)
const selectedPropertyId = ref<string | undefined>(undefined)
const selectedUnitId = ref<string | undefined>(undefined)

// Load portfolios with units
interface Portfolio {
  id: string;
  name: string;
  properties?: Array<{
    id: string;
    name: string;
    units?: Array<{
      id: string;
      label: string;
    }>;
  }>;
}

const { data: portfoliosResponse, pending, error } = await useAsyncData<Portfolio[]>(
  'landlord-portfolios-for-leases',
  async () => {
    const { data } = await api.get('/portfolios/landlord');
    return data;
  }
);

function findPortfolioById(id: string | undefined): Portfolio | undefined {
  return portfolios.value.find((p: Portfolio) => {
    const pid = typeof p?.id === 'string' ? p.id : String(p.id);
    const searchId = typeof id === 'string' ? id : String(id);
    return pid === searchId;
  });
}

watch(selectedPortfolioId, async (id, oldId) => {
  if (id !== oldId) {
    selectedPropertyId.value = undefined;
    selectedUnitId.value = undefined;
    
    // Auto-select first property when portfolio changes
    if (id) {
      const portfolio = findPortfolioById(id);
      const firstProperty = portfolio?.properties?.[0];
      selectedPropertyId.value = firstProperty?.id?.toString();
    }
  }
  await loadLeases();
}, { immediate: true });

watch(selectedPropertyId, async (id, oldId) => {
  if (id === oldId) return;
  
  selectedUnitId.value = undefined;
  
  // Auto-select first unit when property changes
  if (id && selectedPortfolioId.value) {
    const portfolio = findPortfolioById(selectedPortfolioId.value);
    const property = portfolio?.properties?.find((p: any) => p?.id?.toString() === id?.toString());
    const firstUnit = property?.units?.[0];
    selectedUnitId.value = firstUnit?.id?.toString();
  }
}, { immediate: true });

// Watch for unit changes and load leases
watch(selectedUnitId, async (newId: string | undefined, oldId: string | undefined) => {
  if (newId !== oldId && newId) {
    await loadLeases();
  }
});

const rowsArray = computed(() => leases.value || []);
const portfolioOptions = computed(() => (portfolios.value || []).map((p: Portfolio) => ({
  value: p.id,
  label: p.name
})));

// Expose properties to template
defineExpose({
  portfolioOptions,
  propertyOptions,
  unitOptions,
  loading
});

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


