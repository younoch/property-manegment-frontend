<!-- File: pages/about.vue -->
<template>
  <div class="min-h-screen bg-white text-gray-900 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/40 blur-3xl rounded-full animate-slow-float"></div>
      <div class="absolute top-40 -right-24 w-[28rem] h-[28rem] bg-teal-200/40 blur-3xl rounded-full animate-slow-float-rev"></div>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-emerald-100/60 blur-3xl rounded-full"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-white to-white"></div>
    </div>

    <!-- HERO (no site header) -->
    <section class="container mx-auto px-4 pt-16 md:pt-24">
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span class="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-700 font-semibold bg-emerald-50 rounded-full px-3 py-1 shadow-sm ring-1 ring-emerald-200/60">About LeaseTrack</span>
          <h1 class="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
            Built for small landlords.
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Obsessed with accuracy.</span>
          </h1>
          <p class="mt-4 text-gray-700 text-lg md:text-xl max-w-xl">
            We created <strong>LeaseTrack</strong> to make rent operations simple, reliable, and audit‑friendly. No bloated features. Just the right workflows—leases, invoices, and payments—done right.
          </p>
        </div>
        <div class="relative">
          <div class="rounded-2xl border border-gray-200/70 shadow-xl overflow-hidden bg-white/70 backdrop-blur">
            <img src="https://picsum.photos/800/500?random=1" alt="Our team at work" class="w-full h-auto object-cover">
          </div>
          <div class="hidden md:block absolute -bottom-6 -right-6 w-64 rounded-xl border border-gray-200 shadow-md bg-white/80 p-3 animate-float">
            <img src="https://picsum.photos/500/300?random=2" alt="Product preview" class="rounded-md w-full h-auto object-cover">
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-16">
      <div class="container mx-auto px-4 grid md:grid-cols-2 gap-6">
        <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
          <h2 class="text-2xl font-bold">Our mission</h2>
          <p class="mt-3 text-gray-700">Empower independent landlords and small property teams with a tool that keeps cash flow predictable and records spotless—without the complexity of enterprise systems.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
          <h2 class="text-2xl font-bold">Our product belief</h2>
          <p class="mt-3 text-gray-700">Performance matters, precision matters, and defaults matter. Portfolio‑timezone billing, idempotent late fees, and clean credits are not extras—they’re table stakes.</p>
        </div>
      </div>
    </section>

    <!-- Story timeline -->
    <section class="py-16 border-t border-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center">Our story</h2>
        <div class="mt-10 max-w-3xl mx-auto">
          <ol class="relative border-s-2 border-emerald-100">
            <li class="mb-10 ms-6">
              <span class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">1</span>
              <h3 class="font-semibold">Frustration with spreadsheets</h3>
              <p class="text-gray-600 text-sm mt-1">We managed a handful of units and saw the same issues: duplicate invoices, missed grace windows, messy partial payments.</p>
            </li>
            <li class="mb-10 ms-6">
              <span class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">2</span>
              <h3 class="font-semibold">An MVP focused on the money flow</h3>
              <p class="text-gray-600 text-sm mt-1">Lease → Invoice → Payment. We shipped the core with proration, partials, credits, and TZ‑aware overdue logic.</p>
            </li>
            <li class="ms-6">
              <span class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">3</span>
              <h3 class="font-semibold">Growing with users</h3>
              <p class="text-gray-600 text-sm mt-1">Now we’re adding receipts, a tenant portal, and deeper reporting—guided by real landlord workflows.</p>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center">What we value</h2>
        <div class="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ValueCard icon="i-heroicons-check-badge" title="Accuracy first" desc="2‑decimal rounding, idempotent jobs, and clear audit trails."/>
          <ValueCard icon="i-heroicons-bolt" title="Speed with safety" desc="Fast UI, transactional back‑end updates, and predictable outcomes."/>
          <ValueCard icon="i-heroicons-user-group" title="Small‑team empathy" desc="Designed for independent owners and lean property teams."/>
          <ValueCard icon="i-heroicons-shield-check" title="Trust by default" desc="Read‑only terminal states; reversal via counter‑entries only."/>
          <ValueCard icon="i-heroicons-globe-alt" title="Timezone clarity" desc="Portfolio‑level timezone for consistent billing and reporting."/>
          <ValueCard icon="i-heroicons-sparkles" title="Delight in details" desc="Clear labels, helpful toasts, and printable A4 views."/>
        </div>
      </div>
    </section>

    <!-- Team grid -->
    <section class="py-16 border-t border-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center">Team</h2>
        <p class="mt-2 text-center text-gray-600">A small team shipping quickly, listening constantly.</p>
        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TeamCard name="MD. Radwan Hossain" role="Founder & Engineer" img="https://picsum.photos/300/300?random=3" bio="Backend & product—loves clean APIs and idempotent billing."/>
          <TeamCard name="Sample Teammate" role="Frontend Engineer" img="https://picsum.photos/300/300?random=4" bio="Nuxt UI & delightful UX—turns flows into pixels."/>
          <TeamCard name="Sample Teammate" role="Customer Success" img="https://picsum.photos/300/300?random=5" bio="Helps landlords onboard smoothly and stay happy."/>
        </div>
      </div>
    </section>

    <!-- How we build -->
    <section class="py-16">
      <div class="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
        <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
          <h2 class="text-2xl font-bold">How we build</h2>
          <ul class="mt-3 space-y-2 text-gray-700 text-sm">
            <li class="flex gap-2"><UIcon name="i-heroicons-rocket-launch" class="text-emerald-600"/> Ship weekly, with small, reversible changes.</li>
            <li class="flex gap-2"><UIcon name="i-heroicons-queue-list" class="text-emerald-600"/> Document policies (overdue, late fees, credits) as code & guides.</li>
            <li class="flex gap-2"><UIcon name="i-heroicons-wrench" class="text-emerald-600"/> Measure twice—migrations and money math are atomic.</li>
          </ul>
        </div>
        <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white/70 backdrop-blur">
          <img src="https://picsum.photos/500/300?random=14" alt="Build process" class="w-full h-auto object-cover"/>
        </div>
      </div>
    </section>

    <!-- Tech stack (fun section) -->
    <section class="py-16 border-t border-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center">Under the hood</h2>
        <div class="mt-10 grid md:grid-cols-3 gap-6">
          <StackCard title="Frontend" items="Nuxt 3 · Nuxt UI · Tailwind CSS"/>
          <StackCard title="Backend" items="NestJS · TypeORM · PostgreSQL · Docker"/>
          <StackCard title="Infra" items="Render · CI/CD · Backups & Monitoring"/>
        </div>
      </div>
    </section>

    <!-- Press / badges (placeholder) -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid sm:grid-cols-3 gap-6 items-center text-center opacity-80">
          <img src="https://picsum.photos/500/300?random=10" alt="Badge 1" class="h-10 mx-auto object-contain"/>
          <img src="https://picsum.photos/500/300?random=11" alt="Badge 2" class="h-10 mx-auto object-contain"/>
          <img src="https://picsum.photos/500/300?random=12" alt="Badge 3" class="h-10 mx-auto object-contain"/>
        </div>
      </div>
    </section>

    <!-- Careers / contact strip -->
    <section class="py-16 border-t border-gray-100">
      <div class="container mx-auto px-4 grid lg:grid-cols-2 gap-6 items-center">
        <div>
          <h2 class="text-3xl font-bold">Want to help landlords run smarter?</h2>
          <p class="mt-2 text-gray-600">We’re always curious to meet builders and customer champions. Even if there isn’t an open role listed, reach out.</p>
          <div class="mt-5 flex gap-3">
            <UButton color="emerald" to="/contact">Contact us</UButton>
            <UButton variant="soft" color="gray" to="/careers">View roles</UButton>
          </div>
        </div>
        <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white/70 backdrop-blur">
          <img src="https://picsum.photos/500/300?random=13" alt="Careers" class="w-full h-auto object-cover"/>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-16">
      <div class="container mx-auto px-4 text-center">
        <h3 class="text-2xl md:text-3xl font-bold">Join LeaseTrack</h3>
        <p class="mt-2 text-gray-600">Start free, send your first invoice in minutes, and keep your records clean.</p>
        <div class="mt-6 flex justify-center gap-3">
          <UButton color="emerald" size="lg" to="/signup" class="shadow-lg shadow-emerald-200 hover:shadow-emerald-300">Get Started Free</UButton>
          <UButton variant="soft" color="gray" size="lg" to="/demo">See Live Demo</UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'

