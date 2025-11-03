// This file provides type definitions for your runtime config

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    public: {
      apiBase: string
      apiBaseUrl: string
      frontendDomain: string
      backendDomain: string
      GTAG_ID?: string
      googleClientId: string
    }
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {}
