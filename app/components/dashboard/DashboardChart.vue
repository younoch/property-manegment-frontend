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

    <div v-if="!showChart" class="flex-1 min-h-[150px] sm:min-h-[300px] flex items-center justify-center">
      <p class="text-gray-500 dark:text-gray-400">No data available</p>
    </div>
    <div v-else-if="isLoading" class="flex-1 min-h-[150px] sm:min-h-[300px] flex items-center justify-center">
      <div class="flex flex-col items-center gap-2">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
        <p class="text-sm text-gray-500 dark:text-gray-400">Loading chart...</p>
      </div>
    </div>
    <div v-else-if="error" class="flex-1 min-h-[150px] sm:min-h-[300px] flex items-center justify-center">
      <div class="text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p class="text-sm text-red-500">Failed to load chart</p>
        <UButton 
          color="gray" 
          variant="ghost" 
          size="sm" 
          class="mt-2"
          @click="loadChart"
        >
          <template #leading>
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
          </template>
          Retry
        </UButton>
      </div>
    </div>
    <div v-else class="flex-1 min-h-[150px] sm:min-h-[300px]">
      <div ref="chartEl" class="w-full h-full"></div>
    </div>

    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import type { PropType } from 'vue';
import type { ChartOptions } from '~/types/dashboard';
import { useGoogleCharts } from '@/composables/useGoogleCharts';

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
const chartEl = ref<HTMLElement | null>(null);

// Use Google Charts composable
const { loadGoogleCharts, isGoogleChartsLoaded, isLoading, error } = useGoogleCharts();

// Emit events for parent component to handle
const emit = defineEmits(['range-change']);

// Draw the chart when data or container changes
const drawChart = async () => {
  if (!chartEl.value || !isGoogleChartsLoaded.value || !props.showChart) return;
  
  try {
    const { google } = window as any;
    
    // Convert chart data to DataTable format if it's not already
    const data = google.visualization.arrayToDataTable(props.chartData);
    
    // Create and draw the chart
    const chart = new google.visualization[props.chartType](
      chartEl.value,
      props.chartOptions
    );
    
    chart.draw(data, props.chartOptions);
    
    // Handle window resize
    const handleResize = () => {
      chart.draw(data, props.chartOptions);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      // Clean up the chart to prevent memory leaks
      if (chart.clearChart) {
        chart.clearChart();
      }
    });
  } catch (err) {
    console.error('Error drawing chart:', err);
  }
};

// Load chart when component is mounted
onMounted(async () => {
  if (props.showChart) {
    await loadGoogleCharts();
    await nextTick();
    drawChart();
  }
});

// Watch for data changes
watch(
  [() => props.chartData, () => props.chartOptions, () => props.showChart],
  async () => {
    if (props.showChart) {
      await nextTick();
      drawChart();
    }
  },
  { deep: true }
);

// Watch for range changes
watch(selectedRange, (newRange) => {
  emit('range-change', newRange);
});

// Public method to reload the chart
const loadChart = async () => {
  await loadGoogleCharts();
  await nextTick();
  drawChart();
};

// Expose method to parent component
defineExpose({
  loadChart
});
</script>
