<template>
  <div class="p-4 sm:p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">System Health</h1>
      <p class="text-gray-600">Current status of core platform dependencies.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">API Gateway</span>
            <span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700">Operational</span>
          </div>
        </template>
        <ul class="text-sm text-gray-700 space-y-1">
          <li><strong>Latency:</strong> 182 ms</li>
          <li><strong>Uptime (30d):</strong> 99.98%</li>
          <li><strong>Error Rate:</strong> 0.21%</li>
        </ul>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">Database</span>
            <span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700">Operational</span>
          </div>
        </template>
        <ul class="text-sm text-gray-700 space-y-1">
          <li><strong>Read latency:</strong> 12 ms</li>
          <li><strong>Write latency:</strong> 24 ms</li>
          <li><strong>Connections:</strong> 78 / 200</li>
        </ul>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">Cache (Redis)</span>
            <span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700">Degraded</span>
          </div>
        </template>
        <ul class="text-sm text-gray-700 space-y-1">
          <li><strong>Hit rate:</strong> 92%</li>
          <li><strong>Memory used:</strong> 3.4 GB / 8 GB</li>
          <li><strong>Evictions:</strong> 12 / min</li>
        </ul>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">File Storage</span>
            <span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700">Operational</span>
          </div>
        </template>
        <ul class="text-sm text-gray-700 space-y-1">
          <li><strong>Bucket size:</strong> 412 GB</li>
          <li><strong>Requests/min:</strong> 320</li>
          <li><strong>Errors/min:</strong> 0.8</li>
        </ul>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">Email Service</span>
            <span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700">Operational</span>
          </div>
        </template>
        <ul class="text-sm text-gray-700 space-y-1">
          <li><strong>Send rate:</strong> 45 / min</li>
          <li><strong>Bounce rate:</strong> 0.3%</li>
          <li><strong>Queue depth:</strong> 12</li>
        </ul>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">SMS Service</span>
            <span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700">Operational</span>
          </div>
        </template>
        <ul class="text-sm text-gray-700 space-y-1">
          <li><strong>Send rate:</strong> 12 / min</li>
          <li><strong>Delivery rate:</strong> 99.1%</li>
          <li><strong>Queue depth:</strong> 3</li>
        </ul>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({ layout: 'monitoring' })
</script>
