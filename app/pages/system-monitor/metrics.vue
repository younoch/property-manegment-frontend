<template>
  <div class="p-4 sm:p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Metrics</h1>
      <p class="text-gray-600">Key performance indicators across the platform.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <DashboardChart
        title="CPU Usage (%)"
        :chart-data="cpuData"
        :chart-options="areaOptions"
        chart-type="AreaChart"
        :show-range-selector="true"
      />

      <DashboardChart
        title="Memory Usage (GB)"
        :chart-data="memData"
        :chart-options="areaOptions"
        chart-type="AreaChart"
      />

      <DashboardChart
        title="DB Queries per Sec"
        :chart-data="qpsData"
        :chart-options="lineOptions"
        chart-type="LineChart"
      />

      <DashboardChart
        title="Cache Hit Ratio"
        :chart-data="hitData"
        :chart-options="lineOptions"
        chart-type="LineChart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardChart from '~/components/dashboard/DashboardChart.vue'
import { definePageMeta } from '#imports'

definePageMeta({ layout: 'monitoring' })

function genSeries(label: string, base = 50) {
  const now = new Date()
  const points = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getTime() - (11 - i) * 5 * 60 * 1000)
    const t = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
    return [t, Math.max(0, Math.min(100, base + Math.round(Math.random()*20 - 10)))]
  })
  return [["Time", label], ...points]
}

const cpuData = genSeries('CPU', 55)
const memData = [["Time", "GB"], ...genSeries('M', 6).slice(1).map(([t, v]) => [t as string, (v as number)/10 + 5])]
const qpsData = [["Time", "QPS"], ...genSeries('Q', 80).slice(1).map(([t, v]) => [t as string, Math.round((v as number)/2 + 60)])]
const hitData = [["Time", "Hit %"], ...genSeries('H', 90).slice(1).map(([t, v]) => [t as string, Math.round((v as number))])]

const areaOptions = { legend: { position: 'bottom' }, chartArea: { width: '85%', height: '70%' }, isStacked: false }
const lineOptions = { legend: { position: 'bottom' }, chartArea: { width: '85%', height: '70%' } }
</script>
