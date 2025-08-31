<template>
  <section class="container mx-auto px-4 pt-16 md:pt-24">
    <div class="grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <span class="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-700 font-semibold bg-emerald-50 rounded-full px-3 py-1 shadow-sm ring-1 ring-emerald-200/60">
          LeaseTrack · Smart Property Management
        </span>

        <h1 class="mt-5 text-4xl md:text-6xl font-extrabold leading-tight">
          Manage leases, send invoices,
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">get paid—fast.</span>
        </h1>

        <p class="mt-4 text-gray-700 text-lg md:text-xl max-w-xl">
          <strong>LeaseTrack</strong> — <em>Smart Property Management Made Easy for Small Landlords</em>.
          Create leases, auto-generate monthly invoices, track payments and late fees, all in your portfolio time zone.
        </p>

        <div class="mt-7 flex flex-col sm:flex-row gap-3">
          <UButton color="emerald" size="lg" to="/auth/register" class="shadow-lg shadow-emerald-200 hover:shadow-emerald-300">
            Get Started Free
          </UButton>
          <UButton variant="soft" color="gray" size="lg" to="/demo">See Live Demo</UButton>
        </div>
        <p class="mt-3 text-xs text-gray-500">No credit card required · 1-minute signup · Works on mobile</p>

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
