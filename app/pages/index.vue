<template>
  <div class="relative min-h-screen bg-white text-gray-900 overflow-x-hidden">
    <!-- Decorative animated background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-12 sm:-top-24 -left-12 sm:-left-24 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary-300/40 blur-2xl sm:blur-3xl rounded-full animate-slow-float"></div>
      <div class="absolute top-20 sm:top-40 -right-12 sm:-right-24 w-64 sm:w-[28rem] h-64 sm:h-[28rem] bg-teal-200/40 blur-2xl sm:blur-3xl rounded-full animate-slow-float-rev"></div>
      <div class="absolute -bottom-24 sm:bottom-0 left-1/2 -translate-x-1/2 w-72 sm:w-[32rem] md:w-[42rem] h-72 sm:h-[32rem] md:h-[42rem] bg-primary-100/60 blur-2xl sm:blur-3xl rounded-full"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-primary-50/60 via-white to-white"></div>
    </div>

    <div class="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24">
      <HeroSection />

      <section class="py-4 md:py-8 bg-white/50 backdrop-blur-sm mb-4 md:mb-12">
        <div class="container mx-auto px-4 sm:px-6">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">Why Property Managers Choose Us</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard 
              value="99.9%" 
              label="System Uptime"
            />
            <StatCard 
              value="24/7" 
              label="Support Available"
            />
            <StatCard 
              value="<5 Min" 
              label="Lease to Invoice"
            />
            <StatCard 
              value="1000+" 
              label="Properties Managed"
            />
            <StatCard 
              value="Auto" 
              label="Rent Collection"
            />
            <StatCard 
              value="Real-time" 
              label="Financial Reports"
            />
            <StatCard 
              value="Cloud" 
              label="Document Storage"
            />
            <StatCard 
              value="95%" 
              label="Tenant Satisfaction"
            />
          </div>
        </div>
      </section>

      <ProblemSolution class=" md:py-16 md:mb-12" />

      <FeatureGrid class=" md:py-16 mb-4 md:mb-12" />

      <SecurityIntegrations class=" md:py-16 mb-4 md:mb-12" />

      <AudienceSection class=" md:py-16 mb-4 md:mb-12" />

      <ComparisonTable class=" md:py-16 mb-4 md:mb-12" />

      <TestimonialGrid class=" md:py-16 mb-4 md:mb-12" />

      <StepsSection class=" md:py-16 mb-4 md:mb-12" />

      <FinalCta class="py-12 sm:py-16 md:py-20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead, useRuntimeConfig, useRequestURL } from '#imports'

import HeroSection from '~/components/home/HeroSection.vue'
import ProblemSolution from '~/components/home/ProblemSolution.vue'
import FeatureGrid from '~/components/home/FeatureGrid.vue'
import SecurityIntegrations from '~/components/home/SecurityIntegrations.vue'
import AudienceSection from '~/components/home/AudienceSection.vue'
import ComparisonTable from '~/components/home/ComparisonTable.vue'
import TestimonialGrid from '~/components/home/TestimonialGrid.vue'
import StepsSection from '~/components/home/StepsSection.vue'
import FinalCta from '~/components/home/FinalCta.vue'
import LogoCloud from '~/components/home/LogoCloud.vue'
import StatCard from '~/components/home/StatCard.vue'

definePageMeta({ layout: 'public' })

// SEO: compute site/canonical URL from runtime config when available
const runtimePublic = useRuntimeConfig().public as Record<string, any>
const frontendDomain = (runtimePublic.frontendDomain || '')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '')
const siteUrl = frontendDomain ? `https://${frontendDomain}` : undefined

const reqUrl = process.server ? useRequestURL() : null
const currentPath = reqUrl ? reqUrl.pathname : '/'
const canonicalUrl = siteUrl ? `${siteUrl}${currentPath}` : undefined

const title = 'LeaseDirector | Property Management for Small Landlords'
const description = 'Property management software for small landlords: manage leases, invoice automation track payments & maintenance, communicate with tenants — free to start.'
const ogImage = runtimePublic.ogImage || runtimePublic.ogImageUrl || '/og-image.jpg'

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    canonicalUrl ? { property: 'og:url', content: canonicalUrl } : undefined,
    ogImage ? { property: 'og:image', content: ogImage } : undefined,
    // Twitter
    { name: 'twitter:card', content: ogImage ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    ogImage ? { name: 'twitter:image', content: ogImage } : undefined,
  ].filter(Boolean) as any,
  link: canonicalUrl ? [{ rel: 'canonical', href: canonicalUrl }] : [],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'LeaseDirector',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: canonicalUrl || undefined,
        description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          category: 'FreeTrial'
        }
      })
    }
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
