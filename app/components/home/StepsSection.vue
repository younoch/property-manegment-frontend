<template>
  <section id="how" class="py-12 sm:py-16 lg:py-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-2">Get started in 3 steps</h2>
      <p class="text-center text-gray-600 max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16">Simple, straightforward process to manage your properties efficiently</p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="p-4 sm:p-6 lg:p-8 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 lg:gap-6"
        >
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-600 text-white flex-shrink-0 flex items-center justify-center font-semibold text-lg sm:text-xl">
            {{ index + 1 }}
          </div>
          <div class="flex-1 text-center sm:text-left">
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900">{{ step.title }}</h3>
            <p class="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>

      <div class="mt-8 sm:mt-10 lg:mt-14 flex justify-center px-4 sm:px-0">
        <UButton 
          color="primary" 
          size="md"
          to="/auth/signup" 
          class="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-medium bg-primary-700 hover:bg-primary-800 text-white shadow-md shadow-primary-200 hover:shadow-primary-300 active:scale-[0.98] transition-all duration-150"
        >
          <span>Start Free Trial</span>
          <span class="hidden sm:inline"> - No Credit Card</span>
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: 'Create or Activate a Lease',
    description: 'Set rent, billing day, grace days, and deposit.'
  },
  {
    title: 'Generate Invoices Automatically',
    description: 'Prevent duplicates per period. Proration handled.'
  },
  {
    title: 'Record Payments',
    description: 'Apply partials, auto-create credits for overpay, watch status flip to paid.'
  }
];
</script>
