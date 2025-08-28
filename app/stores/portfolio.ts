import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createProtectedApiClient } from '~/utils/api'

export interface Portfolio {
  id: number | string
  name: string
  timezone: string
  subscription_plan: string
  provider_customer_id?: string
  [key: string]: any
}

export const usePortfolioStore = defineStore('portfolio', () => {
  const activePortfolio = ref<Portfolio | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const api = createProtectedApiClient()

  // Get the active portfolio
  const getActivePortfolio = computed(() => activePortfolio.value)
  
  // Get the current timezone (defaults to 'UTC' if no portfolio is selected)
  const currentTimezone = computed(() => activePortfolio.value?.timezone || 'UTC')

  // Set the active portfolio
  const setActivePortfolio = (portfolio: Portfolio) => {
    activePortfolio.value = portfolio
    // Store in localStorage for persistence across page refreshes
    if (process.client) {
      localStorage.setItem('activePortfolioId', String(portfolio.id))
    }
  }

  // Clear the active portfolio
  const clearActivePortfolio = () => {
    activePortfolio.value = null
    if (process.client) {
      localStorage.removeItem('activePortfolioId')
    }
  }

  // Load portfolio by ID
  const loadPortfolio = async (id: number | string) => {
    if (!id) return null
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/portfolios/${id}`)
      const portfolio = response.data
      setActivePortfolio(portfolio)
      return portfolio
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load portfolio'
      console.error('Error loading portfolio:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Initialize the store with the last active portfolio if available
  const initialize = async () => {
    if (process.client) {
      const savedPortfolioId = localStorage.getItem('activePortfolioId')
      if (savedPortfolioId) {
        await loadPortfolio(savedPortfolioId)
      }
    }
  }

  // Call initialize when the store is created
  if (process.client) {
    initialize()
  }

  return {
    activePortfolio,
    getActivePortfolio,
    currentTimezone,
    isLoading,
    error,
    setActivePortfolio,
    clearActivePortfolio,
    loadPortfolio,
    initialize
  }
})
