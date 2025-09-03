<template>
  <div class="relative min-h-screen bg-white text-gray-900 overflow-hidden">
    <!-- Decorative animated background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-300/40 blur-3xl rounded-full animate-slow-float"></div>
      <div class="absolute top-40 -right-24 w-[28rem] h-[28rem] bg-teal-200/40 blur-3xl rounded-full animate-slow-float-rev"></div>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-primary-100/60 blur-3xl rounded-full"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-primary-50/60 via-white to-white"></div>
    </div>

    <HeroSection />

    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="grid sm:grid-cols-3 gap-6 text-center">
          <StatCard value="99.9%" label="Uptime on secure cloud" />
          <StatCard value="Portfolio TZ" label="Accurate due & overdue" />
          <StatCard value="Minutes" label="From lease to first invoice" />
        </div>
        <LogoCloud class="mt-8 opacity-70" />
      </div>
    </section>

    <ProblemSolution />

    <FeatureGrid />

    <SecurityIntegrations />

    <AudienceSection />

    <ComparisonTable />

    <TestimonialGrid />

    <StepsSection />

    <PricingTeaserGrid />

    <FinalCta />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

import HeroSection from '~/components/home/HeroSection.vue'
import ProblemSolution from '~/components/home/ProblemSolution.vue'
import FeatureGrid from '~/components/home/FeatureGrid.vue'
import SecurityIntegrations from '~/components/home/SecurityIntegrations.vue'
import AudienceSection from '~/components/home/AudienceSection.vue'
import ComparisonTable from '~/components/home/ComparisonTable.vue'
import TestimonialGrid from '~/components/home/TestimonialGrid.vue'
import StepsSection from '~/components/home/StepsSection.vue'
import PricingTeaserGrid from '~/components/home/PricingTeaserGrid.vue'
import FinalCta from '~/components/home/FinalCta.vue'
import LogoCloud from '~/components/home/LogoCloud.vue'
import StatCard from '~/components/home/StatCard.vue'

definePageMeta({ layout: 'public' })

useHead({
  title: 'LeaseTrack — Smart Property Management Made Easy for Small Landlords',
  meta: [
    { name: 'description', content: 'Manage leases, auto-generate rent invoices, track payments and late fees. Built for small landlords. Free to start.' }
  ]
})
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
