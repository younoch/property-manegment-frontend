<template>
  <section class="container mx-auto px-4 pt-2 md:pt-20 mb-2 md:mb-20">
    <div class="grid lg:grid-cols-2 gap-3 md:gap-10 items-center">
      <div>
        <span class="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-primary-700 font-semibold bg-primary-50 rounded-full px-3 py-1 shadow-sm ring-1 ring-primary-200/60">
          LeaseTrack · Smart Property Management
        </span>

        <h1 class="mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight md:leading-tight text-center sm:text-left">
          Manage leases, send invoices,
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-teal-600">manage payments—fast.</span>
        </h1>

        <p class="mt-4 text-gray-700 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed text-center sm:text-left">
          <strong>LeaseTrack</strong> — <em>Smart Property Management Made Easy for Small Landlords</em>.
          Create leases, auto-generate monthly invoices, track payments and late fees, all in your portfolio time zone.
        </p>

        <div class="mt-7 flex flex-col sm:flex-row gap-3">
          <UButton color="primary" size="lg" to="/auth/register" class=" justify-center items-center shadow-lg shadow-primary-200 hover:shadow-primary-300">
            Get Started Free
          </UButton>
          <!-- <UButton class="justify-center items-center" variant="outline" color="primary" size="lg" to="/demo">See Live Demo</UButton> -->
        </div>
        <p class="mt-3 text-xs sm:text-sm text-gray-600">No credit card required · 1-minute signup · Works on mobile</p>

        <div class="mt-6 grid grid-cols-3 gap-3 max-w-md">
          <img src="https://picsum.photos/200/300?random=1" alt="Sample building" class="h-24 w-full object-cover rounded-xl border border-gray-200"/>
          <img src="https://picsum.photos/200/300?random=2" alt="Sample dashboard" class="h-24 w-full object-cover rounded-xl border border-gray-200"/>
          <img src="https://picsum.photos/200/300?random=3" alt="Landlord workspace" class="h-24 w-full object-cover rounded-xl border border-gray-200"/>
        </div>
      </div>

      <div class="relative">
        <div class="rounded-2xl border border-gray-200/70 shadow-xl overflow-hidden bg-white/70 backdrop-blur">
          <img src="https://picsum.photos/800/600?random=4" alt="Hero Dashboard Mockup" class="w-full h-auto">
        </div>
        <div class="hidden md:block absolute -bottom-6 -right-6 w-64 rounded-xl border border-gray-200 shadow-md bg-white/80 p-3 animate-float">
          <img src="https://picsum.photos/400/600?random=5" alt="Invoice Preview A4" class="rounded-md w-full h-auto">
        </div>
      </div>
    </div>
  </section>
</template>
