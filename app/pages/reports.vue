<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Reports</h1>
      <UButton icon="i-heroicons-arrow-down-tray">Export</UButton>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard>
        <template #header>Occupancy</template>
        <p class="text-3xl font-bold">92%</p>
      </UCard>
      <UCard>
        <template #header>Monthly Revenue</template>
        <p class="text-3xl font-bold">$38,450</p>
      </UCard>
      <UCard>
        <template #header>Open Tickets</template>
        <p class="text-3xl font-bold">7</p>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>



