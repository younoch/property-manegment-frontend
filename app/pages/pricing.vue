<!-- File: pages/pricing.vue -->
<template>
  <div class="min-h-screen bg-white text-gray-900 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-300/30 blur-3xl rounded-full"></div>
      <div class="absolute top-40 -right-24 w-[28rem] h-[28rem] bg-teal-200/30 blur-3xl rounded-full"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-white"></div>
    </div>

    <!-- Hero -->
    <section class="container mx-auto px-4 pt-2 md:pt-20 text-center">
      <h1 class="text-3xl md:text-4xl font-extrabold">Simple, Transparent Pricing</h1>
      <p class="mt-3 text-gray-600 max-w-2xl mx-auto">Choose the plan that works best for you. No hidden fees, cancel
        anytime.</p>
    </section>

    <!-- Pricing plans (no inline components; safe for hydration) -->
    <section class="py-8 md:py-16">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Free Plan -->
          <div
            class="relative p-8 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur transition-all duration-300 hover:border-primary-500 hover:shadow-lg">
            <div class="absolute top-4 right-4 bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">With
              Ads</div>
            <h3 class="text-2xl font-bold">Free</h3>
            <p class="text-gray-600 mt-2">Perfect for getting started</p>

            <div class="mt-6">
              <template v-if="!loading">
                <span class="text-4xl font-extrabold text-gray-900">{{ currency }}0</span>
                <span class="text-gray-600">/month</span>
              </template>
              <USkeleton v-else class="h-10 w-20" />
            </div>

            <ul class="mt-6 space-y-3 text-gray-700">
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-primary-600" />
                <span>1 property with up to 10 units</span>
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-primary-600" />
                <span>Basic property management</span>
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-primary-600" />
                <span>Tenant & lease tracking</span>
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-primary-600" />
                <span>Email support (48h response)</span>
              </li>
              <li class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-x-circle" />
                <span>Displays ads</span>
              </li>
            </ul>

            <UButton color="gray" size="lg" class="w-full mt-8 font-semibold" variant="outline">
              Get Started Free
            </UButton>
          </div>

          <!-- Premium Plan -->
          <div
            class="relative p-8 rounded-2xl border-2 border-primary-500 bg-white/80 backdrop-blur transition-all duration-300 shadow-lg">
            <div
              class="absolute top-4 right-4 bg-primary-100 text-primary-800 text-xs font-bold px-3 py-1 rounded-full">
              Popular
            </div>
            <h3 class="text-2xl font-bold">Premium</h3>
            <p class="text-gray-600 mt-2">For serious landlords</p>

            <div class="mt-6">
              <template v-if="!loading">
                <span class="text-4xl font-extrabold text-gray-900">{{ currency }}9</span>
                <span class="text-gray-600">/month</span>
              </template>
              <USkeleton v-else class="h-10 w-20" />
            </div>

            <ul class="mt-6 space-y-3 text-gray-700">
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-primary-600" />
                <span>2 properties with up to 50 units</span>
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-primary-600" />
                <span>All Free features included</span>
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-primary-600" />
                <span>Priority email support (24h)</span>
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-primary-600" />
                <span>No ads</span>
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-primary-600" />
                <span>Advanced reporting</span>
              </li>
            </ul>

            <UButton color="primary" size="lg" class="w-full mt-8 font-semibold" variant="solid">
              Get Premium
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing model explanation -->
    <section class="py-8 md:py-16 border-t border-gray-100">
      <div class="container mx-auto px-4 max-w-3xl text-center">
        <h2 class="text-xl md:text-2xl font-bold">Simple & Transparent</h2>
        <p class="mt-3 text-gray-600">
          We keep our pricing simple and fair. No hidden fees, no surprises.
          Choose the plan that fits your needs and upgrade anytime.
        </p>
        <ul class="mt-6 text-gray-700 text-left max-w-md mx-auto space-y-2">
          <li class="flex gap-2">
            <UIcon name="i-heroicons-check-circle" class="text-primary-600" /> No credit card required to start
          </li>
          <li class="flex gap-2">
            <UIcon name="i-heroicons-check-circle" class="text-primary-600" /> Cancel anytime, no questions asked
          </li>
          <li class="flex gap-2">
            <UIcon name="i-heroicons-check-circle" class="text-primary-600" /> Secure payment processing
          </li>
        </ul>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-8 md:py-16 border-t border-gray-100">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-xl md:text-2xl font-bold text-center">Pricing FAQ</h2>
        <div class="mt-6 grid md:grid-cols-2 gap-4">
          <UAccordion :items="faqLeft" color="primary" variant="soft" />
          <UAccordion :items="faqRight" color="primary" variant="soft" />
        </div>
      </div>
    </section>

    <!-- CTA strip -->
    <section class="py-8 md:py-16">
      <div class="container mx-auto px-4 text-center">
        <h3 class="text-xl md:text-2xl font-bold">Start managing smarter today</h3>
        <p class="mt-2 text-gray-600">Sign up free. Upgrade only when you need more.</p>
        <div class="mt-6">
          <UButton color="primary" size="md" to="/auth/signup" class="mx-auto">Claim Your 2-Month Free Trial</UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currency = ref('$')   // default USD
const loading = ref(true)

const currencyMap: Record<string, string> = {
  'BD': '৳',    // Bangladesh
  'IN': '₹',    // India
  'PK': '₨',    // Pakistan
  'LK': 'Rs',   // Sri Lanka
  'NP': '₨',    // Nepal

  'US': '$',
  'GB': '£',
  'EU': '€',
  'CA': 'CA$',
  'AU': 'A$',
  'JP': '¥',
  'CN': '¥',
  'KR': '₩',
  'TR': '₺',
  'SA': '﷼',
  'AE': 'د.إ',
  'RU': '₽',
  'BR': 'R$',
  'MX': 'MX$',
  'ZA': 'R',
  'NG': '₦'
}
onMounted(async () => {
  try {
    // Browser-only fetch (no SSR)
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()

    const country = data.country || null

    if (country && currencyMap[country]) {
      currency.value = currencyMap[country]
    } else {
      currency.value = '$'  // fallback
    }
  } 
  catch (err) {
    console.error('Geo Location Error:', err)
    currency.value = '$'
  }
  finally {
    loading.value = false
  }
})
definePageMeta({ layout: 'public' })

useHead({
  title: 'Pricing | LeaseDirector: Property Management Software',
  meta: [
    {
      name: 'description',
      content: 'Simple, transparent pricing for South Asia and global landlords.'
    }
  ]
})
</script>
