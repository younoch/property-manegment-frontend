import { computed } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'

export const useMoney = () => {
  const portfolioStore = usePortfolioStore()
  
  // Format a number as currency
  const formatCurrency = (amount: number | string | null | undefined, options: Intl.NumberFormatOptions = {}) => {
    if (amount === null || amount === undefined) return ''
    
    const value = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(value)) return 'Invalid amount'
    
    // Default options
    const defaultOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    }
    
    try {
      return new Intl.NumberFormat('en-US', defaultOptions).format(value)
    } catch (e) {
      console.error('Error formatting currency:', e)
      return value.toFixed(2)
    }
  }
  
  // Format a number as a percentage
  const formatPercent = (value: number | string | null | undefined, decimals = 2) => {
    if (value === null || value === undefined) return ''
    
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return 'Invalid percentage'
    
    return `${num.toFixed(decimals)}%`
  }
  
  // Calculate total from an array of items with amount property
  const calculateTotal = (items: Array<{ amount: number | string } | number | string> | null | undefined): number => {
    if (!items || !Array.isArray(items)) return 0
    
    return items.reduce<number>((sum: number, item) => {
      let amount = 0
      
      if (typeof item === 'object' && item !== null && 'amount' in item) {
        amount = typeof item.amount === 'string' ? parseFloat(item.amount) || 0 : item.amount || 0
      } else if (typeof item === 'number') {
        amount = item
      } else if (typeof item === 'string') {
        amount = parseFloat(item) || 0
      }
      
      return sum + amount
    }, 0)
  }
  
  // Format a number with a specific number of decimal places
  const toFixed = (value: number | string | null | undefined, decimals = 2) => {
    if (value === null || value === undefined) return ''
    
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return '0.00'
    
    return num.toFixed(decimals)
  }
  
  // Check if a value is a valid monetary amount
  const isValidAmount = (value: any): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === 'number') return !isNaN(value) && isFinite(value)
    if (typeof value === 'string') {
      const num = parseFloat(value)
      return !isNaN(num) && isFinite(num)
    }
    return false
  }
  
  return {
    formatCurrency,
    formatPercent,
    calculateTotal,
    toFixed,
    isValidAmount
  }
}
