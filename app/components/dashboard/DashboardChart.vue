<template>
  <UCard :ui="{
    base: 'h-full flex flex-col',
    body: { base: 'flex-1 flex flex-col' },
    footer: { base: 'pt-0' }
  }">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-medium text-gray-900 dark:text-white">{{ title }}</h3>
        <div v-if="showRangeSelector" class="flex items-center gap-2">
          <USelect 
            v-model="selectedRange" 
            :items="ranges" 
            size="xs"
            class="w-36"
            :ui-menu="{ width: 'w-36' }"
          />
        </div>
      </div>
    </template>

    <div v-if="showChart" class="flex-1 min-h-[300px]">
      <GoogleChart
        :type="chartType"
        :data="chartData"
        :options="chartOptions"
        class="w-full h-full"
      />
    </div>
    <div v-else class="flex-1 min-h-[300px] flex items-center justify-center">
      <p class="text-gray-500 dark:text-gray-400">No data available</p>
    </div>

    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { ChartOptions } from '~/types/dashboard';

const props = defineProps({
  showChart: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    required: true
  },
  chartType: {
    type: String,
    default: 'LineChart'
  },
  chartData: {
    type: Array as PropType<Array<any>>,
    required: true
  },
  chartOptions: {
    type: Object as PropType<ChartOptions>,
    default: () => ({})
  },
  showRangeSelector: {
    type: Boolean,
    default: false
  },
  ranges: {
    type: Array as PropType<string[]>,
    default: () => ['This Month', 'Last 3 Months', 'Last 12 Months']
  }
});

const selectedRange = ref(props.ranges[0]);

// Emit events for parent component to handle
const emit = defineEmits(['range-change']);

// Watch for range changes
watch(selectedRange, (newRange) => {
  emit('range-change', newRange);
});
</script>
