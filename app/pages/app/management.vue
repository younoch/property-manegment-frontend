<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl md:text-2xl font-semibold">Property Management</h1>
    </div>
    
    <UCard class="mb-6">
      <div class="text-center p-12">
        <UIcon name="i-heroicons-clipboard-document-list" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Management Tools Coming Soon</h2>
        <p class="text-gray-600 mb-4">We're developing comprehensive management tools to help you efficiently manage your properties and operations.</p>
        <p class="text-sm text-gray-500">Check back soon for updates!</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ 
  middleware: 'auth',
  layout: 'default'
})
</script>
