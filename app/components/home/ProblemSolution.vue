<template>
  <section class="py-4 md:py-16 border-t border-gray-100" id="problem">
    <div class="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="text-3xl md:text-4xl font-bold">Spreadsheets cause missed payments. We fix that.</h2>
        <p class="mt-3 text-gray-600">
          A simple flow: <span class="font-medium">Unit → Lease → Invoice → Payment</span> with automatic status updates, grace periods, and idempotent late fees.
        </p>
        <ul class="mt-6 space-y-3 text-gray-700">
          <li class="flex gap-3"><UIcon name="i-heroicons-check-circle" class="text-primary-600 mt-0.5"/> Auto-generate monthly rent invoices (with proration)</li>
          <li class="flex gap-3"><UIcon name="i-heroicons-check-circle" class="text-primary-600 mt-0.5"/> One-click payment recording + partials + credits</li>
          <li class="flex gap-3"><UIcon name="i-heroicons-check-circle" class="text-primary-600 mt-0.5"/> Grace-aware overdue & idempotent late fees</li>
          <li class="flex gap-3"><UIcon name="i-heroicons-check-circle" class="text-primary-600 mt-0.5"/> Immutable paid/void invoices with full audit trail</li>
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
</template>
