<template>
  <div class="p-4 sm:p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">System Monitoring</h1>
      <p class="text-gray-600 dark:text-gray-400">Overview of platform health and key metrics.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <UCard class="dark:bg-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium dark:text-gray-200">API Uptime</span>
            <UIcon name="i-heroicons-cloud" class="text-blue-500" />
          </div>
        </template>
        <div class="text-3xl font-semibold text-green-600 dark:text-green-400">99.98%</div>
        <template #footer>
          <span class="text-xs text-gray-500 dark:text-gray-400">Last 30 days</span>
        </template>
      </UCard>

      <UCard class="dark:bg-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium dark:text-gray-200">Avg Response</span>
            <UIcon name="i-heroicons-bolt" class="text-yellow-500" />
          </div>
        </template>
        <div class="text-3xl font-semibold text-gray-900 dark:text-white">182 ms</div>
        <template #footer>
          <span class="text-xs text-gray-500 dark:text-gray-400">P95: 420 ms</span>
        </template>
      </UCard>

      <UCard class="dark:bg-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium dark:text-gray-200">Error Rate</span>
            <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500" />
          </div>
        </template>
        <div class="text-3xl font-semibold text-amber-600 dark:text-amber-400">0.23%</div>
        <template #footer>
          <span class="text-xs text-gray-500 dark:text-gray-400">Last 24 hours</span>
        </template>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <RequestsPerMinuteChart 
          :data="rpmData"
          :options="{
            colors: {
              line: '#3b82f6',
              area: 'rgba(59, 130, 246, 0.2)',
              point: '#3b82f6',
              text: '#1f2937'
            },
            height: 320
          }"
        />
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <EndpointErrorsChart 
          :data="endpointErrorsData"
          :options="{
            colors: {
              bar: '#ef4444',
              text: '#1f2937',
              background: 'transparent'
            },
            height: 320
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RequestsPerMinuteChart from '~/components/dashboard/RequestsPerMinuteChart.vue'
import EndpointErrorsChart from '~/components/dashboard/EndpointErrorsChart.vue'

definePageMeta({
  layout: 'monitoring'
});

// Generate RPM data
const now = new Date();
const rpmData = Array.from({ length: 12 }).map((_, i) => {
  const d = new Date(now.getTime() - (11 - i) * 5 * 60 * 1000);
  return {
    time: `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`,
    value: 50 + Math.round(Math.random() * 40) + (i % 3 === 0 ? 25 : 0)
  };
});

// Generate endpoint errors data
const endpointErrorsData = [
  { endpoint: '/api/v1/auth/login', errors: 12 },
  { endpoint: '/api/v1/units', errors: 7 },
  { endpoint: '/api/v1/payments', errors: 5 },
  { endpoint: '/api/v1/tenants', errors: 4 },
  { endpoint: '/api/v1/invoices', errors: 3 }
];

const barOptions = {
  legend: { position: 'none' },
  chartArea: { width: '85%', height: '70%' },
  bars: 'horizontal'
}
</script>
