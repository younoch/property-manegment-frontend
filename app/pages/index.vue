<template>
  <div>
    <!-- Decorative animated background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/40 blur-3xl rounded-full animate-slow-float"></div>
      <div class="absolute top-40 -right-24 w-[28rem] h-[28rem] bg-teal-200/40 blur-3xl rounded-full animate-slow-float-rev"></div>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-emerald-100/60 blur-3xl rounded-full"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-white to-white"></div>
    </div>

    <!-- HERO (no header) -->
    <section class="container mx-auto px-4 pt-16 md:pt-24">
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span class="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-700 font-semibold bg-emerald-50 rounded-full px-3 py-1 shadow-sm ring-1 ring-emerald-200/60">LeaseTrack · Smart Property Management</span>
          <h1 class="mt-5 text-4xl md:text-6xl font-extrabold leading-tight">
            Manage leases, send invoices,
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">get paid—fast.</span>
          </h1>
          <p class="mt-4 text-gray-700 text-lg md:text-xl max-w-xl">
            <strong>LeaseTrack</strong> — <em>Smart Property Management Made Easy for Small Landlords</em>. Create leases, auto-generate monthly invoices, track payments and late fees, all in your portfolio time zone.
          </p>
          <div class="mt-7 flex flex-col sm:flex-row gap-3">
            <UButton color="emerald" size="lg" to="/signup" class="shadow-lg shadow-emerald-200 hover:shadow-emerald-300">Get Started Free</UButton>
            <UButton variant="soft" color="gray" size="lg" to="/demo">See Live Demo</UButton>
          </div>
          <p class="mt-3 text-xs text-gray-500">No credit card required · 1-minute signup · Works on mobile</p>
          <div class="mt-6 grid grid-cols-3 gap-3 max-w-md">
            <img src="https://picsum.photos/200/300?random=1" alt="Sample building" class="h-24 w-full object-cover rounded-xl border border-gray-200"/>
            <img src="https://picsum.photos/200/300?random=2" alt="Sample dashboard" class="h-24 w-full object-cover rounded-xl border border-gray-200"/>
            <img src="https://picsum.photos/200/300?random=3" alt="Landlord workspace" class="h-24 w-full object-cover rounded-xl border border-gray-200"/>
          </div>
        </div>
        <div class="relative">
          <div class="rounded-2xl border border-gray-200/70 shadow-xl overflow-hidden bg-white/70 backdrop-blur">
            <img src="https://picsum.photos/800/600?random=4" alt="Hero Dashboard Mockup" class="w-full h-auto">
          </div>
          <div class="hidden md:block absolute -bottom-6 -right-6 w-64 rounded-xl border border-gray-200 shadow-md bg-white/80 p-3 animate-float">
            <img src="https://picsum.photos/400/600?random=5" alt="Invoice Preview A4" class="rounded-md w-full h-auto">
          </div>
        </div>
      </div>
    </section>

    <!-- Trust / quick stats + logo cloud -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="grid sm:grid-cols-3 gap-6 text-center">
          <StatCard value="99.9%" label="Uptime on secure cloud"/>
          <StatCard value="Portfolio TZ" label="Accurate due & overdue"/>
          <StatCard value="Minutes" label="From lease to first invoice"/>
        </div>
        <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 opacity-70">
          <img src="https://picsum.photos/100/100?random=6" class="h-6 object-contain mx-auto" alt="Logo 1"/>
          <img src="https://picsum.photos/100/100?random=7" class="h-6 object-contain mx-auto" alt="Logo 2"/>
          <img src="https://picsum.photos/100/100?random=8" class="h-6 object-contain mx-auto" alt="Logo 3"/>
          <img src="https://picsum.photos/100/100?random=9" class="h-6 object-contain mx-auto" alt="Logo 4"/>
          <img src="https://picsum.photos/100/100?random=10" class="h-6 object-contain mx-auto" alt="Logo 5"/>
          <img src="https://picsum.photos/100/100?random=11" class="h-6 object-contain mx-auto" alt="Logo 6"/>
        </div>
      </div>
    </section>

    <!-- Problem → Solution with rich content -->
    <section class="py-16 border-t border-gray-100" id="problem">
      <div class="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold">Spreadsheets cause missed payments. We fix that.</h2>
          <p class="mt-3 text-gray-600">A simple flow: <span class="font-medium">Lease → Invoice → Payment</span> with automatic status updates, grace periods, and idempotent late fees.</p>
          <ul class="mt-6 space-y-3 text-gray-700">
            <li class="flex gap-3"><UIcon name="i-heroicons-check-circle" class="text-emerald-600 mt-0.5"/> Auto-generate monthly rent invoices (with proration)</li>
            <li class="flex gap-3"><UIcon name="i-heroicons-check-circle" class="text-emerald-600 mt-0.5"/> One-click payment recording + partials + credits</li>
            <li class="flex gap-3"><UIcon name="i-heroicons-check-circle" class="text-emerald-600 mt-0.5"/> Grace-aware overdue & idempotent late fees</li>
            <li class="flex gap-3"><UIcon name="i-heroicons-check-circle" class="text-emerald-600 mt-0.5"/> Immutable paid/void invoices with full audit trail</li>
          </ul>
          <div class="mt-6 grid grid-cols-2 gap-3">
            <img src="https://picsum.photos/300/200?random=12" class="h-28 w-full object-cover rounded-lg border border-gray-200" alt="Messy spreadsheets"/>
            <img src="https://picsum.photos/300/200?random=13" class="h-28 w-full object-cover rounded-lg border border-gray-200" alt="Clean dashboard"/>
          </div>
        </div>
        <div>
          <img src="https://picsum.photos/800/500?random=14" alt="Money Flow Diagram" class="rounded-2xl border border-gray-200 shadow-md w-full h-auto"/>
        </div>
      </div>
    </section>

    <!-- Features (expanded) -->
    <section id="features" class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center">Everything you need to run rentals</h2>
        <p class="mt-3 text-center text-gray-600">Built for small landlords: fast, accurate, and audit-friendly.</p>
        <div class="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="Smart Invoicing" desc="Monthly rent, prorations, deposits on activation, late fees when due." icon="i-heroicons-document-text"/>
          <FeatureCard title="Payment Tracking" desc="Partial payments, FIFO application, credit carry-forward." icon="i-heroicons-banknotes"/>
          <FeatureCard title="Time‑Zone Aware" desc="Portfolio-level TZ for due/overdue accuracy." icon="i-heroicons-clock"/>
          <FeatureCard title="Multi‑Tenant Leases" desc="Primary + additional tenants under one lease." icon="i-heroicons-user-group"/>
          <FeatureCard title="Role-Based Access" desc="Owner, Manager, Accountant, Read-only permissions." icon="i-heroicons-lock-closed"/>
          <FeatureCard title="Audit & Exports" desc="Immutable paid/void, CSV exports, clean history." icon="i-heroicons-arrow-down-tray"/>
        </div>
        <div class="mt-10 grid lg:grid-cols-2 gap-6">
          <img src="https://picsum.photos/800/600?random=15" alt="Invoice Items Inline Edit" class="rounded-xl border border-gray-200 shadow-sm w-full h-auto"/>
          <img src="https://picsum.photos/800/600?random=16" alt="Lease Header with Grace Deadline" class="rounded-xl border border-gray-200 shadow-sm w-full h-auto"/>
        </div>
        <div class="mt-10 grid md:grid-cols-2 gap-6">
          <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
            <h3 class="font-semibold text-lg">Security & Reliability</h3>
            <ul class="mt-3 space-y-2 text-sm text-gray-700">
              <li class="flex gap-2"><UIcon name="i-heroicons-shield-check" class="text-emerald-600"/> Encrypted in transit (HTTPS) & daily backups</li>
              <li class="flex gap-2"><UIcon name="i-heroicons-bolt" class="text-emerald-600"/> 99.9% uptime, auto-retries & idempotent ops</li>
              <li class="flex gap-2"><UIcon name="i-heroicons-lock-closed" class="text-emerald-600"/> Role-based access control per portfolio</li>
            </ul>
          </div>
          <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
            <h3 class="font-semibold text-lg">Integrations (Roadmap)</h3>
            <ul class="mt-3 space-y-2 text-sm text-gray-700">
              <li class="flex gap-2"><UIcon name="i-heroicons-credit-card" class="text-emerald-600"/> Payments (Stripe)</li>
              <li class="flex gap-2"><UIcon name="i-heroicons-envelope" class="text-emerald-600"/> Email & notifications</li>
              <li class="flex gap-2"><UIcon name="i-heroicons-document" class="text-emerald-600"/> CSV import/export</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Who it's for / Use cases -->
    <section class="py-16 border-t border-gray-100">
      <div class="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold">Built for independent landlords & small teams</h2>
          <ul class="mt-5 space-y-3 text-gray-700">
            <li class="flex gap-3"><UIcon name="i-heroicons-home-modern" class="text-emerald-600 mt-0.5"/> Single‑property owners who need simple rent tracking</li>
            <li class="flex gap-3"><UIcon name="i-heroicons-building-office" class="text-emerald-600 mt-0.5"/> Small portfolios (5–50 units) with recurring invoicing</li>
            <li class="flex gap-3"><UIcon name="i-heroicons-queue-list" class="text-emerald-600 mt-0.5"/> Teams that require an audit trail and clear roles</li>
          </ul>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <img src="https://picsum.photos/400/400?random=17" class="h-40 w-full object-cover rounded-xl border border-gray-200" alt="Small landlord"/>
          <img src="https://picsum.photos/400/400?random=18" class="h-40 w-full object-cover rounded-xl border border-gray-200" alt="Team workflow"/>
          <img src="https://picsum.photos/400/400?random=19" class="h-40 w-full object-cover rounded-xl border border-gray-200" alt="Invoices"/>
          <img src="https://picsum.photos/400/400?random=20" class="h-40 w-full object-cover rounded-xl border border-gray-200" alt="Payments"/>
        </div>
      </div>
    </section>

    <!-- Comparison section -->
    <section class="py-16" id="compare">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center">Why LeaseTrack beats spreadsheets</h2>
        <div class="mt-10 overflow-x-auto">
          <table class="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th class="text-left px-4 py-2">Capability</th>
                <th class="text-left px-4 py-2">Spreadsheets</th>
                <th class="text-left px-4 py-2">LeaseTrack</th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white/80 backdrop-blur border border-gray-200 rounded-xl">
                <td class="px-4 py-3">Automatic monthly invoices</td>
                <td class="px-4 py-3">Manual setup & error-prone</td>
                <td class="px-4 py-3">One click / scheduled per lease</td>
              </tr>
              <tr class="bg-white/80 backdrop-blur border border-gray-200 rounded-xl">
                <td class="px-4 py-3">Grace & late fees</td>
                <td class="px-4 py-3">Hard to manage dates</td>
                <td class="px-4 py-3">TZ-aware overdue + idempotent fees</td>
              </tr>
              <tr class="bg-white/80 backdrop-blur border border-gray-200 rounded-xl">
                <td class="px-4 py-3">Partial payments & credits</td>
                <td class="px-4 py-3">Complex formulas</td>
                <td class="px-4 py-3">Built-in FIFO + credit carry-forward</td>
              </tr>
              <tr class="bg-white/80 backdrop-blur border border-gray-200 rounded-xl">
                <td class="px-4 py-3">Audit trail</td>
                <td class="px-4 py-3">None</td>
                <td class="px-4 py-3">Automatic history & exports</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-16 border-t border-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center">What early users say</h2>
        <div class="mt-10 grid md:grid-cols-3 gap-6">
          <TestimonialCard name="Sadia R." role="Landlord, 6 units" quote="LeaseTrack cut my rent follow-up time in half. Invoices and late fees just work." avatar="/images/sample-avatar-1.jpg"/>
          <TestimonialCard name="Nafiz H." role="Property Manager" quote="The grace period logic and credits saved us from so many mistakes." avatar="/images/sample-avatar-2.jpg"/>
          <TestimonialCard name="Anika K." role="Owner, small portfolio" quote="Finally a tool that’s not overkill. Simple, fast, reliable." avatar="/images/sample-avatar-3.jpg"/>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how" class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center">Get started in 3 steps</h2>
        <div class="mt-10 grid md:grid-cols-3 gap-6">
          <StepCard step="1" title="Create or Activate a Lease" desc="Set rent, billing day, grace days, and deposit."/>
          <StepCard step="2" title="Generate Invoices Automatically" desc="Prevent duplicates per period. Proration handled."/>
          <StepCard step="3" title="Record Payments" desc="Apply partials, auto-create credits for overpay, watch status flip to paid."/>
        </div>
        <div class="mt-8 flex justify-center">
          <UButton color="emerald" size="lg" to="/signup" class="shadow-lg shadow-emerald-200 hover:shadow-emerald-300">Start Free</UButton>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center">Simple pricing for growing portfolios</h2>
        <p class="mt-3 text-center text-gray-600">All plans include secure hosting and backups. Cancel anytime.</p>
        <div class="mt-10 grid lg:grid-cols-3 gap-6">
          <PricingCard
            tier="Starter"
            price="৳0"
            period="/month"
            cta="Get Started"
            :features="[
              'Up to 2 units',
              'Unlimited leases & invoices',
              'Record payments & partials',
              'Portfolio timezone support',
              'Email support (48h)'
            ]"
          />
          <PricingCard
            highlight
            tier="Pro"
            price="৳990"
            period="/month"
            cta="Upgrade to Pro"
            :features="[
              'Up to 20 units',
              'Auto late fees & grace logic',
              'Credit/overpayment handling',
              'A/R aging & CSV export',
              'Priority email support (24h)'
            ]"
          />
          <PricingCard
            tier="Business"
            price="৳2,990"
            period="/month"
            cta="Talk to Sales"
            :features="[
              'Unlimited units',
              'Multi-portfolio roles & permissions',
              'Advanced reports & audit logs',
              'SLA support (8h)',
              'Early access features'
            ]"
          />
        </div>
      </div>
    </section>

    <!-- FAQ (expanded) -->
    <section id="faq" class="py-16 border-t border-gray-100">
      <div class="container mx-auto px-4 max-w-4xl">
        <h2 class="text-3xl md:text-4xl font-bold text-center">FAQ</h2>
        <div class="mt-8 grid md:grid-cols-2 gap-4">
          <UAccordion :items="faqItemsLeft" color="emerald" variant="soft"/>
          <UAccordion :items="faqItemsRight" color="emerald" variant="soft"/>
        </div>
      </div>
    </section>

    <!-- Final CTA (no footer) -->
    <section class="py-16">
      <div class="container mx-auto px-4 text-center">
        <h3 class="text-2xl md:text-3xl font-bold">Ready to replace spreadsheets?</h3>
        <p class="mt-2 text-gray-600">Create your first lease and send an invoice in minutes.</p>
        <div class="mt-6 flex justify-center gap-3">
          <UButton color="emerald" size="lg" to="/signup" class="shadow-lg shadow-emerald-200 hover:shadow-emerald-300">Get Started Free</UButton>
          <UButton variant="soft" color="gray" size="lg" to="/demo">See Live Demo</UButton>
        </div>
        <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <img src="https://picsum.photos/300/200?random=21" class="h-24 w-full object-cover rounded-lg border border-gray-200" alt="CTA sample 1"/>
          <img src="https://picsum.photos/300/200?random=22" class="h-24 w-full object-cover rounded-lg border border-gray-200" alt="CTA sample 2"/>
          <img src="https://picsum.photos/300/200?random=23" class="h-24 w-full object-cover rounded-lg border border-gray-200" alt="CTA sample 3"/>
          <img src="https://picsum.photos/300/200?random=24" class="h-24 w-full object-cover rounded-lg border border-gray-200" alt="CTA sample 4"/>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'

