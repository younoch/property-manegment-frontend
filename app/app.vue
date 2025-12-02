<template>
  <UApp
    :ui="{
      notifications: { toaster: false },
      container: { constrained: 'max-w-screen-2xl', padding: 'px-4 sm:px-6 lg:px-8' }
    }"
    class="min-h-screen w-screen overflow-x-hidden"
  >
    <!-- Notifications -->
    <template #notifications>
      <ClientOnly>
        <UToaster />
      </ClientOnly>
    </template>

    <!-- Layout Wrapper -->
    <div class="flex flex-col min-h-screen w-full">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<script setup lang="ts">
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
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "applicableCountry": ["AF", "BD", "BT", "IN", "MV", "NP", "PK", "LK"]
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
            "description": "Perfect for getting started — Basic property management, tenant & lease tracking, rent payment tracking, and email support.",
            "image": "https://www.leasedirector.com/LeaseDirector-free-plan.png",
            "offers": {
              "@type": "Offer",
              "url": "https://www.leasedirector.com/pricing",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "applicableCountry": ["AF", "BD", "BT", "IN", "MV", "NP", "PK", "LK"]
              }
            }
          },
          {
            "@type": "Product",
            "name": "LeaseDirector Early Bird Plan",
            "description": "Includes all Pro features, automatic late fees & grace, credits & overpayments, recurring rent invoices, A/R aging, and priority email support.",
            "image": "https://www.leasedirector.com/LeaseDirector-early-bird-plan.png",
            "offers": {
              "@type": "Offer",
              "url": "https://www.leasedirector.com/pricing",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "applicableCountry": ["AF", "BD", "BT", "IN", "MV", "NP", "PK", "LK"]
              }
            }
          },
          {
            "@type": "Product",
            "name": "LeaseDirector Pro Plan",
            "description": "For growing landlords — includes automatic late fees & grace, credits & overpayments, recurring rent invoices, A/R aging & ledger export, and priority email support.",
            "image": "https://www.leasedirector.com/LeaseDirector-pro-plan.png",
            "offers": {
              "@type": "Offer",
              "url": "https://www.leasedirector.com/pricing",
              "priceCurrency": "USD",
              "availability": "https://schema.org/PreOrder",
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "applicableCountry": ["AF", "BD", "BT", "IN", "MV", "NP", "PK", "LK"]
              }
            }
          },
          {
            "@type": "Product",
            "name": "LeaseDirector Business Plan",
            "description": "For large portfolios — includes multi-portfolio roles & permissions, advanced reports & exports, audit log & compliance tools, custom branding, and priority support.",
            "image": "https://www.leasedirector.com/LeaseDirector-business-plan.png",
            "offers": {
              "@type": "Offer",
              "url": "https://www.leasedirector.com/pricing",
              "priceCurrency": "USD",
              "availability": "https://schema.org/PreOrder",
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "applicableCountry": ["AF", "BD", "BT", "IN", "MV", "NP", "PK", "LK"]
              }
            }
          }
        ]
      })
    }

  ]

})

useSeoMeta({
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'black-translucent',
  appleMobileWebAppTitle: 'LeaseDirector'
})
</script>
