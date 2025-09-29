<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl md:text-2xl font-semibold">User Management</h1>
      <UButton icon="i-heroicons-user-plus">Invite User</UButton>
    </div>
    <UCard>
      <UTable :rows="rows" :columns="columns" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { requireRole } from '~/middleware/auth'

definePageMeta({
  middleware: [ 'auth', requireRole(['super_admin']) ]
})

const columns = [
  { id: 'name', key: 'name', label: 'Name' },
  { id: 'email', key: 'email', label: 'Email' },
  { id: 'role', key: 'role', label: 'Role' }
]

const rows = [
  { name: 'You (Owner)', email: 'owner@example.com', role: 'super_admin' },
  { name: 'Lana Lang', email: 'lana@example.com', role: 'manager' },
  { name: 'Tom Tenant', email: 'tom@example.com', role: 'tenant' }
]
</script>



