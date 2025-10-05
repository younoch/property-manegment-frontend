<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll">
    <div class="flex items-center justify-between gap-2">
      <UTooltip 
      text="Here you can add and manage the apartments or rooms you rent out. Each unit belongs to one of your properties."
      :content="{side: 'right'}"
      :ui="{content: 'text-sm text-primary-800 bg-white shadow-lg rounded-md p-3'}"
    >
      <div class="flex gap-2 cursor-pointer">
        <h1 class="text-xl md:text-2xl font-semibold">Units</h1>
        <UButton
          icon="i-heroicons-information-circle"
          color="neutral"
          variant="ghost"
          aria-label="About Units"
          class="p-1"
        />
      </div>
      </UTooltip>
      <UButton icon="i-heroicons-plus" @click="() => { formModel = null; isFormOpen = true }" :disabled="!selectedPortfolioId || !selectedPropertyId" >Add Unit</UButton>
    </div>

    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <USelect
        v-model.string="selectedPortfolioId"
        :items="portfolioOptions"
        placeholder="Select Portfolio"
        class="min-w-[220px]"
      />

      <USelect
        v-model.string="selectedPropertyId"
        :items="propertyOptions"
        placeholder="Filter by Property (optional)"
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
        <div class="i-lucide-home h-12 w-12 text-primary/80" aria-hidden="true" />
        <p class="text-lg font-medium">No units yet</p>
        <p class="text-sm text-gray-500 max-w-md">
          Add your first unit to start managing leases, collecting rent, and tracking maintenance.
        </p>
        <UButton 
          icon="i-heroicons-plus" 
          class="mt-2" 
          @click="() => { formModel = null; isFormOpen = true }"
          :disabled="!selectedPortfolioId || !selectedPropertyId"
        >
          Add Your First Unit
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
        :ui="{ td: 'py-2 px-4' }"
      />
    </UCard>

    <div class="mt-2 text-xs text-gray-500">
      <div v-if="error">Error: {{ error?.message || error }}</div>
    </div>

    <UnitForm
      v-model:open="isFormOpen"
      :model="formModel"
      :view="isViewing"
      :portfolio-id="selectedPortfolioId"
      :property-id="selectedPropertyId"
      :portfolio-options="portfolioOptions"
      :property-options="propertyOptions"
      @created="onCreated"
    />
  </div>
  
</template>

<script setup lang="ts">
// ======================
// 1. Imports
// ======================
import { h, resolveComponent, defineAsyncComponent, ref, computed, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { createProtectedApiClient } from '../utils/api'
import { useAuth } from '../composables/useAuth'
import { getUnitStatusColor } from '../constants/units'

// Lazy load components
const UnitForm = defineAsyncComponent(() => import('~/components/units/UnitForm.vue'))
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const route = useRoute()

const router = useRouter()

// ======================
// 2. Component Configuration
// ======================
definePageMeta({ middleware: ['auth'] })

// ======================
// 3. Table Configuration
// ======================
const columns: TableColumn<any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'label', header: 'Label' },
  { accessorKey: 'property_id', header: 'Property' },
  { accessorKey: 'bedrooms', header: 'Beds' },
  { accessorKey: 'bathrooms', header: 'Baths' },
  { accessorKey: 'sqft', header: 'Sqft' },
  { accessorKey: 'market_rent', header: 'Market Rent' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (cell: any) => {
      const status = cell.getValue() as string | undefined
      return h(
        UBadge,
        {
          color: getUnitStatusColor(status || 'vacant'),
          variant: 'soft',
        },
        { default: () => status || 'vacant' }
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => h(
      'div',
      { class: 'text-right' },
      h(
        UDropdownMenu,
        {
          content: { align: 'end' },
          items: getRowItems(row),
          'aria-label': 'Actions dropdown'
        },
        () => h(UButton, {
          icon: 'i-lucide-ellipsis-vertical',
          color: 'neutral',
          variant: 'ghost',
          class: 'ml-auto',
          'aria-label': 'Actions dropdown'
        })
      )
    )
  }
]


// ======================
// 4. Initial Setup
// ======================
const api = createProtectedApiClient()
const { user, checkAuth } = useAuth()
await checkAuth()

// ======================
// 5. Refs and Reactive State
// ======================
// UI State
const isViewing = ref(false)
const isDeleteOpen = ref(false)
const isFormOpen = ref(false)
const formModel = ref<any | null>(null)
const deletingId = ref<string | null>(null)

// Selection State
const selectedPortfolioId = ref<string | undefined>(undefined)
const selectedPropertyId = ref<string | undefined>(undefined)

// Data State
const units = ref<any[]>([])
const pendingUnits = ref(false)

// ======================
// 6. Computed Properties
// ======================

// ======================
// 7. Data Fetching
// ======================
const { data: portfoliosResponse, pending, error } = await useAsyncData(
  'landlord-portfolios-for-units',
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
      return Array.isArray(payload) ? payload : (payload?.data ?? [])
    }
  }
)

