<template>
  <section class="py-16">
    <div class="container mx-auto px-4 grid md:grid-cols-2 gap-6">
      <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
        <h3 class="font-semibold text-lg">Security & Reliability</h3>
        <ul class="mt-3 space-y-2 text-sm text-gray-700">
          <li class="flex gap-2"><UIcon name="i-heroicons-shield-check" class="text-primary-600"/> Encrypted in transit (HTTPS) & daily backups</li>
          <li class="flex gap-2"><UIcon name="i-heroicons-bolt" class="text-primary-600"/> 99.9% uptime, auto-retries & idempotent ops</li>
          <li class="flex gap-2"><UIcon name="i-heroicons-lock-closed" class="text-primary-600"/> Role-based access control per portfolio</li>
        </ul>
      </div>
      <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
        <h3 class="font-semibold text-lg">Integrations (Roadmap)</h3>
        <ul class="mt-3 space-y-2 text-sm text-gray-700">
          <li class="flex gap-2"><UIcon name="i-heroicons-credit-card" class="text-primary-600"/> Payments (Stripe)</li>
          <li class="flex gap-2"><UIcon name="i-heroicons-envelope" class="text-primary-600"/> Email & notifications</li>
          <li class="flex gap-2"><UIcon name="i-heroicons-document" class="text-primary-600"/> CSV import/export</li>
        </ul>
      </div>
    </div>
  </section>
</template>
