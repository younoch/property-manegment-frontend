<template>
  <section class="container mx-auto px-4 pt-2 md:pt-20 mb-2 md:mb-20">
    <div class="grid lg:grid-cols-2 gap-3 md:gap-10 items-center">
      <div>
        <h1 class="inline-flex text-center md:text-left items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-primary-700 font-semibold bg-primary-50 rounded-full px-3 py-1 shadow-sm ring-1 ring-primary-200/60">
          LeaseDirector · Smart Property Management Software
        </h1>

        <h2  class="mt-3 md:mt-5 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight md:leading-tight text-center sm:text-left">
          Property Management Software 
          <br />
          for
          
          <span class="bg-clip-text text-[120%] text-transparent bg-gradient-to-r from-primary-600 to-teal-600 leading-loose">Small Landlords</span>
        </h2>

        <p class="mt-4 text-gray-700 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed text-center sm:text-left">
          <strong>LeaseDirector</strong> makes it easy to manage leases, send invoices, and track payments—all in one place.
          Automate rent collection, generate professional invoices, and get paid on time, every time.
        </p>

        <div class="mt-7 flex flex-col sm:flex-row gap-3">
          <UButton color="primary" size="lg" to="/auth/signup" class="justify-center items-center bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200 hover:shadow-primary-300">
            Get Started Free
          </UButton>
        </div>
        <p class="mt-3 text-xs sm:text-sm text-gray-600">No credit card required · 1-minute signup · Works on mobile</p>

        <div class="mt-6 grid grid-cols-3 gap-3 max-w-md" role="list" aria-label="Sample property images">
          <img src="/apartment-building-preview.jpg" alt="apartment building" class="h-24 w-full object-cover rounded-xl border border-gray-200"/>
          <img src="/agreement-deal.jpg" alt="agreement eal" class="h-24 w-full object-cover rounded-xl border border-gray-200"/>
          <img src="/whatsapp-notification.jpg" alt="WhatsApp notification" class="h-24 w-full object-cover rounded-xl border border-gray-200"/>
        </div>
      </div>

      <div class="relative">
        <div class="rounded-2xl border border-gray-200/70 shadow-xl overflow-hidden bg-white/70 backdrop-blur">
          <img src="/hero-dashboard.jpg" alt="Hero Dashboard Mockup" class="w-full h-auto">
        </div>
        <div class="hidden md:block absolute -top-6 -right-6 w-56 rounded-xl border border-gray-200 shadow-md bg-white/80 p-2 animate-float">
          <RentalInvoice
            aria-labelledby="sample-property-invoice"
            style="zoom: 0.32;"
            invoiceNumber="LD-INV-0021"
            invoiceDate="Oct 23, 2025"
            :tenant="{ name: 'John Doe', address: '123 Elm Street', city: 'San Francisco, CA', email: 'john@example.com' }"
            :property="{ name: 'Parkview Apartments', unit: '#2B', period: 'Oct 1 - Oct 31, 2025', dueDate: 'Nov 5, 2025' }"
            :items="[
              { description: 'Monthly Rent', qty: 1, rate: 1200 },
              { description: 'Maintenance Fee', qty: 1, rate: 50 },
              { description: 'Late Fee', qty: 1, rate: 100 },
            ]"
            :taxRate="0"
            :payment="{ bankName: 'LeaseDirector LLC', bank: 'Wells Fargo Bank', account: '123-456-789', swift: 'WFBIUS6S' }"
          />
        </div>
      </div>
    </div>
  </section>
</template>