// ======================
// 8. Computed Selections
// ======================
// Portfolios
const portfolios = computed(() => Array.isArray(portfoliosResponse.value) ? portfoliosResponse.value : [])
const portfolioOptions = computed(() => portfolios.value.map((p: any) => ({
  label: p.name,
  value: p.id,
  icon: 'i-heroicons-briefcase',
})))

// Properties
const properties = computed(() => {
  if (!selectedPortfolioId.value) return []
  const portfolio = portfolios.value.find((p: any) => p.id === selectedPortfolioId.value)
  return portfolio?.properties || []
})

const propertyOptions = computed(() => properties.value.map((p: any) => ({
  label: p.name,
  value: p.id,
})))

// Units
const rowsArray = computed(() => {
  const allUnits = units.value || []
  if (selectedPropertyId.value) {
    return allUnits.filter((u: any) => 
      String(u?.property_id || '') === String(selectedPropertyId.value || '')
    )
  }
  return allUnits
})

const loading = computed(() => pending.value || pendingUnits.value)

// ======================
// 9. Methods
// ======================
async function loadUnits() {
  const pid = selectedPortfolioId.value
  const propId = selectedPropertyId.value
  if (!pid || !propId) {
    units.value = []
    return
  }

  try {
    pendingUnits.value = true
    units.value = []
    
    const res = await api.get<any>(`/properties/${propId}/units`)
    const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? [])
    units.value = list || []
  } catch (e) {
    // Error toast is handled in the API client
    console.error('Failed to load units:', e)
  } finally {
    pendingUnits.value = false
  }
}

function getRowItems(row: any) {
  const baseActions = [
    { type: 'label', label: 'Actions' },
    {
      label: 'View',
      icon: 'i-lucide-eye',
      color: 'info',
      class: 'text-info',
      onSelect() {
        formModel.value = { ...row.original }
        isViewing.value = true
        isFormOpen.value = true
      }
    },
    {
      label: 'Edit',
      icon: 'i-lucide-pencil',
      color: 'primary',
      class: 'text-primary',
      onSelect() {
        formModel.value = { ...row.original }
        isViewing.value = false
        isFormOpen.value = true
      }
    }
  ]

  // Add lease option for vacant units
  if (row.original.status === 'vacant') {
    baseActions.push({
      label: 'Lease unit',
      icon: 'i-lucide-key',
      color: 'secondary',
      class: 'text-secondary',
      onSelect() {
        navigateTo(`/leases/new?unitId=${row.original.id}&propertyId=${row.original.property_id}`)
      }
    })
  }

  // Add delete action
  baseActions.push(
    { type: 'separator' },
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'error',
      class: 'text-error',
      onSelect() {
        deletingId.value = row.original.id
        isDeleteOpen.value = true
      }
    }
  )

  return baseActions
}

onMounted(() => {
  if (route.query.onboarding) {
    isFormOpen.value = true
  }
})

// ======================
// 10. Watchers
// ======================
// Watch for portfolio changes
watch(portfolios, (newPortfolios) => {
  if (newPortfolios.length > 0 && !selectedPortfolioId.value) {
    selectedPortfolioId.value = newPortfolios[0]?.id
  }
}, { immediate: true })

// Watch for property changes based on portfolio
watch(properties, (newProperties) => {
  if (newProperties.length > 0 && !selectedPropertyId.value) {
    selectedPropertyId.value = newProperties[0]?.id
  }
}, { immediate: true })

// Watch for portfolio selection changes
watch(selectedPortfolioId, async (id, oldId) => {
  if (id === oldId) return;
  
  // Reset selected property when portfolio changes
  selectedPropertyId.value = undefined;
  
  // If we have properties for the new portfolio, select the first one
  if (properties.value.length > 0) {
    selectedPropertyId.value = properties.value[0]?.id;
  }
  
  await loadUnits();
}, { immediate: true })

// Watch for property selection changes
watch(selectedPropertyId, async () => {
  await loadUnits()
})

// ======================
// 11. Event Handlers
// ======================
const onCreated = async (created: any) => {
  if (route.query.onboarding) {
    navigateTo(`/leases/new?unitId=${created.id}&propertyId=${selectedPropertyId.value}&onboarding=true`)
  }
  // Refresh the units list to get the latest data
  await loadUnits()
}

</script>