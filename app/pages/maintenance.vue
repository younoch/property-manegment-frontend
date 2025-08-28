<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll overflow-scroll">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Maintenance</h1>
      <UButton icon="i-heroicons-wrench-screwdriver">New Request</UButton>
    </div>
    <UCard>
      <UTable :data="rows" :columns="columns" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const columns = [
  { id: 'ticket', key: 'ticket', label: 'Ticket #' },
  { id: 'property', key: 'property', label: 'Property' },
  { id: 'issue', key: 'issue', label: 'Issue' },
  { id: 'status', key: 'status', label: 'Status' }
]

const rows = reactive([
  { id: 1, ticket: 'MT-1001', property: 'Greenwood', issue: 'Leaky faucet', status: 'Open' },
  { id: 2, ticket: 'MT-1002', property: 'Maple Court', issue: 'Broken AC', status: 'In Progress' },
  { id: 3, ticket: 'MT-1003', property: 'Sunset Villas', issue: 'Electrical issue', status: 'Closed' }
])
</script>



