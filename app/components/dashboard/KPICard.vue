<template>
  <UCard
    :ui="{
      padding: { base: 'p-3' },
      base: 'relative overflow-hidden transition hover:translate-y-[-2px] hover:shadow-xl backdrop-blur border border-white/40 dark:border-white/10 bg-gradient-to-br from-white/70 to-white/30 dark:from-white/10 dark:to-white/5',
      body: { base: 'relative z-10' }
    }"
  >
    <!-- Soft glow effect -->

    <div class="flex items-start justify-between gap-2">
      <div>
        <div class="text-sm text-gray-600 dark:text-gray-300">{{ kpi.label }}</div>
        <div class="mt-1 text-3xl font-semibold">{{ formattedValue }}</div>
        <span
          v-if="showDeltaRef"
          class="inline-flex items-center gap-1 mt-2 text-xs px-2 py-0.5 rounded-full"
          :class="deltaClass"
          :title="deltaTitle"
        >
          <UIcon :name="deltaIcon" class="w-3.5 h-3.5" />
          <span>{{ formattedDelta }}</span>
        </span>
      </div>

      <div class="flex flex-col items-end">
        <div class="rounded-full p-2 bg-primary-500/10 text-primary-600 dark:text-primary-400">
          <UIcon :name="kpi.icon" class="h-6 w-6" />
        </div>
        <!-- Sparkline -->
        <div v-if="kpi.spark" class="mt-2 w-40 h-14">
          <GoogleChart
            type="LineChart"
            :data="kpi.spark"
            :options="sparkOptions"
            class="w-full h-full"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import type { KPI } from '~/types/dashboard';

const props = defineProps<{
  kpi: KPI;
  showDelta?: boolean;
}>();

const { kpi } = toRefs(props);
const showDeltaRef = computed(() => props.showDelta ?? true);

// Format the KPI value
const formattedValue = computed(() => {
  return kpi.value.money ? fmtBDT(kpi.value.value) : kpi.value.value;
});

// Format the delta value
const formattedDelta = computed(() => {
  if (!showDeltaRef.value) return '';
  const delta = kpi.value.delta;
  const prefix = delta >= 0 ? '+' : '';
  return kpi.value.money ? fmtBDT(Math.abs(delta)) : `${prefix}${Math.abs(delta)}`;
});

// Determine delta styling
const deltaClass = computed(() => {
  return kpi.value.delta >= 0 
    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
    : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20';
});

// Delta tooltip text
const deltaTitle = computed(() => {
  return kpi.value.delta >= 0 ? 'Up vs. last period' : 'Down vs. last period';
});

// Delta icon
const deltaIcon = computed(() => {
  return kpi.value.delta >= 0 
    ? 'i-heroicons-arrow-up-right' 
    : 'i-heroicons-arrow-down-right';
});

// Sparkline chart options
const sparkOptions = {
  legend: 'none',
  chartArea: { width: '100%', height: '100%' },
  hAxis: { textPosition: 'none', gridlines: { count: 0 } },
  vAxis: { textPosition: 'none', gridlines: { count: 0 }, baselineColor: 'transparent' },
  lineWidth: 2,
  height: 56,
  colors: ['#4ade80']
};

// Format BDT currency
const fmtBDT = (n: number) => {
  return new Intl.NumberFormat('en-BD', { 
    style: 'currency', 
    currency: 'BDT', 
    maximumFractionDigits: 0 
  }).format(n);
};
</script>
