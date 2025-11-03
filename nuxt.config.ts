// nuxt.config.ts
import 'dotenv/config'
import { defineNuxtConfig } from 'nuxt/config'
import type { ModuleOptions } from '@nuxt/ui'
import { sitemapConfig } from './app/config/sitemap.config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app',

  // Nitro configuration for security headers
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          // Security Headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: *.google.com *.googleapis.com; style-src 'self' 'unsafe-inline' https: *.google.com *.googleapis.com; img-src 'self' data: https: *.google.com *.gstatic.com; font-src 'self' data: https: *.gstatic.com; connect-src 'self' http://localhost:8000 wss://localhost:8000 https: *.google.com *.googleapis.com; frame-src 'self' https://accounts.google.com; frame-ancestors 'self' https://accounts.google.com;"
        }
      }
    }
  },

  // Server routes are handled in /app/server/routes/

  // Modules
  // Image optimization
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
    ],
    '@nuxtjs/sitemap', // ✅ Added sitemap module
    '@nuxt/image' // ✅ Added image optimization module
  ],

  // Image module configuration
  image: {
    domains: ['picsum.photos'],
    provider: 'ipx',
    ipx: {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      domains: ['picsum.photos']
    },
    presets: {
      cover: {
        modifiers: {
          format: 'webp',
          quality: 80,
          fit: 'cover'
        }
      },
      avatar: {
        modifiers: {
          format: 'webp',
          quality: 70,
          width: 100,
          height: 100,
          fit: 'cover'
        }
      }
    },
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  // App Configuration
  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'LeaseDirector | Property Management for Small Landlords',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Manage leases, invoice automation track payments and late fees. Built for small landlords. Free to start.' },
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

  imports: {
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

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
      frontendDomain: process.env.NUXT_PUBLIC_FRONTEND_DOMAIN || 'yourapp.com',
      backendDomain: process.env.NUXT_PUBLIC_BACKEND_DOMAIN || 'api.yourapp.com',
      GTAG_ID: process.env.NUXT_PUBLIC_GTAG_ID,
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || ''
    }
  },

  // ✅ Sitemap configuration
  sitemap: sitemapConfig  
})
