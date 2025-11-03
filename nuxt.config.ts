// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import { sitemapConfig } from './app/config/sitemap.config'
import type { ModuleOptions } from '@nuxt/ui'

// Load environment variables early
import 'dotenv/config'

// ✅ Helper: safely read environment vars
const env = (key: string, fallback = '') => process.env[key] || fallback

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  srcDir: 'app',

  /**
   * ------------------------------------------
   * ⚙️ Nitro Server Configuration
   * ------------------------------------------
   */
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
          'Content-Security-Policy': [
            "default-src 'self'",
            // Allow GTM & Google APIs
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.google.com https://*.googleapis.com",
            "style-src 'self' 'unsafe-inline' https://*.google.com https://*.googleapis.com https://fonts.googleapis.com",
            // Allow images from various sources
            "img-src 'self' data: blob: https: http: https://*.google.com https://*.gstatic.com https://picsum.photos https://www.picsum.photos https://images.unsplash.com https://*.unsplash.com",
            "font-src 'self' data: https: https://fonts.gstatic.com https://*.googleapis.com",
            // API and WebSocket connections
            "connect-src 'self' " +
              (process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000') +
              " wss: https: http: https://*.google.com https://*.googleapis.com https://api.iconify.design https://picsum.photos https://www.picsum.photos",
            // Frame sources
            "frame-src 'self' https://accounts.google.com https://www.youtube.com https://youtube.com",
            "frame-ancestors 'self' https://accounts.google.com",
            // Additional security headers
            "form-action 'self'",
            "media-src 'self' https: http:",
            "child-src 'self' blob:"
          ].join('; ')
        }
      }
    }
  },

  /**
   * ------------------------------------------
   * 🧩 Nuxt Modules
   * ------------------------------------------
   */
  modules: [
    [
      '@nuxt/ui',
      {
        icons: ['mdi', 'heroicons'],
        colors: { primary: 'emerald' }
      } as Partial<ModuleOptions>
    ],
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'storeToRefs', 'acceptHMRUpdate']
      }
    ],
  ],

  /**
   * ------------------------------------------
   * 🧱 Components / Imports
   * ------------------------------------------
   */
  components: [{ path: '~/components', pathPrefix: false }],
  imports: { dirs: ['stores', 'composables'] },

  /**
   * ------------------------------------------
   * 🎨 Global Styles
   * ------------------------------------------
   */
  css: ['~/assets/css/main.css'],

  /**
   * ------------------------------------------
   * 🌐 App Meta & SEO
   * ------------------------------------------
   */
  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'LeaseDirector | Property Management for Small Landlords',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Manage leases, automate invoices, track payments, and late fees — built for small landlords. Free to start.'
        },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.png' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [
        {
          async: true,
          src: `https://www.googletagmanager.com/gtag/js?id=${env('NUXT_PUBLIC_GTAG_ID')}`
        },
        {
          id: 'gtag-inline',
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${env('NUXT_PUBLIC_GTAG_ID')}', { send_page_view: true });
          `,
          type: 'text/javascript'
        }
      ]
    }
  },

  /**
   * ------------------------------------------
   * ⚠️ Disable Sanitization for GTAG Inline Script
   * ------------------------------------------
   */
  __dangerouslyDisableSanitizersByTagID: {
    'gtag-inline': ['innerHTML']
  },

  /**
   * ------------------------------------------
   * 🔐 Runtime Configuration
   * ------------------------------------------
   */
  runtimeConfig: {
    public: {
      apiBase: env('NUXT_PUBLIC_API_BASE_URL', 'http://localhost:8000'),
      frontendDomain: env('NUXT_PUBLIC_FRONTEND_DOMAIN', 'leasedirector.com'),
      backendDomain: env('NUXT_PUBLIC_BACKEND_DOMAIN', 'api.leasedirector.com'),
      GTAG_ID: env('NUXT_PUBLIC_GTAG_ID'),
      googleClientId: env('NUXT_PUBLIC_GOOGLE_CLIENT_ID')
    }
  },

  /**
   * ------------------------------------------
   * 🗺️ Sitemap
   * ------------------------------------------
   */
  sitemap: sitemapConfig
})
