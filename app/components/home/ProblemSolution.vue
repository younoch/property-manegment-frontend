<template>
  <section class="py-8 sm:py-12 md:py-16 lg:py-20 border-t border-gray-100 mb-4 md:mb-12" id="problem">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-2 lg:gap-8 items-stretch relative lg:min-h-[600px]">
        <div class="space-y-2 sm:space-y-5">
          <header class="space-y-2" aria-labelledby="problem-solution-heading">
            <h2 id="problem-solution-heading" class="text-2xl sm:text-3xl md:text-4xl xl:text-[2.5rem] font-bold leading-tight text-center sm:text-left">
              Spreadsheets cause missed payments.<br class="hidden sm:block">
              <span class="text-primary-600">We fix that.</span>
            </h2>
            
            <p class="text-base sm:text-lg text-gray-600 leading-relaxed text-center sm:text-left">
              A simple flow: <span class="font-medium text-gray-800">Unit → Lease → Invoice → Payment</span> with automatic status updates, grace periods, and idempotent late fees.
            </p>
          </header>
          
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
                  src="/management-messy-spreadsheet.webp"
                  alt="Messy spreadsheets with property data"
                  width="400"
                  :height="300"
                  sizes="(max-width: 640px) 45vw, 200px"
                  class="w-full h-full object-cover"
                  format="webp"
                />
              </div>
              <div class="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=870"
                  alt="Clean dashboard"
                  :width="400"
                  :height="300"
                  sizes="(max-width: 640px) 45vw, 200px"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 lg:mt-0 lg:flex lg:items-center lg:justify-center">
          <div class="relative w-full max-w-[600px] mx-auto">
            <div class="relative bg-white p-4 rounded-2xl shadow-lg">
              <img 
                src="/LeaseDirector-workflow-demonstration.png" 
                alt="LeaseDirector workflow demonstration"
                class="max-w-full h-auto object-contain mx-auto"
                width="1200"
                height="800"
              />
              <div class="absolute inset-0 bg-gradient-to-br from-primary-50/20 to-primary-100/10 z-10 mix-blend-multiply rounded-2xl pointer-events-none"></div>
              <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center text-xs py-1 px-2 rounded-b-2xl lg:rounded-bl-none">
                <span>Property Management Workflow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
