<template>
  <section class="py-8 sm:py-12 md:py-16 lg:py-20 border-t border-gray-100" id="problem">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="grid lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center">
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
                  src="/management-messy-spreadsheet.jpg" 
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
          <div class="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-50 w-full max-w-[400px] mx-auto aspect-[9/13]">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-primary-100/20 z-10 mix-blend-multiply"></div>
            <div class="relative w-full h-full">
              <video 
                class="w-full h-full object-contain" 
                autoplay 
                loop 
                muted 
                playsinline
                preload="metadata"
                aria-label="LeaseDirector workflow demonstration"
              >
                <source src="/money-flow-diagram.mp4" type="video/mp4" />
                <track
                  src="/captions/money-flow-captions.vtt"
                  kind="captions"
                  srclang="en"
                  label="English"
                  default
                >
                Your browser does not support the video tag or the captions.
              </video>
              <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center text-xs py-1 px-2">
                <button onclick="this.closest('video').muted = !this.closest('video').muted" class="mr-2 focus:outline-none">
                  <span class="sr-only">Toggle mute</span>
                  <UIcon name="i-heroicons-speaker-wave" class="w-4 h-4 inline-block" />
                </button>
                <span>Video: Property Management Workflow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
