<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Tenants</h1>
      <UButton icon="i-heroicons-user-plus">Add Tenant</UButton>
    </div>
    <UCard>
      <UTable :rows="rows" :columns="columns" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'unit', label: 'Unit' },
  { key: 'phone', label: 'Phone' },
  { key: 'balance', label: 'Balance' }
]

const rows = [
  { name: 'Alice Johnson', unit: 'Apt 2B', phone: '(555) 123-4567', balance: '$0.00' },
  { name: 'Robert Brown', unit: 'Apt 3A', phone: '(555) 987-6543', balance: '$125.00' },
  { name: 'Karen Smith', unit: 'Apt 1C', phone: '(555) 222-3344', balance: '$0.00' }
]
</script>



