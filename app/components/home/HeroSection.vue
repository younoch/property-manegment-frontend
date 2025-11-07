<template>
  <section class="container mx-auto px-4 pt-2 md:pt-12 mb-2 md:mb-12">
    <div class="grid lg:grid-cols-2 gap-3 md:gap-10 items-center">
      <div>
        <h1 class="inline-flex text-center md:text-left items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-primary-700 font-semibold bg-primary-50 rounded-full px-3 py-1 shadow-sm ring-1 ring-primary-200/60">
          LeaseDirector · Smart Property Management Software
        </h1>

        <h2  class="mt-3 md:mt-5 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight md:leading-tight text-center sm:text-left">
          Property Management Software 
          <br />
          for
          
          <span class="bg-clip-text text-[120%] text-transparent bg-gradient-to-r from-primary-600 to-teal-600">Small Landlords</span>
        </h2>

        <p class="mt-4 text-gray-700 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed text-center sm:text-left">
          <strong>LeaseDirector</strong> makes it easy to manage leases, send invoices, and track payments—all in one place.
          Automate rent collection, generate professional invoices, and get paid on time, every time.
        </p>

        <div class="mt-4 flex flex-col sm:flex-row gap-3">
          <UButton color="primary" size="lg" to="/auth/signup" class="justify-center items-center bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200 hover:shadow-primary-300">
            Get Started Free
          </UButton>
        </div>
        <p class="mt-3 text-xs sm:text-sm text-gray-600">No credit card required · 1-minute signup · Works on mobile</p>
      </div>
      

      <div class="relative">
        <!-- Hidden on mobile, visible from md breakpoint -->
        <div class="rounded-2xl border border-gray-200/70 shadow-xl overflow-hidden bg-white/70 backdrop-blur" v-if="windowWidth > 768">
          <div class="relative pb-[75%] w-full">
            <img 
              src="/hero-dashboard.webp" 
              alt="LeaseDirector dashboard interface showing property management features"
              width="1200"
              height="900"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              class="absolute top-0 left-0 w-full h-full object-contain"
              style="aspect-ratio: 1200/900"
            />
          </div>
        </div>
        
        <!-- Mobile invoice with label -->
        <div class="md:hidden mt-4">
          <div class="border border-gray-200 rounded-lg p-2 bg-white/80">
            <RentalInvoice
              aria-labelledby="sample-property-invoice"
              style="zoom: 0.3;"
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
            <div class="mt-2 text-center">
              <span class="inline-flex items-center gap-1.5 bg-primary-50/50 text-primary-600 text-[10px] font-medium px-2.5 py-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clip-rule="evenodd" />
                </svg>
                Sample Rental Invoice
              </span>
            </div>
          </div>
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


<script setup lang="ts">
import RentalInvoice from '~/components/common/RentalInvoice.vue';

const windowWidth = ref(0)

onBeforeMount(() => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  } else {
    windowWidth.value = 0
  }
})

</script>
