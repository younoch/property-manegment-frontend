<template>
  <section class="py-8 sm:py-12 md:py-16 lg:py-20 border-t border-gray-100" id="problem">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="grid lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center">
        <div class="space-y-2 sm:space-y-5">
          <h2 class="text-2xl sm:text-3xl md:text-4xl xl:text-[2.5rem] font-bold leading-tight text-center sm:text-left">
            Spreadsheets cause missed payments.<br class="hidden sm:block">
            <span class="text-primary-600">We fix that.</span>
          </h2>
          
          <p class="text-base sm:text-lg text-gray-600 leading-relaxed text-center sm:text-left">
            A simple flow: <span class="font-medium text-gray-800">Unit → Lease → Invoice → Payment</span> with automatic status updates, grace periods, and idempotent late fees.
          </p>
          
          <ul class="space-y-2.5 sm:space-y-3 text-gray-700">
            <li class="flex items-start gap-3">
              <UIcon name="i-heroicons-check-circle" class="flex-shrink-0 text-primary-600 mt-0.5"/>
              <span>Auto-generate monthly rent invoices (with proration)</span>
            </li>
            <li class="flex items-start gap-3">
              <UIcon name="i-heroicons-check-circle" class="flex-shrink-0 text-primary-600 mt-0.5"/>
              <span>One-click payment recording + partials + credits</span>
            </li>
            <li class="flex items-start gap-3">
              <UIcon name="i-heroicons-check-circle" class="flex-shrink-0 text-primary-600 mt-0.5"/>
              <span>Grace-aware overdue & idempotent late fees</span>
            </li>
            <li class="flex items-start gap-3">
              <UIcon name="i-heroicons-check-circle" class="flex-shrink-0 text-primary-600 mt-0.5"/>
              <span>Immutable paid/void invoices with full audit trail</span>
            </li>
          </ul>

          <div class="pt-2">
            <div class="grid grid-cols-2 gap-3 sm:gap-4 max-w-md">
              <div class="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img 
                  src="https://picsum.photos/300/200?random=12" 
                  class="absolute inset-0 w-full h-full object-cover" 
                  alt="Messy spreadsheets"
                  loading="lazy"
                />
              </div>
              <div class="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img 
                  src="https://picsum.photos/300/200?random=13" 
                  class="absolute inset-0 w-full h-full object-cover" 
                  alt="Clean dashboard"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 lg:mt-0">
          <div class="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            <img 
              src="https://picsum.photos/800/500?random=14" 
              alt="Money Flow Diagram" 
              class="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