const ValueCard = defineComponent({
  name: 'ValueCard',
  props: { icon: String, title: String, desc: String },
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

const TeamCard = defineComponent({
  name: 'TeamCard',
  props: { name: String, role: String, img: String, bio: String },
  template: `<div class='p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm'>
    <img :src="img" class='w-full h-44 object-cover rounded-xl border border-gray-200' alt='team'/>
    <h3 class='mt-3 font-semibold'>{{ name }}</h3>
    <p class='text-xs text-gray-500'>{{ role }}</p>
    <p class='mt-2 text-sm text-gray-700'>{{ bio }}</p>
  </div>`
})

const StackCard = defineComponent({
  name: 'StackCard',
  props: { title: String, items: String },
  template: `<div class='p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm'>
    <h3 class='font-semibold'>{{ title }}</h3>
    <p class='mt-2 text-sm text-gray-700'>{{ items }}</p>
  </div>`
})
</script>

<script lang="ts">
export default {
  head: {
    title: 'About LeaseTrack — Smart Property Management for Small Landlords',
    meta: [
      { name: 'description', content: 'LeaseTrack is built for independent landlords and small property teams. Learn our mission, values, team, and how we build.' }
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

<!-- SAMPLE IMAGE ASSETS TO PREPARE/REPLACE LATER (About page)
/ images/about/hero-team.jpg
/ images/about/hero-product.jpg
/ images/about/how-we-build.jpg
/ images/about/careers.jpg
/ images/about/team-1.jpg
/ images/about/team-2.jpg
/ images/about/team-3.jpg
/ images/about/badge-1.png
/ images/about/badge-2.png
/ images/about/badge-3.png
-->