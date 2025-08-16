// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: [
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      // Support both apiBase and apiBaseUrl to match env var NUXT_PUBLIC_API_BASE_URL
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
      frontendDomain: process.env.NUXT_PUBLIC_FRONTEND_DOMAIN || 'yourapp.com',
      backendDomain: process.env.NUXT_PUBLIC_BACKEND_DOMAIN || 'api.yourapp.com'
    }
  }
})