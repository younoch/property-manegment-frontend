<template>
  <div class="p-4 sm:p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">System Monitoring</h1>
      <p class="text-gray-600">Overview of platform health and key metrics.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">API Uptime</span>
            <UIcon name="i-heroicons-cloud" />
          </div>
        </template>
        <div class="text-3xl font-semibold text-green-600">99.98%</div>
        <template #footer>
          <span class="text-xs text-gray-500">Last 30 days</span>
        </template>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">Avg Response</span>
            <UIcon name="i-heroicons-bolt" />
          </div>
        </template>
        <div class="text-3xl font-semibold text-gray-900">182 ms</div>
        <template #footer>
          <span class="text-xs text-gray-500">P95: 420 ms</span>
        </template>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">Error Rate</span>
            <UIcon name="i-heroicons-exclamation-triangle" />
          </div>
        </template>
        <div class="text-3xl font-semibold text-amber-600">0.23%</div>
        <template #footer>
          <span class="text-xs text-gray-500">Last 24 hours</span>
        </template>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
      <DashboardChart
        title="Requests per Minute"
        :chart-data="rpmData"
        :chart-options="chartOptions"
        chart-type="LineChart"
        :show-range-selector="true"
      />

      <DashboardChart
        title="Top Endpoints by Error"
        :chart-data="endpointErrorsData"
        :chart-options="barOptions"
        chart-type="BarChart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardChart from '~/components/dashboard/DashboardChart.vue'

definePageMeta({
  layout: 'monitoring'
})

const now = new Date()
const minutes = Array.from({ length: 12 }).map((_, i) => {
  const d = new Date(now.getTime() - (11 - i) * 5 * 60 * 1000)
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
})

const rpmData = [
  ['Time', 'Requests'],
  ...minutes.map((m, i) => [m, 50 + Math.round(Math.random() * 40) + (i % 3 === 0 ? 25 : 0)])
]

const endpointErrorsData = [
  ['Endpoint', 'Errors'],
  ['/api/v1/auth/login', 12],
  ['/api/v1/units', 7],
  ['/api/v1/payments', 5],
  ['/api/v1/tenants', 4],
  ['/api/v1/invoices', 3]
]

const chartOptions = {
  legend: { position: 'bottom' },
  chartArea: { width: '85%', height: '70%' },
  curveType: 'function'
}

const barOptions = {
  legend: { position: 'none' },
  chartArea: { width: '85%', height: '70%' },
  bars: 'horizontal'
}
</script>
