<template>
  <div class="p-4 sm:p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Services</h1>
      <p class="text-gray-600">Manage and view status of background services.</p>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-medium">Service List</span>
          <span class="text-xs text-gray-500">Sample data</span>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last restart</th>
              <th class="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="s in services" :key="s.name">
              <td class="px-4 py-3 text-sm text-gray-800">{{ s.name }}</td>
              <td class="px-4 py-3">
                <span :class="s.status === 'running' ? 'bg-green-100 text-green-700' : s.status === 'degraded' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'" class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium">{{ s.status }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ s.uptime }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ s.lastRestart }}</td>
              <td class="px-4 py-3 text-right">
                <button class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50" @click="fakeRestart(s)">Restart</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { definePageMeta } from '#imports'

definePageMeta({ layout: 'monitoring' })

const services = ref([
  { name: 'Worker - Emails', status: 'running', uptime: '5d 12h', lastRestart: '2025-10-10 14:20' },
  { name: 'Worker - Invoices', status: 'running', uptime: '2d 03h', lastRestart: '2025-10-13 19:04' },
  { name: 'Scheduler', status: 'degraded', uptime: '8h 41m', lastRestart: '2025-10-15 10:11' },
  { name: 'Webhooks Processor', status: 'stopped', uptime: '-', lastRestart: '2025-10-15 08:02' }
])

function fakeRestart(service: any) {
  // Placeholder action for demo
  service.status = 'running'
  service.uptime = '0h 01m'
  service.lastRestart = new Date().toISOString().slice(0, 16).replace('T', ' ')
}
</script>
