<template>
  <UApp :ui="{
    notifications: { toaster: false },
    container: {
      constrained: 'max-w-screen-2xl',
      padding: 'px-4 sm:px-6 lg:px-8',
    }
  }" class="min-h-screen w-screen overflow-x-hidden">
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

// Add JSON-LD structured data
useHead({
  script: [
    {
      "type": "application/ld+json",
      "innerHTML": JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          // --- Main Software Application ---
          {
            "@type": "SoftwareApplication",
            "name": "LeaseDirector",
            "url": "https://www.leasedirector.com/",
            "image": "https://www.leasedirector.com/favicon.png",
            "description": "LeaseDirector is a property management software for small landlords to manage leases, tenants, invoices, and payments — all in one dashboard. Automate rent collection and stay organized with ease.",
            "applicationCategory": "BusinessApplication",
            "applicationSubCategory": "PropertyManagementSoftware",
            "operatingSystem": "Web",
            "softwareRequirements": "Modern web browser (Chrome, Firefox, Safari, Edge), Internet connection",
            "softwareVersion": "1.0.1",
            "interactionStatistic": {
              "@type": "InteractionCounter",
              "interactionType": "https://schema.org/UseAction",
              "userInteractionCount": 1133
            },
            "keywords": "property management, rent collection, tenant management, lease management, landlord software",
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
              "priceValidUntil": "2026-12-31",
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "applicableCountry": [
                  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
                  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
                  "PL", "PT", "RO", "SK", "SI", "ES", "SE"
                ]
              }
            },
            "featureList": [
              "Lease management, invoicing, and payments in one dashboard",
              "Tenant tracking and automatic rent reminders",
              "Digital lease creation and e-signatures",
              "Maintenance request tracking with photos",
              "Income and expense reporting",
              "Bank-grade data security",
              "Mobile-friendly interface for landlords and tenants"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "25"
            },
            "potentialAction": [
              {
                "@type": "RegisterAction",
                "target": "https://www.leasedirector.com/auth/signup",
                "name": "Sign up for LeaseDirector"
              },
              {
                "@type": "UseAction",
                "target": "https://www.leasedirector.com/features",
                "name": "Explore LeaseDirector features"
              }
            ]
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
                  "text": "LeaseDirector is a web-based property management software for small landlords to manage tenants, leases, invoices, maintenance, and payments efficiently."
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
            "description": "Perfect for getting started — 1 property with up to 3 units. Basic property management, tenant & lease tracking, rent payment tracking, and email support (48h).",
            "image": "https://www.leasedirector.com/LeaseDirector-free-plan.png",
            "offers": {
              "@type": "Offer",
              "url": "https://www.leasedirector.com/pricing",
              "price": "0",
              "priceCurrency": "USD",
              "priceValidUntil": "2026-12-31",
              "availability": "https://schema.org/InStock",
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "applicableCountry": [
                  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
                  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
                  "PL", "PT", "RO", "SK", "SI", "ES", "SE"
                ]
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "8"
            },
            "review": [
              {
                "@type": "Review",
                "author": { "@type": "Person", "name": "John M." },
                "reviewBody": "Excellent free plan for managing a small property portfolio.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5" }
              }
            ]
          },
          {
            "@type": "Product",
            "name": "LeaseDirector Early Bird Plan",
            "description": "Limited to first 100 adopters — includes all Pro features, up to 20 units, automatic late fees & grace, credits & overpayments, recurring rent invoices, A/R aging, and priority email support (24h).",
            "image": "https://www.leasedirector.com/LeaseDirector-early-bird-plan.png",
            "offers": {
              "@type": "Offer",
              "url": "https://www.leasedirector.com/pricing",
              "price": "7",
              "priceCurrency": "USD",
              "priceValidUntil": "2025-12-31",
              "availability": "https://schema.org/InStock",
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "applicableCountry": [
                  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
                  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
                  "PL", "PT", "RO", "SK", "SI", "ES", "SE"
                ]
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "12"
            },
            "review": [
              {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Sarah K." },
                "reviewBody": "Early Bird plan is a great deal — covers everything I need as a small landlord.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5" }
              }
            ]
          },
          {
            "@type": "Product",
            "name": "LeaseDirector Pro Plan",
            "description": "For growing landlords with up to 20 units — includes automatic late fees & grace, credits & overpayments, recurring rent invoices, A/R aging & ledger export, and priority email support (24h).",
            "image": "https://www.leasedirector.com/LeaseDirector-pro-plan.png",
            "offers": {
              "@type": "Offer",
              "url": "https://www.leasedirector.com/pricing",
              "price": "10",
              "priceCurrency": "USD",
              "priceValidUntil": "2026-12-31",
              "availability": "https://schema.org/PreOrder",
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "applicableCountry": [
                  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
                  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
                  "PL", "PT", "RO", "SK", "SI", "ES", "SE"
                ]
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "15"
            },
            "review": [
              {
                "@type": "Review",
                "author": { "@type": "Person", "name": "James T." },
                "reviewBody": "Solid plan for managing mid-size portfolios. Very reliable software.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5" }
              }
            ]
          },
          {
            "@type": "Product",
            "name": "LeaseDirector Business Plan",
            "description": "Unlimited units & advanced controls — multi-portfolio roles & permissions, advanced reports & exports, audit log & compliance tools, custom branding, and SLA support (8h).",
            "image": "https://www.leasedirector.com/LeaseDirector-business-plan.png",
            "offers": {
              "@type": "Offer",
              "url": "https://www.leasedirector.com/pricing",
              "price": "30",
              "priceCurrency": "USD",
              "priceValidUntil": "2026-12-31",
              "availability": "https://schema.org/PreOrder",
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "applicableCountry": [
                  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
                  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
                  "PL", "PT", "RO", "SK", "SI", "ES", "SE"
                ]
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "7"
            },
            "review": [
              {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Laura B." },
                "reviewBody": "Powerful tools for managing larger portfolios — worth every dollar.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5" }
              }
            ]
          }
        ]
      })
    }

  ]

})

</script>
