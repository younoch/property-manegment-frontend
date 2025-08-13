<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Maintenance</h1>
      <UButton icon="i-heroicons-wrench-screwdriver">New Request</UButton>
    </div>
    <UCard>
      <UTable :rows="rows" :columns="columns" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const columns = [
  { key: 'ticket', label: 'Ticket #' },
  { key: 'property', label: 'Property' },
  { key: 'issue', label: 'Issue' },
  { key: 'status', label: 'Status' }
]

const rows = [
  { ticket: 'MT-1001', property: 'Greenwood', issue: 'Leaky faucet', status: 'Open' },
  { ticket: 'MT-1002', property: 'Maple Court', issue: 'Broken AC', status: 'In Progress' },
  { ticket: 'MT-1003', property: 'Sunset Villas', issue: 'Electrical issue', status: 'Closed' }
]
</script>



