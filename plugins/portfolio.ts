import { defineNuxtPlugin } from '#app'
import { usePortfolioStore } from '~/stores/portfolio'

export default defineNuxtPlugin(async (nuxtApp) => {
  const portfolioStore = usePortfolioStore()
  
  // Only run on client side
  if (process.client) {
    try {
      // Initialize the portfolio store (loads last active portfolio if any)
      await portfolioStore.initialize()
      
      // Add a navigation guard to check for active portfolio on protected routes
      const router = useRouter()
      
      router.beforeEach(async (to, from, next) => {
        // List of routes that don't require an active portfolio
        const publicPaths = ['/login', '/register', '/auth', '/portfolios', '/portfolios/create']
        
        // Skip check for public paths
        if (publicPaths.some(path => to.path.startsWith(path))) {
          return next()
        }
        
        // If no portfolio is active, redirect to portfolios page
        if (!portfolioStore.activePortfolio) {
          return next('/portfolios')
        }
        
        next()
      })
      
    } catch (error) {
      console.error('Failed to initialize portfolio store:', error)
    }
  }
  
  return {
    provide: {
      portfolio: {
        store: portfolioStore,
        formatDate: portfolioStore.formatDate,
        formatCurrency: portfolioStore.formatCurrency
      }
    }
  }
})
