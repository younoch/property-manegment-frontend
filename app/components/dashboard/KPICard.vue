<template>
  <UCard
    :ui="{
      root: 'relative overflow-hidden transition hover:translate-y-[-2px] hover:shadow-xl backdrop-blur border border-white/40 dark:border-white/10 bg-gradient-to-br from-white/70 to-white/30 dark:from-white/10 dark:to-white/5',
      body: 'p-2 sm:p-4 relative z-10'
    }"
  >
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ kpi.label }}</div>
        <div class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
          {{ formattedValue }}
        </div>
      </div>
      
      <div class="p-2 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400">
        <UIcon :name="kpi.icon" class="w-6 h-6" />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { KPI } from '~/types/dashboard';

const props = defineProps<{
  kpi: KPI;
}>();

// Format the KPI value
const formattedValue = computed(() => {
  return props.kpi.money ? fmtBDT(props.kpi.value) : props.kpi.value;
});

// Format BDT currency
const fmtBDT = (n: number) => {
  return new Intl.NumberFormat('en-BD', { 
    style: 'currency', 
    currency: 'BDT', 
    maximumFractionDigits: 0 
  }).format(n);
};
</script>
