<template>
  <section class="relative isolate overflow-hidden bg-primary-600 text-white">
    <!-- Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-teal-600"></div>

    <div class="container relative z-10 mx-auto px-6 pt-8 pb-20 grid lg:grid-cols-3 gap-10 items-center">
      <!-- LEFT CONTENT -->
      <div class="lg:col-span-2 flex flex-col justify-center items-start">
        <div
          class="rounded-full bg-white/10 text-white text-xs font-semibold px-3 py-1 ring-1 ring-white/20 shadow-sm mb-2 md:mb-4 backdrop-blur-sm text-center md:text-left">
          <span class="h-2 w-2 rounded-full bg-white"></span>
          LeaseDirector · Smart Property Management Software
        </div>

        <h1 class="text-center md:text-left text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
          Property Management Software
for
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-100">
            Small Landlords
          </span>
        </h1>

        <p class="mt-2 md:mt-5 text-white/90 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl text-center md:text-left">
          Simplify leasing, invoicing, and rent collection with
          <strong>LeaseDirector</strong>. Automate payments, manage tenants,
          and track everything in one clean dashboard.
        </p>

        <div class="mt-4 md:mt-8 flex gap-2 md:gap-3 justify-center md:justify-start w-full md:w-auto">
          <UButton size="md" color="white" to="/auth/signup"
            class="bg-white text-primary-700 hover:bg-primary-50 font-semibold shadow-lg shadow-primary-800/20">
            Get Started Free
          </UButton>
          <UButton size="md" color="white" variant="ghost" to="/features"
            class="border border-white/30 hover:bg-white/10 text-white">
            See Features
          </UButton>
        </div>

        <p class="mt-4 text-xs sm:text-sm text-white/80 text-center md:text-left">
          No credit card required · Setup in minutes · Works on any device
        </p>
      </div>

      <!-- RIGHT CONTENT -->
      <div class="lg:col-span-1 relative flex justify-center lg:justify-end mt-0 md:mt-8">
        <!-- Accent Glow -->
        <div class="absolute md:bottom-4 right-6 w-60 h-60 bg-white/20 rounded-full blur-3xl animate-pulse-slow"></div>

        <!-- Main Invoice Card -->
        <div
          class="relative animate-float-slow rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.1)] bg-white/95 backdrop-blur-md w-[95%] md:w-[90%] max-w-md transform hover:scale-[1.02] transition-transform duration-500">
          <RentalInvoice aria-labelledby="sample-property-invoice" style="zoom: 0.45;" invoiceNumber="LD-INV-0021"
            invoiceDate="Oct 23, 2025" :tenant="{
              name: 'John Doe',
              address: '123 Elm Street',
              city: 'San Francisco, CA',
              email: 'john@example.com'
            }" :property="{
              name: 'Parkview Apartments',
              unit: '#2B',
              period: 'Oct 1 - Oct 31, 2025',
              dueDate: 'Nov 5, 2025'
            }" :items="[
              { description: 'Monthly Rent', qty: 1, rate: 1200 },
              { description: 'Maintenance Fee', qty: 1, rate: 50 },
              { description: 'Late Fee', qty: 1, rate: 100 }
            ]" :taxRate="0" :payment="{
              bankName: 'LeaseDirector LLC',
              bank: 'Wells Fargo Bank',
              account: '123-456-789',
              swift: 'WFBIUS6S'
            }" />

        </div>

        <!-- Floating Mini Card -->
        <div
          class="absolute text-center -top-8 md:-left-6 left-[50%] translate-x-[-50%] bg-white/80 border border-white/30 backdrop-blur-md shadow-xl rounded-xl px-3 py-2 text-[11px] text-primary-700 font-medium animate-float-delayed">
          💰 Rent Received: <span class="font-bold text-primary-800">$1,200</span>
        </div>
      </div>
    </div>

    <!-- Decorative Top Glow -->
    <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/10 blur-3xl rounded-full"></div>
  </section>
</template>

<script setup lang="ts">
import RentalInvoice from '~/components/common/RentalInvoice.vue'
</script>

<style scoped>
@keyframes float-slow {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes float-delayed {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(6px);
  }

  100% {
    transform: translateY(0px);
  }
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
