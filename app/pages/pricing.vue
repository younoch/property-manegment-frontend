<!-- File: pages/pricing.vue -->
<template>
  <div class="min-h-screen bg-white text-gray-900 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/30 blur-3xl rounded-full"></div>
      <div class="absolute top-40 -right-24 w-[28rem] h-[28rem] bg-teal-200/30 blur-3xl rounded-full"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-white to-white"></div>
    </div>

    <!-- Hero -->
    <section class="container mx-auto px-4 pt-16 md:pt-24 text-center">
      <h1 class="text-4xl md:text-5xl font-extrabold">Simple Pricing</h1>
      <p class="mt-3 text-gray-600 max-w-2xl mx-auto">LeaseTrack is built for small landlords. Start free, then upgrade as you grow. Cancel anytime.</p>

      <!-- Billing cycle toggle -->
      <div class="mt-6 flex justify-center gap-3">
        <UButton :variant="billing==='monthly' ? 'solid' : 'soft'" color="emerald" @click="billing='monthly'">Monthly</UButton>
        <UButton :variant="billing==='quarterly' ? 'solid' : 'soft'" color="emerald" @click="billing='quarterly'">Quarterly <span class='hidden sm:inline'>(save 20%)</span></UButton>
        <UButton :variant="billing==='yearly' ? 'solid' : 'soft'" color="emerald" @click="billing='yearly'">Yearly <span class='hidden sm:inline'>(save 30%)</span></UButton>
      </div>
    </section>

    <!-- Pricing plans (no inline components; safe for hydration) -->
<section class="py-16">
  <div class="container mx-auto px-4 grid md:grid-cols-3 gap-8">
    <div
      v-for="plan in plans"
      :key="plan.name"
      class="relative p-6 rounded-2xl border shadow-sm bg-white/80 backdrop-blur transition"
      :class="plan.highlight ? 'border-emerald-500 shadow-lg md:scale-105' : 'border-gray-200'"
    >
      <h3 class="text-xl font-bold">{{ plan.name }}</h3>
      <p class="text-sm text-gray-600 mt-1">{{ plan.desc }}</p>

      <div class="mt-4 flex items-end justify-center gap-1">
        <span class="text-4xl font-extrabold text-gray-900">
          {{ plan.price[billing] }}
        </span>
        <span class="text-sm text-gray-600 mb-1">{{ periodLabel }}</span>
      </div>

      <ul class="mt-5 space-y-2 text-sm text-gray-700">
        <li v-for="f in plan.features" :key="f" class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="text-emerald-600" /> {{ f }}
        </li>
      </ul>

      <div class="mt-6">
        <UButton :color="plan.highlight ? 'emerald' : 'gray'" size="lg" class="w-full">
          {{ plan.cta }}
        </UButton>
      </div>
    </div>
  </div>
</section>

    <!-- Pricing model explanation -->
    <section class="py-16 border-t border-gray-100">
      <div class="container mx-auto px-4 max-w-3xl text-center">
        <h2 class="text-2xl md:text-3xl font-bold">How our pricing works</h2>
        <p class="mt-3 text-gray-600">
          LeaseTrack pricing is based on the number of <strong>units</strong> you manage,
          not the number of users. Invite unlimited teammates at no extra cost. Start free with 5 units, upgrade as you grow.
        </p>
        <ul class="mt-6 text-gray-700 text-left max-w-md mx-auto space-y-2">
          <li class="flex gap-2"><UIcon name="i-heroicons-check-circle" class="text-emerald-600"/> Units drive pricing, not users</li>
          <li class="flex gap-2"><UIcon name="i-heroicons-check-circle" class="text-emerald-600"/> Unlimited users per portfolio</li>
          <li class="flex gap-2"><UIcon name="i-heroicons-check-circle" class="text-emerald-600"/> Cancel or upgrade anytime</li>
          <li class="flex gap-2"><UIcon name="i-heroicons-check-circle" class="text-emerald-600"/> Free forever for 5 units</li>
        </ul>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 border-t border-gray-100">
      <div class="container mx-auto px-4 max-w-4xl">
        <h2 class="text-2xl md:text-3xl font-bold text-center">Pricing FAQ</h2>
        <div class="mt-6 grid md:grid-cols-2 gap-4">
          <UAccordion :items="faqLeft" color="emerald" variant="soft"/>
          <UAccordion :items="faqRight" color="emerald" variant="soft"/>
        </div>
      </div>
    </section>

    <!-- CTA strip -->
    <section class="py-16">
      <div class="container mx-auto px-4 text-center">
        <h3 class="text-2xl md:text-3xl font-bold">Start managing smarter today</h3>
        <p class="mt-2 text-gray-600">Sign up free. Upgrade only when you need more.</p>
        <div class="mt-6 flex justify-center gap-3">
          <UButton color="emerald" size="lg" to="/auth/register">Get Started Free</UButton>
          <UButton variant="soft" color="gray" size="lg" to="/demo">See Live Demo</UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useHead({
  title: 'LeaseTrack — Pricing',
  meta: [{ name: 'description', content: 'Simple pricing...' }]
})


const billing = ref<'monthly' | 'quarterly' | 'yearly'>('quarterly')

const periodLabel = computed(() => {
  if (billing.value === 'monthly') return '/month'
  if (billing.value === 'quarterly') return '/3 months'
  return '/year'
})

const plans = [
  {
    name: 'Starter',
    desc: 'Get started with up to 5 units',
    cta: 'Get Started Free',
    highlight: false,
    price: { monthly: '$0', quarterly: '$0', yearly: '$0' },
    features: [
      '5 units included',
      'Unlimited leases & invoices',
      'Partial payments',
      'Portfolio timezone',
      'Basic reporting',
      'Email support (48h)'
    ],
  },
  {
    name: 'Pro',
    desc: 'For growing landlords with up to 20 units',
    cta: 'Upgrade to Pro',
    highlight: true,
    price: { monthly: '$10', quarterly: '$25', yearly: '$100' },
    features: [
      'Up to 20 units',
      'Automatic late fees & grace',
      'Credits & overpayments',
      'Recurring rent invoices',
      'A/R aging & ledger export',
      'Priority email support (24h)'
    ],
  },
  {
    name: 'Business',
    desc: 'Unlimited units & advanced controls',
    cta: 'Talk to Sales',
    highlight: false,
    price: { monthly: '$33', quarterly: '$75', yearly: '$300' },
    features: [
      'Unlimited units',
      'Multi-portfolio roles & permissions',
      'Advanced reports & exports',
      'Audit log & compliance tools',
      'Custom branding',
      'SLA support (8h)'
    ],
  },
]

const faqLeft = [
  { label: 'Is there a free plan?', content: 'Yes—the Starter plan is free for up to 5 units.' },
  { label: 'Can I cancel anytime?', content: 'Yes—you can cancel your subscription at any time from your account settings.' },
  { label: 'Do you charge per user?', content: 'No—all plans include unlimited users per portfolio.' }
]

const faqRight = [
  { label: 'Do you offer discounts?', content: 'We offer discounts for quarterly and yearly billing.' },
  { label: 'What payment methods are supported?', content: 'We use secure payment processors and accept major credit/debit cards.' },
  { label: 'Do you offer refunds?', content: 'All fees are non-refundable except where required by law.' }
]
</script>

<style scoped>
</style>
