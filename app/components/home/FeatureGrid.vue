<template>
  <section id="features" class="py-4 md:py-16">
    <div class="container mx-auto px-4">
      <header class="text-center" aria-labelledby="features-heading">
        <h2 id="features-heading" class="text-3xl md:text-4xl font-bold">Everything you need to run rentals</h2>
        <p class="mt-3 text-gray-600">Built for small landlords: fast, accurate, and audit-friendly.</p>
      </header>

      <div role="list" class="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard title="Smart Invoicing" desc="Monthly rent, prorations, deposits on activation, late fees when due." icon="i-heroicons-document-text"/>
        <FeatureCard title="Payment Tracking" desc="Partial payments, FIFO application, credit carry-forward." icon="i-heroicons-banknotes"/>
        <FeatureCard title="Time-Zone Aware" desc="Portfolio-level TZ for due/overdue accuracy." icon="i-heroicons-clock"/>
        <FeatureCard title="Multi-Tenant Leases" desc="Primary + additional tenants under one lease." icon="i-heroicons-user-group"/>
        <FeatureCard title="Role-Based Access" desc="Owner, Manager, Accountant, Read-only permissions." icon="i-heroicons-lock-closed"/>
        <FeatureCard title="Audit & Exports" desc="Immutable paid/void, CSV exports, clean history." icon="i-heroicons-arrow-down-tray"/>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import FeatureCard from '~/components/home/FeatureCard.vue'
</script>
