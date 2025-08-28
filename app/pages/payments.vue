<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Payments</h1>
      <UButton icon="i-heroicons-banknotes">Record Payment</UButton>
    </div>
    <UCard>
      <UTable :rows="rows" :columns="columns" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const columns = [
  { id: 'date', key: 'date', label: 'Date' },
  { id: 'tenant', key: 'tenant', label: 'Tenant' },
  { id: 'amount', key: 'amount', label: 'Amount' },
  { id: 'method', key: 'method', label: 'Method' }
]

const rows = [
  { date: '2025-06-30', tenant: 'Alice Johnson', amount: '$1,250.00', method: 'Card' },
  { date: '2025-06-28', tenant: 'Robert Brown', amount: '$1,150.00', method: 'Bank Transfer' },
  { date: '2025-06-25', tenant: 'Karen Smith', amount: '$980.00', method: 'Cash' }
]
</script>



