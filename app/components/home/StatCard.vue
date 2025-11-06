<template>
  <div class="group relative p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden text-center">
    <!-- Animated background highlight on hover -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Decorative element -->
    <div class="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary-400/30 group-hover:bg-primary-500/40 transition-colors duration-300"></div>
    
    <!-- Content -->
    <div class="relative z-10">
      <p class="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
        {{ value }}
      </p>
      <p class="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
        {{ label }}
      </p>
    </div>
    
    <!-- Bottom accent bar -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-teal-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ 
  value: string; 
  label: string 
}>()
</script>
