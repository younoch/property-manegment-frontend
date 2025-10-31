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
import { useSeoMeta, useHead } from '#app'

// Initialize theme
const { initFromStorage, current } = useThemeColor()

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
              "url": "https://www.leasedirector.com/"
            },
            "offers": {
              "@type": "Offer",
              "url": "https://www.leasedirector.com/pricing",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "featureList": [
              "Comprehensive property management solutions",
              "Bank-grade security",
              "Mobile-friendly interface",
              "24/7 customer support",
              "Automated lease lifecycle management",
              "Digital lease creation with customizable templates",
              "Automated renewal reminders",
              "Electronic signatures for paperless processing",
              "Lease term tracking with visual calendar",
              "Document version control and history",
              "Automated rent collection with multiple payment options",
              "Late fee enforcement and reminders",
              "Detailed payment tracking and rent roll",
              "Maintenance request management with automated workflows",
              "Vendor assignment and tracking",
              "Photo documentation uploads",
              "Preventive maintenance scheduling",
              "Comprehensive financial reporting",
              "Income and expense tracking",
              "Custom report builder and portfolio analytics",
              "Tenant self-service portal with 24/7 access",
              "Online rent payments, document access, and messaging",
              "Secure document storage with role-based access",
              "Automatic backup, versioning, and bulk organization"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "10"
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is LeaseDirector?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "LeaseDirector is a web-based property management software for small landlords to manage tenants, leases, invoices, maintenance, and expenses."
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
                  "text": "Yes, LeaseDirector is designed specifically for small landlords and property managers to simplify property management."
                }
              }
            ]
          }
        ]
      })
    }
  ]
})
</script>
