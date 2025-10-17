<template>
  <div class="min-h-screen bg-white text-gray-900 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-300/40 blur-3xl rounded-full animate-slow-float"></div>
      <div class="absolute top-40 -right-24 w-[28rem] h-[28rem] bg-teal-200/40 blur-3xl rounded-full animate-slow-float-rev"></div>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-primary-100/60 blur-3xl rounded-full"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-primary-50/60 via-white to-white"></div>
    </div>

    <!-- Hero Section -->
    <section class="container mx-auto px-4 pt-2 md:pt-20">
      <div class="max-w-4xl mx-auto text-center">
        <span class="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary-700 font-semibold bg-primary-50 rounded-full px-3 py-1 shadow-sm ring-1 ring-primary-200/60">
          Features
        </span>
        <h1 class="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
          Everything you need to
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-teal-600">manage properties</span>
        </h1>
        <p class="mt-4 text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
          LeaseDirector combines powerful property management tools with an intuitive interface designed specifically for small landlords and property managers.
        </p>
      </div>
    </section>

    <!-- Main Features Grid -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon="i-heroicons-document-text"
            title="Lease Management"
            description="Create, track, and manage leases with automated reminders for renewals and expirations."
          />
          <FeatureCard 
            icon="i-heroicons-currency-dollar"
            title="Rent Collection"
            description="Automated invoicing, online payments, and late fee calculations to streamline your cash flow."
          />
          <FeatureCard 
            icon="i-heroicons-wrench-screwdriver"
            title="Maintenance Tracking"
            description="Submit, track, and manage maintenance requests with real-time updates."
          />
          <FeatureCard 
            icon="i-heroicons-document-chart-bar"
            title="Financial Reporting"
            description="Generate detailed financial reports for taxes, accounting, and performance tracking."
          />
          <FeatureCard 
            icon="i-heroicons-chat-bubble-left-right"
            title="Tenant Portal"
            description="Secure portal for tenants to pay rent, submit requests, and view documents."
          />
          <FeatureCard 
            icon="i-heroicons-shield-check"
            title="Document Storage"
            description="Secure cloud storage for all your property documents, accessible anytime, anywhere."
          />
        </div>
      </div>
    </section>

    <!-- Detailed Features -->
    <section class="py-16 bg-gray-50 border-t border-gray-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold">Powerful features for modern landlords</h2>
          <p class="mt-2 text-gray-600 max-w-2xl mx-auto">Designed to save you time and reduce the headaches of property management</p>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <UIcon name="i-heroicons-bolt" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-xl font-semibold">Automated Rent Collection</h3>
                <p class="mt-1 text-gray-600">Set up automatic rent payments and never chase late payments again.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <UIcon name="i-heroicons-clock" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-xl font-semibold">Time Zone Aware</h3>
                <p class="mt-1 text-gray-600">Accurate due dates and late fees based on your property's timezone.</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <UIcon name="i-heroicons-shield-check" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-xl font-semibold">Bank-Grade Security</h3>
                <p class="mt-1 text-gray-600">Your data is encrypted and protected with industry-leading security measures.</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <img src="https://picsum.photos/800/500?random=10" alt="Dashboard preview" class="rounded-lg w-full h-auto">
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-3xl mx-auto bg-gradient-to-r from-primary-50 to-teal-50 rounded-2xl p-8 md:p-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to simplify your property management?</h2>
          <p class="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">Join hundreds of landlords who trust LeaseDirector to manage their properties efficiently.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton 
              to="/auth/signup" 
              color="primary"
              size="xl"
              class="px-8"
            >
              Get Started Free
            </UButton>
            <UButton 
              to="/pricing" 
              variant="outline"
              size="xl"
              class="px-8"
            >
              View Pricing
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

definePageMeta({ 
  layout: 'public',
  title: 'Features - LeaseDirector Property Management',
  description: 'Discover powerful property management features including lease tracking, rent collection, maintenance requests, and financial reporting. Built for small landlords.'
})

// SEO: Set up meta for this page
useHead({
  title: 'Features - LeaseDirector Property Management',
  meta: [
    { 
      name: 'description', 
      content: 'Discover powerful property management features including lease tracking, rent collection, maintenance requests, and financial reporting. Built for small landlords.' 
    },
    { property: 'og:title', content: 'Features - LeaseDirector Property Management' },
    { property: 'og:description', content: 'Discover powerful property management features designed specifically for small landlords and property managers.' },
  ]
})
</script>

<style scoped>
.animate-slow-float {
  animation: slow-float 12s ease-in-out infinite;
}

.animate-slow-float-rev {
  animation: slow-float 14s ease-in-out infinite reverse;
}

@keyframes slow-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
</style>
