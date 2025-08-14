<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Properties</h1>
      <UButton icon="i-heroicons-plus" @click="isAddOpen = true">Add Property</UButton>
    </div>
    <UCard>
      <UTable :rows="rows" :columns="columns" />
    </UCard>

    <AddPropertyForm v-model:open="isAddOpen" @created="onCreated" />
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
definePageMeta({ middleware: ['auth'] })

import { ref } from 'vue'
import AddPropertyForm from '../components/properties/AddPropertyForm.vue'
import type { CreatedProperty } from '../../types/properties'

const columns = [
  { id: 'name', key: 'name', label: 'Name' },
  { id: 'units', key: 'units', label: 'Units' },
  { id: 'city', key: 'city', label: 'City' },
  { id: 'status', key: 'status', label: 'Status' }
]

const rows = ref([
  { name: 'Greenwood Apartments', units: 24, city: 'Seattle', status: 'Active' },
  { name: 'Maple Court', units: 12, city: 'Portland', status: 'Active' },
  { name: 'Sunset Villas', units: 8, city: 'San Diego', status: 'Inactive' }
])

const isAddOpen = ref(false)
const onCreated = (created: CreatedProperty) => {
  rows.value.unshift({
    name: created?.name ?? 'New Property',
    units: created?.number_of_units ?? 0,
    city: created?.city ?? '',
    status: 'Active'
  })
}
</script>



