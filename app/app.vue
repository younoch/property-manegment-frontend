<template>
  <UApp 
    :ui="{ 
      notifications: { toaster: false },
      container: {
        constrained: 'max-w-screen-2xl',
        padding: 'px-4 sm:px-6 lg:px-8',
      }
    }"
    class="min-h-screen w-screen overflow-x-hidden"
  >
    <template #notifications>
      <ClientOnly>
        <UToaster />
      </ClientOnly>
    </template>

    <div class="min-h-screen w-full flex flex-col">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { useThemeColor } from '~/composables/useThemeColor'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSeoMeta, useHead } from '#imports'

// Initialize theme
const { initFromStorage, current } = useThemeColor()

// Add standard mobile web app capable meta tag
useHead({
  meta: [
    { name: 'mobile-web-app-capable', content: 'yes' }
  ]
})

// Watch for theme changes to update meta theme-color
watch(current, (newTheme) => {
  if (process.client) {
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim() || '#ffffff'
    useSeoMeta({
      themeColor
    })
  }
}, { immediate: true })

// This ensures the page is scrolled to top on route change
const route = useRoute()

// Initialize theme on client-side
onMounted(() => {
  if (process.client) {
    initFromStorage()
  }
})

// Set up meta tags for SEO and mobile optimization
useSeoMeta({
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'black-translucent',
  appleMobileWebAppTitle: 'LeaseDirector'
} as const)

watch(() => route.path, () => {
  window.scrollTo(0, 0)
})

// Add JSON-LD structured data
useHead({
script: [
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        // --- Main Software Application ---
        {
          "@type": "SoftwareApplication",
          "name": "LeaseDirector",
          "url": "https://www.leasedirector.com/",
          "image": "https://www.leasedirector.com/favicon.png",
          "description": "LeaseDirector is a web app for small landlords to manage leases, tenants, invoices, maintenance, and expenses — all in one dashboard. Free to start.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "author": {
            "@type": "Organization",
            "name": "LeaseDirector",
            "url": "https://www.leasedirector.com/",
            "sameAs": [
              "https://www.facebook.com/leasedirector",
              "https://twitter.com/leasedirector",
              "https://www.linkedin.com/company/leasedirector"
            ]
          },
          "offers": {
            "@type": "Offer",
            "url": "https://www.leasedirector.com/pricing",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2026-12-31"
          },
          "featureList": [
            "Comprehensive property management solutions for small landlords",
            "Bank-grade security for all tenant and financial data",
            "Mobile-friendly interface accessible on all devices",
            "24/7 customer support for landlords and property managers",
            "Automated lease lifecycle management from creation to renewal",
            "Digital lease creation with customizable templates",
            "Automated renewal reminders for tenants and landlords",
            "Electronic signatures for fully paperless processing",
            "Visual calendar for lease term tracking and reminders",
            "Document version control and secure history tracking",
            "Automated rent collection with multiple payment options",
            "Grace period-aware late fee enforcement and reminders",
            "Detailed payment tracking and rent roll reporting",
            "Maintenance request management with automated workflows",
            "Vendor assignment and task tracking for repairs",
            "Photo documentation uploads for property records",
            "Preventive maintenance scheduling and reminders",
            "Comprehensive financial reporting with export options",
            "Income and expense tracking across all properties",
            "Custom report builder and portfolio analytics",
            "Tenant self-service portal with 24/7 access",
            "Online rent payments, document access, and messaging",
            "Secure document storage with role-based access",
            "Automatic backup, versioning, and bulk organization of files"
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "10"
          }
        },

        // --- FAQ Page ---
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is LeaseDirector?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "LeaseDirector is a web-based property management software for small landlords to manage tenants, leases, invoices, maintenance, and expenses efficiently."
              }
            },
            {
              "@type": "Question",
              "name": "Is LeaseDirector free to start?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, LeaseDirector offers a free plan to get started, with optional paid plans for advanced features."
              }
            },
            {
              "@type": "Question",
              "name": "Can I track tenant payments and late fees?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, LeaseDirector allows you to track payments, manage late fees, and automate invoices easily."
              }
            },
            {
              "@type": "Question",
              "name": "Does LeaseDirector handle maintenance requests?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, you can manage and track maintenance requests for your properties directly from the dashboard."
              }
            },
            {
              "@type": "Question",
              "name": "Is it suitable for small landlords?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, LeaseDirector is designed specifically for small landlords and property managers to simplify property management tasks."
              }
            }
          ]
        },

        // --- Pricing Plans ---
        {
          "@type": "Product",
          "name": "LeaseDirector Free Plan",
          "description": "1 property with up to 3 units. Basic property management, tenant & lease tracking, rent payment tracking, email support (48h).",
          "offers": {
            "@type": "Offer",
            "url": "https://www.leasedirector.com/pricing",
            "price": "0",
            "priceCurrency": "USD",
            "priceValidUntil": "2026-12-31",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "Product",
          "name": "LeaseDirector Early Bird Plan",
          "description": "Up to 20 units, automatic late fees & grace, credits & overpayments, recurring rent invoices, A/R aging & ledger export, priority email support (24h). Limited to first 100 customers.",
          "offers": {
            "@type": "Offer",
            "url": "https://www.leasedirector.com/pricing",
            "price": "18",
            "priceCurrency": "USD",
            "priceValidUntil": "2025-12-31",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "Product",
          "name": "LeaseDirector Pro Plan",
          "description": "For growing landlords with up to 20 units. Automatic late fees & grace, credits & overpayments, recurring rent invoices, A/R aging & ledger export, priority email support (24h).",
          "offers": {
            "@type": "Offer",
            "url": "https://www.leasedirector.com/pricing",
            "price": "25",
            "priceCurrency": "USD",
            "priceValidUntil": "2026-12-31",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "Product",
          "name": "LeaseDirector Business Plan",
          "description": "Unlimited units, multi-portfolio roles & permissions, advanced reports & exports, audit log & compliance tools, custom branding, SLA support (8h).",
          "offers": {
            "@type": "Offer",
            "url": "https://www.leasedirector.com/pricing",
            "price": "75",
            "priceCurrency": "USD",
            "priceValidUntil": "2026-12-31",
            "availability": "https://schema.org/InStock"
          }
        }
      ]
    })
  }
]
})

</script>