// Set layout
definePageMeta({
  layout: 'public'
})

// Local UI building blocks
const StatCard = defineComponent({
  name: 'StatCard',
  props: { value: String, label: String },
  template: `<div class='p-5 rounded-2xl bg-white/70 backdrop-blur border border-gray-200 shadow-sm'>
    <p class='text-2xl font-semibold'>{{ value }}</p>
    <p class='text-sm text-gray-600'>{{ label }}</p>
  </div>`
})

const FeatureCard = defineComponent({
  name: 'FeatureCard',
  props: { title: String, desc: String, icon: String },
  template: `<div class='group relative p-5 rounded-2xl bg-white/70 backdrop-blur border border-gray-200 shadow-sm hover:shadow-md transition'>
    <div class='absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition'></div>
    <div class='relative flex items-start gap-3'>
      <UIcon :name="icon" class='text-emerald-600 mt-1' />
      <div>
        <h3 class='font-semibold'>{{ title }}</h3>
        <p class='mt-1 text-sm text-gray-600'>{{ desc }}</p>
      </div>
    </div>
  </div>`
})

const StepCard = defineComponent({
  name: 'StepCard',
  props: { step: String, title: String, desc: String },
  template: `<div class='p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm'>
    <div class='w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold'>{{ step }}</div>
    <h3 class='mt-3 font-semibold'>{{ title }}</h3>
    <p class='mt-1 text-sm text-gray-600'>{{ desc }}</p>
  </div>`
})

