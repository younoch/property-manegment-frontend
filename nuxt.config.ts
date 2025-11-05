import { defineNuxtConfig } from 'nuxt/config'
import { sitemapConfig } from './app/config/sitemap.config'
import type { ModuleOptions } from '@nuxt/ui'

const env = (key: string, fallback = '') => process.env[key] || fallback

export default defineNuxtConfig({
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
    ['@nuxtjs/sitemap', sitemapConfig]
  ],

  nitro: {
    preset: 'vercel',
    prerender: {
      crawlLinks: true,
      failOnError: false, // prevent build failure from missing pages
      routes: [
        '/',
        '/features',
        '/pricing',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/support',
        '/auth/login',
        '/auth/signup',
        '/sitemap.xml'
      ]
    },
    routeRules: {
      // Pages with dynamic IPX images should not be prerendered
      '/app/**': { prerender: false },
      '/system-monitor/**': { prerender: false },
      // Global headers for all routes
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
      link: [
        // Preconnect to Google Fonts domains
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
      ],
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

  // @ts-ignore - sitemap config is valid
  sitemap: sitemapConfig
})
