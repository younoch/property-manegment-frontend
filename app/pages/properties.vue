<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Properties</h1>
      <UButton icon="i-heroicons-plus">Add Property</UButton>
    </div>
    <UCard>
      <UTable :rows="rows" :columns="columns" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth',] })

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'units', label: 'Units' },
  { key: 'city', label: 'City' },
  { key: 'status', label: 'Status' }
]

const rows = [
  { name: 'Greenwood Apartments', units: 24, city: 'Seattle', status: 'Active' },
  { name: 'Maple Court', units: 12, city: 'Portland', status: 'Active' },
  { name: 'Sunset Villas', units: 8, city: 'San Diego', status: 'Inactive' }
]
</script>



