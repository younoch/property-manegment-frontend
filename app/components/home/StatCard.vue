<template>
  <div class="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur border border-gray-200 shadow-sm text-center sm:text-left">
    <p class="text-xl sm:text-2xl font-semibold text-gray-900">{{ value }}</p>
    <p class="mt-1 text-sm sm:text-[0.9375rem] text-gray-600 leading-tight">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ 
  value: string; 
  label: string 
}>()
</script>
