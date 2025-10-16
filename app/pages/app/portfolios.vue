<template>
  <div class="max-w-6xl mx-auto p-2 sm:p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-2 sm:mb-4">
      <h1 class="text-xl md:text-2xl font-semibold">Rental Portfolios</h1>
      <!-- it will back later -->
      <UButton v-if="!rowsArray.length" icon="i-heroicons-plus" color="primary" @click="openCreate">
        Add Portfolio
      </UButton>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center items-center h-32">
      <USkeleton class="h-28 w-full rounded-xl" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!rowsArray.length"
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
          <PortfolioCard
            :portfolio="item.data"
            :currencies="currencies"
            :portfolio-statuses="PORTFOLIO_STATUSES"
            @save="updatePortfolio"
            @deleted="handlePortfolioDeleted"
          />
        </template>
      </UTabs>
    </div>

    <!-- Portfolio Form Modal -->
    <PortfolioForm
      v-model:open="isFormOpen"
      @created="onCreated"
      @update:open="onFormOpenChange"
    />
  </div>
</template>

<script setup lang="ts">
import PortfolioCard from '~/components/portfolios/PortfolioCard.vue'
import { createProtectedApiClient } from '../../utils/api'
import { useToast } from '#imports'

definePageMeta({ middleware: ['auth'] })

// Import types and constants
import type { PortfolioRow } from '~/types/portfolio'
import { currencies } from '~/constants/currencies'
import { PORTFOLIO_STATUSES } from '~/constants/portfolio'

const api = createProtectedApiClient()
const toast = useToast()
const { user, checkAuth } = useAuth()
await checkAuth()

// State
const isUpdating = ref(false)

// Define the API response type
interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: PortfolioRow[];
    total: number;
    page: number;
    limit: number;
  };
  timestamp: string;
  path: string;
}

// Data fetching
const fetchPortfolios = async () => {
  try {
    if (!user.value?.id) {
      console.error('No landlord ID available')
      return {
        success: false,
        message: 'No landlord ID',
        data: { data: [], total: 0, page: 1, limit: 100 },
        timestamp: new Date().toISOString(),
        path: ''
      }
    }
    
    // Make the API call with proper typing
    const response = await api.get<ApiResponse>(`/portfolios/landlord/${user.value?.id}?page=1&limit=100`)
    
    if (!response) {
      console.error('Empty response from API')
      return {
        success: false,
        message: 'Empty response',
        data: { data: [], total: 0, page: 1, limit: 100 },
        timestamp: new Date().toISOString(),
        path: ''
      }
    }
    
    return response
  } catch (err) {
    console.error('Error fetching portfolios:', err)
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Unknown error',
      data: { data: [], total: 0, page: 1, limit: 100 },
      timestamp: new Date().toISOString(),
      path: ''
    }
  }
}

// Server-side data fetching
const { data: apiResponse, pending } = await useAsyncData<ApiResponse>(
  'portfolios',
  fetchPortfolios,
  {
    server: true,
    lazy: false,
    immediate: true
  }
)

// Client-side data refresh
const loadPortfolios = async () => {
  try {
    const result = await fetchPortfolios()
    if (result) {
      apiResponse.value = result
    }
  } catch (err) {
    console.error('Error refreshing portfolios:', err)
  }
}

// Extract the portfolios array from the API response
const rowsArray = computed<PortfolioRow[]>({
  get: () => {
    if (!apiResponse.value?.data?.data) return []
    return Array.isArray(apiResponse.value.data.data) ? apiResponse.value.data.data : []
  },
  set: (newValue) => {
    if (apiResponse.value?.data) {
      apiResponse.value.data.data = newValue
    }
  }
})

onMounted(() => {
  loadPortfolios()
  
  // Handle case where user loads after component
  const unwatch = watch(() => user.value, (newUser) => {
    if (newUser?.id) {
      loadPortfolios()
      unwatch()
    }
  }, { immediate: true })
})

// Handle auth state changes
watch(() => user.value, (newUser) => {
  if (newUser?.id) loadPortfolios()
})

// Create
const isFormOpen = ref(false)

function openCreate() {
  isFormOpen.value = true
}

function onCreated(created: PortfolioRow) {
  if (!apiResponse.value) return
  
  // Create a new array with the created portfolio at the beginning
  const newData = {
    ...apiResponse.value.data,
    data: [created, ...(apiResponse.value.data.data || [])],
    total: (apiResponse.value.data.total || 0) + 1
  }
  
  // Update the response with the new data
  apiResponse.value = {
    ...apiResponse.value,
    data: newData
  }
  
  isFormOpen.value = false
  toast.add({ title: 'Portfolio created', color: 'success' })
}

function onFormOpenChange(v: boolean) {
  isFormOpen.value = v
  isUpdating.value = false
}

function updatePortfolio(updatedPortfolio: PortfolioRow) {
  if (!apiResponse.value?.data?.data) return
  
  // Update the portfolio in the local state
  const updatedData = apiResponse.value.data.data.map((portfolio: PortfolioRow) => 
    portfolio.id === updatedPortfolio.id ? updatedPortfolio : portfolio
  )
  
  // Update the response with the modified data
  apiResponse.value = {
    ...apiResponse.value,
    data: {
      ...apiResponse.value.data,
      data: updatedData
    }
  }
  
  toast.add({ title: 'Portfolio updated', color: 'success' })
}

function handlePortfolioDeleted(deletedPortfolio: PortfolioRow) {
  if (!apiResponse.value?.data?.data) return
  
  // Remove the deleted portfolio from the local state
  const updatedData = apiResponse.value.data.data.filter(
    (portfolio: PortfolioRow) => portfolio.id !== deletedPortfolio.id
  )
  
  // Update the response with the filtered data
  apiResponse.value = {
    ...apiResponse.value,
    data: {
      ...apiResponse.value.data,
      data: updatedData,
      total: Math.max(0, (apiResponse.value.data.total || 1) - 1)
    }
  }
  
  toast.add({ 
    title: 'Portfolio deleted', 
    description: `${deletedPortfolio.name} has been deleted`,
    color: 'success' 
  })
}
</script>
