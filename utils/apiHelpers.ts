import { usePortfolioStore } from '~/stores/portfolio'

export const withPortfolioContext = (config: any = {}) => {
  const portfolioStore = usePortfolioStore()
  
  // Add portfolio ID to request headers if available
  if (portfolioStore.activePortfolio?.id) {
    config.headers = {
      ...config.headers,
      'X-Portfolio-ID': String(portfolioStore.activePortfolio.id)
    }
  }
  
  return config
}

export const handleApiError = (error: any, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error)
  
  // Extract error message from response if available
  const message = error.response?.data?.message || 
                error.response?.data?.error || 
                error.message || 
                defaultMessage
  
  // Handle specific error codes
  if (error.response?.status === 401) {
    // Handle unauthorized
    return { error: 'Your session has expired. Please log in again.' }
  }
  
  if (error.response?.status === 403) {
    // Handle forbidden
    return { error: 'You do not have permission to perform this action.' }
  }
  
  if (error.response?.status === 404) {
    // Handle not found
    return { error: 'The requested resource was not found.' }
  }
  
  if (error.response?.status === 422) {
    // Handle validation errors
    const validationErrors = error.response.data.errors || {}
    return { 
      error: 'Validation failed',
      validation: validationErrors
    }
  }
  
  return { error: message }
}
