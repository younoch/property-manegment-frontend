<template>
  <div class="p-4 sm:p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Logs</h1>
      <p class="text-gray-600">Recent backend application logs.</p>
    </div>

    <UCard>
      <template #header>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="font-medium">Latest entries</div>
          <div class="flex items-center gap-2">
            <select v-model="level" class="text-sm border rounded px-2 py-1">
              <option value="all">All</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
            </select>
            <input v-model="search" type="text" placeholder="Search..." class="text-sm border rounded px-2 py-1" />
          </div>
        </div>
      </template>

      <div class="space-y-2">
        <div v-for="(l, i) in filtered" :key="i" class="rounded border border-gray-200 bg-white">
          <div class="flex items-center justify-between px-3 py-2 text-sm">
            <div class="flex items-center gap-2">
              <span :class="badgeClass(l.level)" class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium capitalize">{{ l.level }}</span>
              <span class="text-gray-800">{{ l.message }}</span>
            </div>
            <span class="text-xs text-gray-500">{{ l.time }}</span>
          </div>
          <pre v-if="l.context" class="text-xs bg-gray-50 border-t border-gray-100 p-3 overflow-x-auto"><code>{{ l.context }}</code></pre>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { definePageMeta } from '#imports'

definePageMeta({ layout: 'monitoring' })

const level = ref('all')
const search = ref('')

const logs = ref([
  { level: 'info', time: '22:15:01', message: 'User login successful', context: 'user_id=183, ip=192.168.1.5' },
  { level: 'warn', time: '22:16:12', message: 'High response time detected on /api/v1/units', context: 'p95=820ms' },
  { level: 'error', time: '22:17:03', message: 'Payment webhook signature invalid', context: '{"event":"payment.failed","id":"evt_92a"}' },
  { level: 'info', time: '22:18:22', message: 'Invoice generated for tenant #392' },
  { level: 'error', time: '22:20:44', message: 'DB connection timeout', context: 'pool=primary, timeout=30s' }
])

const filtered = computed(() => logs.value.filter(l =>
  (level.value === 'all' || l.level === level.value) &&
  (!search.value || (l.message + ' ' + (l.context || '')).toLowerCase().includes(search.value.toLowerCase()))
))

function badgeClass(lvl: string) {
  if (lvl === 'error') return 'bg-rose-100 text-rose-700'
  if (lvl === 'warn') return 'bg-amber-100 text-amber-700'
  return 'bg-blue-100 text-blue-700'
}
</script>