const PricingCard = defineComponent({
  name: 'PricingCard',
  props: { tier: String, price: String, period: String, cta: String, features: Array, highlight: Boolean },
  template: `<div :class="['relative p-6 rounded-2xl border shadow-sm bg-white/80 backdrop-blur', highlight ? 'border-emerald-300 shadow-emerald-100 shadow-xl' : 'border-gray-200']">
    <div v-if="highlight" class='absolute -top-3 right-4 text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow'>Popular</div>
    <h3 class='text-lg font-semibold'>{{ tier }}</h3>
    <div class='mt-2 flex items-baseline gap-1'>
      <span class='text-3xl font-extrabold'>{{ price }}</span>
      <span class='text-gray-500'>{{ period }}</span>
    </div>
    <ul class='mt-4 space-y-2 text-sm text-gray-700'>
      <li v-for='(f,i) in features' :key='i' class='flex gap-2'><UIcon name='i-heroicons-check-circle' class='text-emerald-600 mt-0.5'/> {{ f }}</li>
    </ul>
    <div class='mt-5'>
      <UButton :color="highlight ? 'emerald' : 'gray'" :variant="highlight ? 'solid' : 'soft'" to='/signup'>{{ cta }}</UButton>
    </div>
  </div>`
})

const RoadmapCard = defineComponent({
  name: 'RoadmapCard',
  props: { title: String, desc: String },
  template: `<div class='p-6 rounded-2xl bg-white/70 backdrop-blur border border-dashed border-emerald-200/70'>
    <h3 class='font-semibold'>{{ title }}</h3>
    <p class='mt-1 text-sm text-gray-600'>{{ desc }}</p>
    <span class='mt-3 inline-flex text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200'>Coming soon</span>
  </div>`
})

