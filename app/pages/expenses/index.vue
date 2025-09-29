<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-row items-center justify-between gap-2 md:gap-4 mb-1 md:mb-2 ">
      <div class="flex items-center gap-2">
        <UTooltip 
          text="Manage your expenses for each property or portfolio."
          :content="{ side: 'right' }"
          :ui="{ content: 'text-sm text-primary-800 bg-white shadow-lg rounded-md p-3' }"
        >
          <div class="flex gap-2 items-center cursor-pointer">
            <h1 class="text-xl md:text-2xl font-bold text-primary-700">Expenses</h1>
            <UButton
              icon="i-heroicons-information-circle"
              color="neutral"
              variant="ghost"
              aria-label="About Expenses"
              class="p-1 hover:bg-gray-100"
            />
          </div>
        </UTooltip>
      </div>

      <UButton 
        icon="i-heroicons-plus"
        color="primary"
        variant="solid"
        class="hover:scale-105 transition-transform"
        @click="() => { formModel = null; isFormOpen = true }"
        :disabled="!selectedPortfolioId || !selectedPropertyId"
      >
        Add Expense
      </UButton>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow-md rounded-lg p-0 md:p-4 flex flex-wrap items-center md:gap-3 gap-2">
      <div class="flex-1">
        <USelect
          v-model.number="selectedPortfolioId"
          :items="portfolioOptions"
          placeholder="Select Portfolio"
          class="w-full"
        />
      </div>
      <div class="flex-1">
        <USelect
          v-model.number="selectedPropertyId"
          :items="propertyOptions"
          placeholder="Select Property"
          class="w-full"
        />
      </div>

      <div class="flex items-center gap-2 flex-1">
        <UInput 
          v-model="filters.startDate" 
          type="date" 
          placeholder="Start date"
          class="flex-1"
          @update:model-value="loadExpenses" 
        />
        <span class="text-gray-400 text-sm">to</span>
        <UInput 
          v-model="filters.endDate" 
          type="date" 
          placeholder="End date"
          class="flex-1"
          @update:model-value="loadExpenses"
        />
      </div>

      <div class="flex-1">
        <USelect
          v-model="filters.category"
          :items="filterOptions.categories"
          placeholder="All Categories"
          class="w-full"
          @update:model-value="loadExpenses"
        />
      </div>

      <div class="flex-1">
        <USelect
          v-model="filters.status"
          :items="filterOptions.statuses"
          placeholder="All Statuses"
          class="w-full"
          @update:model-value="loadExpenses"
        />
      </div>

      <UButton
        color="error"
        variant="outline"
        icon="i-heroicons-x-mark"
        label="Clear"
        class="whitespace-nowrap hover:bg-gray-100"
        @click="clearFilters"
      />
    </div>

    <!-- Expenses Content -->
    <UCard class="p-4">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <USkeleton v-for="i in 3" :key="i" class="h-32 rounded-xl animate-pulse" />
      </div>

      <!-- Empty State -->
      <div v-else-if="rowsArray.length === 0" class="py-16 flex flex-col items-center text-center gap-4">
        <div class="i-lucide-home h-16 w-16 text-primary/70" />
        <h2 class="text-xl font-semibold">No Expenses Yet</h2>
        <p class="text-gray-500 max-w-sm">Add your first expense to start tracking your property expenses.</p>
        <UButton 
          icon="i-heroicons-plus" 
          color="primary" 
          class="mt-2 hover:scale-105 transition-transform"
          @click="() => { formModel = null; isFormOpen = true }"
          :disabled="!selectedPortfolioId || !selectedPropertyId"
        >
          Add Your First Expense
        </UButton>
      </div>

      <!-- Expenses Table -->
      <UTable
        v-else
        :data="rowsArray"
        :columns="columns"
        class="flex-1 overflow-x-auto rounded-lg"
        :loading="loading"
        loading-color="primary"
        loading-animation="carousel"
      />
    </UCard>

    <!-- Error -->
    <div v-if="error" class="text-red-600 text-sm mt-2">{{ error?.message || error }}</div>

    <!-- Expense Form -->
    <ExpenseForm
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
import { h, resolveComponent, defineAsyncComponent, ref, computed, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { createProtectedApiClient } from '@/utils/api'
import { useAuth } from '@/composables/useAuth'
import { 
  getExpenseStatusColor, 
  getExpenseStatusByValue, 
  getExpenseCategoryByValue, 
  getExpenseCategoryIcon,
  expenseCategories,
  expenseStatuses
} from '@/constants/expense'

// Lazy load components
const ExpenseForm = defineAsyncComponent(() => import('@/components/expenses/ExpenseForm.vue'))
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const route = useRoute()

const router = useRouter()

definePageMeta({ middleware: ['auth'] })

const columns: TableColumn<any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'vendor', header: 'Vendor' },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: (cell: any) => {
      const category = cell.getValue() as string | undefined
      const categoryInfo = getExpenseCategoryByValue(category || '')
      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', { class: categoryInfo?.icon || 'i-heroicons-question-mark-circle' }),
        h('span', categoryInfo?.label || category || 'N/A')
      ])
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: (cell: any) => {
      const amount = cell.getValue() as number | undefined
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount || 0)
    }
  },
  { 
    accessorKey: 'date_incurred',
    header: 'Date Incurred',
    cell: (cell: any) => {
      const date = cell.getValue()
      return date ? new Date(date).toLocaleDateString() : 'N/A'
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (cell: any) => {
      const status = cell.getValue() as string | undefined
      const statusInfo = getExpenseStatusByValue(status || '')
      return h(
        UBadge,
        {
          color: getExpenseStatusColor(status || ''),
          variant: 'soft',
          class: 'capitalize'
        },
        { default: () => statusInfo?.label || status || 'N/A' }
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
          items: tableActions.value,
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

const api = createProtectedApiClient()
const { user, checkAuth } = useAuth()
await checkAuth()

const isViewing = ref(false)
const isDeleteOpen = ref(false)
const isFormOpen = ref(false)
const formModel = ref<any | null>(null)
const deletingId = ref<number | null>(null)
const selectedUnit = ref<any>(null)

// Selection State
const selectedPortfolioId = ref<number | undefined>(undefined)
const selectedPropertyId = ref<number | undefined>(undefined)

// Filter State
const filters = ref({
  startDate: '',
  endDate: '',
  category: '',
  status: ''
})

// Filter Options
const filterOptions = computed(() => ({
  categories: [
    { label: 'All Categories', value: '' },
    ...expenseCategories.map(cat => ({
      label: cat.label,
      value: cat.value
    }))
  ],
  statuses: [
    { label: 'All Statuses', value: '' },
    ...expenseStatuses.map(status => ({
      label: status.label,
      value: status.value
    }))
  ]
}))

// Data State
const units = ref<any[]>([])
const pendingUnits = ref(false)

const landlordId = computed(() => {
  const id = user.value?.id
  return typeof id === 'string' ? Number(id) : id
})

const { data: portfoliosResponse, pending, error } = await useAsyncData(
  'landlord-portfolios-for-units',
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
      return Array.isArray(payload) ? payload : (payload?.data ?? [])
    }
  }
)

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
      (typeof u?.property_id === 'string' ? Number(u.property_id) : u?.property_id) === selectedPropertyId.value
    )
  }
  return allUnits
})

