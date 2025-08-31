<template>
  <section id="features" class="py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center">Everything you need to run rentals</h2>
      <p class="mt-3 text-center text-gray-600">Built for small landlords: fast, accurate, and audit-friendly.</p>

      <div class="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard title="Smart Invoicing" desc="Monthly rent, prorations, deposits on activation, late fees when due." icon="i-heroicons-document-text"/>
        <FeatureCard title="Payment Tracking" desc="Partial payments, FIFO application, credit carry-forward." icon="i-heroicons-banknotes"/>
        <FeatureCard title="Time-Zone Aware" desc="Portfolio-level TZ for due/overdue accuracy." icon="i-heroicons-clock"/>
        <FeatureCard title="Multi-Tenant Leases" desc="Primary + additional tenants under one lease." icon="i-heroicons-user-group"/>
        <FeatureCard title="Role-Based Access" desc="Owner, Manager, Accountant, Read-only permissions." icon="i-heroicons-lock-closed"/>
        <FeatureCard title="Audit & Exports" desc="Immutable paid/void, CSV exports, clean history." icon="i-heroicons-arrow-down-tray"/>
      </div>

      <div class="mt-10 grid lg:grid-cols-2 gap-6">
        <img src="https://picsum.photos/800/600?random=15" alt="Invoice Items Inline Edit" class="rounded-xl border border-gray-200 shadow-sm w-full h-auto"/>
        <img src="https://picsum.photos/800/600?random=16" alt="Lease Header with Grace Deadline" class="rounded-xl border border-gray-200 shadow-sm w-full h-auto"/>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import FeatureCard from '@/components/home/FeatureCard.vue'
</script>
