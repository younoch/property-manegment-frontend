<template>
  <section id="how" class="py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center">Get started in 3 steps</h2>
      <div class="mt-10 grid md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
          <div class="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">1</div>
          <h3 class="mt-3 font-semibold">Create or Activate a Lease</h3>
          <p class="mt-1 text-sm text-gray-600">Set rent, billing day, grace days, and deposit.</p>
        </div>

        <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
          <div class="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">2</div>
          <h3 class="mt-3 font-semibold">Generate Invoices Automatically</h3>
          <p class="mt-1 text-sm text-gray-600">Prevent duplicates per period. Proration handled.</p>
        </div>

        <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
          <div class="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">3</div>
          <h3 class="mt-3 font-semibold">Record Payments</h3>
          <p class="mt-1 text-sm text-gray-600">Apply partials, auto-create credits for overpay, watch status flip to paid.</p>
        </div>
      </div>

      <div class="mt-8 flex justify-center">
        <UButton color="primary" size="lg" to="/auth/signup" class="shadow-lg shadow-primary-200 hover:shadow-primary-300">
          Start Your Free Trial
        </UButton>
      </div>
    </div>
  </section>
</template>
