import { defineNuxtConfig } from 'nuxt/config'
import { sitemapConfig } from './app/config/sitemap.config'
import type { ModuleOptions } from '@nuxt/ui'

const env = (key: string, fallback = '') => process.env[key] || fallback

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // @ts-ignore - This is a valid configuration for @nuxt/image
  image: {
    // Use 'ipx' in development and 'static' in production
    provider: process.env.NODE_ENV === 'production' ? 'ipx' : 'ipx',
    // Directory where your images are stored
    dir: 'public',
    // Domains for external images (if any)
    domains: ['picsum.photos'],
    // IPX configuration
    ipx: {
      maxAge: 60 * 60 * 24 * 365, // 1 year
    },
    // Screen sizes for responsive images
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    },
    // Image formats to generate
    format: ['webp', 'avif'],
    // Image quality (0-100)
    quality: 80,
    // Device pixel ratios to generate
    densities: [1, 2],
    // Inject the image module
    inject: true,
    // Production-specific config
    ...(process.env.NODE_ENV === 'production' && {
      // Use static provider in production
      static: {
        // This is the base URL where your optimized images will be served from
        baseURL: '/_nuxt/image',
        // Directory where your source images are located
        dir: 'public',
        // Enable image optimization
        sharp: {},
        // Cache optimized images
        cache: {
          // Cache for 1 year
          maxAge: 60 * 60 * 24 * 365
        }
      }
    })
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  srcDir: 'app',

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
    ['@nuxtjs/sitemap', sitemapConfig],
    '@nuxt/image'
  ],


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
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://accounts.google.com https://apis.google.com 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.googleapis.com",
            "img-src 'self' data: blob: https: http: https://*.google.com https://*.gstatic.com https://www.google.com https://www.google-analytics.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://images.unsplash.com https://*.unsplash.com",
            "font-src 'self' data: https: https://fonts.gstatic.com https://*.googleapis.com",
            `connect-src 'self' ${env('NUXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')} wss: https: http: https://*.google.com https://*.googleapis.com https://www.google-analytics.com https://*.google-analytics.com https://stats.g.doubleclick.net https://api.iconify.design`,
            "frame-src 'self' https://accounts.google.com https://www.youtube.com https://www.googletagmanager.com https://apis.google.com https://www.google-analytics.com",
            "frame-ancestors 'self' https://accounts.google.com",
            "form-action 'self'",
            "media-src 'self' https: http:",
            "child-src 'self' blob: https://www.googletagmanager.com"
          ].join('; ')
        }
      }
    }
  },

  components: [{ path: '~/components', pathPrefix: false }],
  imports: { dirs: ['stores', 'composables'] },
  css: ['~/assets/css/main.css'],

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
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      nodeEnv: process.env.NODE_ENV || 'development',
      apiBase: env('NUXT_PUBLIC_API_BASE_URL', 'http://localhost:8000'),
      frontendDomain: env('NUXT_PUBLIC_FRONTEND_DOMAIN', 'leasedirector.com'),
      backendDomain: env('NUXT_PUBLIC_BACKEND_DOMAIN', 'api.leasedirector.com'),
      GTAG_ID: env('NUXT_PUBLIC_GTAG_ID'),
      googleClientId: env('NUXT_PUBLIC_GOOGLE_CLIENT_ID')
    }
  },

  sitemap: sitemapConfig
})
