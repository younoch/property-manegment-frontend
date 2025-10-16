<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl md:text-2xl font-semibold">Maintenance</h1>
      <UButton icon="i-heroicons-wrench-screwdriver">New Request</UButton>
    </div>
    
    <UCard class="mb-6">
      <div class="text-center p-8">
        <UIcon name="i-heroicons-wrench-screwdriver" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Maintenance Feature Coming Soon</h2>
        <p class="text-gray-600 mb-4">We're working hard to bring you a comprehensive maintenance management system.</p>
        <p class="text-sm text-gray-500">Check back soon for updates!</p>
      </div>
    </UCard>
    
    <UCard>
      <div class="text-sm text-gray-500 italic mb-4">
        Sample data shown below. The actual maintenance feature will be available in an upcoming release.
      </div>
      <UTable :data="rows" :columns="columns" :ui="{ td: 'py-2 px-4' }" />
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
