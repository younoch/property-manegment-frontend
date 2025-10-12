// nuxt.config.ts
import 'dotenv/config'
import { defineNuxtConfig } from 'nuxt/config'
import type { ModuleOptions } from '@nuxt/ui'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon.png' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [
        {
          async: true,
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NUXT_PUBLIC_GTAG_ID}`
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NUXT_PUBLIC_GTAG_ID}', { send_page_view: true });
          `,
          type: 'text/javascript'
        }
      ]
    }
  },
  modules: [
    ['@nuxt/ui', {
      icons: ['mdi', 'heroicons']
    } as Partial<ModuleOptions>],
    [
      '@pinia/nuxt',
      {
        autoImports: [
          'defineStore',
          'storeToRefs',
          'acceptHMRUpdate'
        ]
      }
    ]
  ],
  imports: {
    // IMPORTANT: When specifying dirs, Nuxt stops using defaults. Include 'composables' explicitly.
    dirs: ['stores', 'composables']
  },
  css: [
    '~/assets/css/main.css'
  ],
  ui: {
    colors: {
      primary: 'emerald'   // <- your brand
    }
  },
  srcDir: 'app',
  runtimeConfig: {
    public: {
      // Support both apiBase and apiBaseUrl to match env var NUXT_PUBLIC_API_BASE_URL
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
      frontendDomain: process.env.NUXT_PUBLIC_FRONTEND_DOMAIN || 'yourapp.com',
      backendDomain: process.env.NUXT_PUBLIC_BACKEND_DOMAIN || 'api.yourapp.com',
      GTAG_ID: process.env.NUXT_PUBLIC_GTAG_ID
    }
  }
})