const TestimonialCard = defineComponent({
  name: 'TestimonialCard',
  props: { name: String, role: String, quote: String, avatar: String },
  template: `<div class='p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm'>
    <div class='flex items-center gap-3'>
      <img :src="'https://picsum.photos/100/100?random=' + Math.floor(Math.random() * 1000)" class='h-10 w-10 rounded-full object-cover border border-gray-200' alt='avatar'/>
      <div>
        <p class='font-semibold'>{{ name }}</p>
        <p class='text-xs text-gray-500'>{{ role }}</p>
      </div>
    </div>
    <p class='mt-3 text-gray-700'>“{{ quote }}”</p>
  </div>`
})

const faqItemsLeft = [
  { label: 'Do I need a card to start?', content: 'No. Get started free—no credit card required.' },
  { label: 'Can I import existing leases?', content: 'Yes. Import via CSV or add manually; invoices generate per period.' },
  { label: 'Do you support partial payments and credits?', content: 'Absolutely. Apply partials, auto-create credits for overpayments, and carry forward.' }
]

const faqItemsRight = [
  { label: 'Which time zone is used?', content: 'All billing logic uses your Portfolio time zone for accurate due/overdue and grace calculations.' },
  { label: 'Can I manage multiple portfolios?', content: 'Yes. Assign roles per portfolio and keep data completely isolated.' },
  { label: 'What about receipts?', content: 'Receipts PDF is on the roadmap; payments are recorded and visible now.' }
]
</script>

