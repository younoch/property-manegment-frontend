<template>
  <div class="p-4 sm:p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Monitoring Settings</h1>
      <p class="text-gray-600">Configure thresholds, notifications, and data retention.</p>
    </div>

    <UCard>
      <template #header>
        <span class="font-medium">Alert thresholds</span>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-700 mb-1">Error rate (%)</label>
          <input v-model.number="settings.errorRate" type="number" min="0" max="100" class="w-full border rounded px-3 py-2" />
          <p class="text-xs text-gray-500 mt-1">Trigger alert when error rate exceeds this value over 5 minutes.</p>
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1">Avg response (ms)</label>
          <input v-model.number="settings.responseMs" type="number" min="0" class="w-full border rounded px-3 py-2" />
          <p class="text-xs text-gray-500 mt-1">Trigger alert when P95 latency breaches this value.</p>
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1">CPU usage (%)</label>
          <input v-model.number="settings.cpu" type="number" min="0" max="100" class="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <button @click="save()" class="px-3 py-1.5 rounded bg-primary-600 text-white hover:bg-primary-700 text-sm">Save changes</button>
        </div>
      </template>
    </UCard>

    <UCard>
      <template #header>
        <span class="font-medium">Notifications</span>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <input id="email" type="checkbox" v-model="settings.notifyEmail" class="h-4 w-4" />
          <label for="email" class="text-sm text-gray-800">Email alerts</label>
        </div>
        <div class="flex items-center gap-3">
          <input id="sms" type="checkbox" v-model="settings.notifySms" class="h-4 w-4" />
          <label for="sms" class="text-sm text-gray-800">SMS alerts</label>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm text-gray-700 mb-1">Recipients (comma separated)</label>
          <input v-model="settings.recipients" placeholder="ops@example.com, oncall@example.com" class="w-full border rounded px-3 py-2" />
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <span class="font-medium">Data retention</span>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-700 mb-1">Logs (days)</label>
          <input v-model.number="settings.logsDays" type="number" min="1" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1">Metrics (days)</label>
          <input v-model.number="settings.metricsDays" type="number" min="1" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1">Traces (days)</label>
          <input v-model.number="settings.tracesDays" type="number" min="1" class="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <button @click="reset()" class="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 text-sm">Reset to defaults</button>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { definePageMeta } from '#imports'

definePageMeta({ layout: 'monitoring' })

const defaults = {
  errorRate: 1.5,
  responseMs: 500,
  cpu: 85,
  notifyEmail: true,
  notifySms: false,
  recipients: 'ops@example.com',
  logsDays: 14,
  metricsDays: 30,
  tracesDays: 7
}

const settings = reactive({ ...defaults })

function save() {
  // Placeholder: in real app, call API
  console.log('Saved settings', settings)
}

function reset() {
  Object.assign(settings, defaults)
}
</script>
