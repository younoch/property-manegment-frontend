<template>
  <div class="p-4 sm:p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">System Metrics</h1>
      <p class="text-gray-600 dark:text-gray-400">Key performance indicators across the platform.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- CPU Usage Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <CpuUsageChart 
          :data="cpuData"
          :options="{
            colors: ['#3b82f6', '#93c5fd']
          }"
        />
      </div>

      <!-- Memory Usage Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <MemoryUsageChart 
          :data="memoryData"
          :options="{
            colors: {
              used: '#3b82f6',
              total: '#e5e7eb',
              text: '#1f2937'
            }
          }"
        />
      </div>

      <!-- DB Queries Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <DbQueriesChart 
          :data="dbQueriesData"
          :options="{
            colors: {
              line: '#3b82f6',
              area: 'rgba(59, 130, 246, 0.2)',
              point: '#3b82f6'
            }
          }"
        />
      </div>

      <!-- Cache Hit Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <CacheHitChart 
          :data="cacheHitData"
          :options="{
            colors: {
              hits: '#10b981',
              misses: '#ef4444',
              text: '#1f2937'
            }
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import CpuUsageChart from '~/components/dashboard/CpuUsageChart.vue'
import MemoryUsageChart from '~/components/dashboard/MemoryUsageChart.vue'
import DbQueriesChart from '~/components/dashboard/DbQueriesChart.vue'
import CacheHitChart from '~/components/dashboard/CacheHitChart.vue'

definePageMeta({ layout: 'monitoring' });

// Generate CPU data (percentage usage over time)
const cpuData = Array.from({ length: 24 }).map((_, i) => ({
  label: `${String(i).padStart(2, '0')}:00`,
  value: 30 + Math.round(Math.random() * 60) // Random value between 30-90%
}));

// Generate Memory data (used vs total)
const memoryData = Array.from({ length: 8 }).map((_, i) => ({
  label: `Node ${i + 1}`,
  value: 4 + Math.round(Math.random() * 12), // Used memory in GB
  total: 16 // Total memory in GB
}));

// Generate DB Queries data (queries per second over time)
const now = new Date();
const dbQueriesData = Array.from({ length: 24 }).map((_, i) => {
  const date = new Date(now);
  date.setHours(date.getHours() - 23 + i);
  return {
    date: date,
    value: 50 + Math.round(Math.random() * 100) // Random value between 50-150 QPS
  };
});

// Generate Cache Hit data (hits vs misses over time)
const cacheHitData = Array.from({ length: 24 }).map((_, i) => {
  const date = new Date(now);
  date.setHours(date.getHours() - 23 + i);
  return {
    date: date,
    hits: 500 + Math.round(Math.random() * 1000), // 500-1500 hits
    misses: 50 + Math.round(Math.random() * 100)  // 50-150 misses
  };
});
</script>