<script lang="ts">
export default {
  head: {
    title: 'LeaseTrack — Smart Property Management Made Easy for Small Landlords',
    meta: [
      { name: 'description', content: 'Manage leases, auto-generate rent invoices, track payments and late fees. Built for small landlords. Free to start.' }
    ]
  }
}
</script>

<style scoped>
@keyframes float { 0%{transform:translateY(0)} 50%{transform:translateY(-6px)} 100%{transform:translateY(0)} }
.animate-float { animation: float 5s ease-in-out infinite; }
@keyframes slow-float { 0%{transform:translateY(0)} 50%{transform:translateY(-18px)} 100%{transform:translateY(0)} }
.animate-slow-float { animation: slow-float 12s ease-in-out infinite; }
.animate-slow-float-rev { animation: slow-float 14s ease-in-out infinite reverse; }
</style>

<!-- SAMPLE IMAGE ASSETS TO PREPARE/REPLACE LATER
Hero:
- /images/sample-hero-1.jpg
- /images/sample-hero-2.jpg
- /images/sample-hero-3.jpg
Logos:
- /images/sample-logo-1.png ... /images/sample-logo-6.png
Problem/Solution:
- /images/sample-problem-1.jpg
- /images/sample-solution-1.jpg
Use Cases:
- /images/sample-usecase-1.jpg ... /images/sample-usecase-4.jpg
Testimonials:
- /images/sample-avatar-1.jpg ... /images/sample-avatar-3.jpg
CTA:
- /images/sample-cta-1.jpg ... /images/sample-cta-4.jpg
Core product:
- /images/hero-dashboard-mockup.png
- /images/invoice-preview-a4.png
- /images/money-flow-diagram.png
- /images/invoice-inline-edit.png
- /images/lease-header-grace.png
-->
