import { usePortfolioStore } from '~/stores/portfolio'
import { useRouter } from 'vue-router'
import { useNotification } from './useNotification'

export const useActivePortfolio = () => {
  const portfolioStore = usePortfolioStore()
  const router = useRouter()
  const { error: showError } = useNotification()
  
  // Set the active portfolio and optionally redirect
  const setActivePortfolio = async (portfolioId: string | number, redirectPath: string = '/dashboard') => {
    try {
      await portfolioStore.loadPortfolio(portfolioId)
      if (redirectPath) {
        await navigateTo(redirectPath)
      }
      return true
    } catch (err) {
      console.error('Failed to set active portfolio:', err)
      showError('Error', 'Failed to load portfolio. Please try again.')
      return false
    }
  }
  
  // Require an active portfolio, redirect if none is set
  const requireActivePortfolio = (redirectPath: string = '/portfolios') => {
    if (!portfolioStore.activePortfolio) {
      if (process.client) {
        navigateTo(redirectPath)
      }
      return null
    }
    return portfolioStore.activePortfolio
  }
  
  // Format date in portfolio timezone
  const formatDate = (date: Date | string | null | undefined, format: string = 'PPP') => {
    if (!date) return ''
    
    const { formatDate: formatDateTz } = usePortfolioDates()
    return formatDateTz(date, format)
  }
  
  // Format currency with portfolio settings
  const formatCurrency = (amount: number | string | null | undefined, options: Intl.NumberFormatOptions = {}) => {
    const { formatCurrency: formatMoney } = useMoney()
    return formatMoney(amount, options)
  }
  
  return {
    activePortfolio: portfolioStore.activePortfolio,
    currentTimezone: portfolioStore.currentTimezone,
    setActivePortfolio,
    requireActivePortfolio,
    formatDate,
    formatCurrency,
    isLoading: portfolioStore.isLoading,
    error: portfolioStore.error
  }
}