const loading = computed(() => pending.value || pendingUnits.value)

const loadExpenses = async () => {
  if (!selectedPropertyId.value) return

  try {
    pendingUnits.value = true
    const params = new URLSearchParams()

    // Add non-empty filters to params
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value) params.append(key, String(value))
    })
    if (selectedPropertyId.value) params.append('propertyId', selectedPropertyId.value.toString())
    
    const queryString = params.toString()
    const url = `/properties/${selectedPropertyId.value}/expenses${queryString ? `?${queryString}` : ''}`
    
    const res = await api.get<any>(url)
    const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? [])
    units.value = list || []
  } catch (e) {
    // Error toast is handled in the API client
    console.error('Failed to load units:', e)
  } finally {
    pendingUnits.value = false
  }
}

const tableActions = computed(() => {
  return [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square',
      color: 'primary' as const,
      class: 'text-primary-600',
      type: 'button',
      onSelect: (row: any) => {
        selectedUnit.value = row.original
        isFormOpen.value = true
      }
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash',
      color: 'red' as const,
      class: 'text-red-600',
      type: 'button',
      onSelect: (row: any) => {
        selectedUnit.value = row.original
        isDeleteOpen.value = true
      }
    }
  ]
})

// Clear all filters
function clearFilters() {
  filters.value = {
    startDate: '',
    endDate: '',
    category: '',
    status: ''
  }
  loadExpenses()
}

onMounted(() => {
  console.log(route)
  if (route.query.onboarding) {
    isFormOpen.value = true
  }
})

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
  
  await loadExpenses();
}, { immediate: true })

// Watch for property selection changes
watch(selectedPropertyId, async () => {
  await loadExpenses()
})

// ======================
// 11. Event Handlers
// ======================
const onCreated = async (created: any) => {
  if (route.query.onboarding) {
    navigateTo(`/leases/new?unitId=${created.id}&propertyId=${selectedPropertyId.value}&portfolioId=${selectedPortfolioId.value}&onboarding=true`)
  }
  // Refresh the units list to get the latest data
  await loadExpenses()
}

</script>