<template>
  <div class="p-4 sm:p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Users</h1>
      <p class="text-gray-600">Overview of user activity and roles.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <UCard>
        <template #header>
          <span class="font-medium">Total Users</span>
        </template>
        <div class="text-3xl font-semibold text-gray-900">3,842</div>
        <template #footer>
          <span class="text-xs text-gray-500">All time</span>
        </template>
      </UCard>

      <UCard>
        <template #header>
          <span class="font-medium">Active (30d)</span>
        </template>
        <div class="text-3xl font-semibold text-green-600">1,529</div>
        <template #footer>
          <span class="text-xs text-gray-500">39.8% active</span>
        </template>
      </UCard>

      <UCard>
        <template #header>
          <span class="font-medium">New (7d)</span>
        </template>
        <div class="text-3xl font-semibold text-gray-900">87</div>
        <template #footer>
          <span class="text-xs text-gray-500">vs last week: +12%</span>
        </template>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-medium">Recent signups</span>
          <div class="flex items-center gap-2">
            <select v-model="role" class="text-sm border rounded px-2 py-1">
              <option value="all">All roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="landlord">Landlord</option>
              <option value="manager">Manager</option>
              <option value="tenant">Tenant</option>
            </select>
            <input v-model="query" placeholder="Search name/email" class="text-sm border rounded px-2 py-1" />
          </div>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signed up</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="u in filtered" :key="u.email">
              <td class="px-4 py-3 text-sm text-gray-800">{{ u.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ u.email }}</td>
              <td class="px-4 py-3">
                <span :class="roleBadge(u.role)" class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium capitalize">{{ u.role.replace('_',' ') }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ u.since }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { definePageMeta } from '#imports'

definePageMeta({ layout: 'monitoring' })

const role = ref('all')
const query = ref('')

const users = ref([
  { name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'manager', since: '2025-10-15 21:40' },
  { name: 'Devon Kim', email: 'devon.k@example.com', role: 'tenant', since: '2025-10-15 20:12' },
  { name: 'Ava Patel', email: 'ava.p@example.com', role: 'landlord', since: '2025-10-15 18:03' },
  { name: 'Marcus Li', email: 'marcus.l@example.com', role: 'tenant', since: '2025-10-15 17:55' },
  { name: 'Admin Root', email: 'root@example.com', role: 'super_admin', since: '2025-10-14 09:10' }
])

const filtered = computed(() => users.value.filter(u =>
  (role.value === 'all' || u.role === role.value) &&
  (!query.value || (u.name + ' ' + u.email).toLowerCase().includes(query.value.toLowerCase()))
))

function roleBadge(r: string) {
  if (r === 'super_admin') return 'bg-purple-100 text-purple-700'
  if (r === 'landlord') return 'bg-blue-100 text-blue-700'
  if (r === 'manager') return 'bg-emerald-100 text-emerald-700'
  return 'bg-gray-100 text-gray-700'
}
</script>
