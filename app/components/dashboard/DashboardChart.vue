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
      <div class="text-center p-4">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p class="text-sm text-red-600 dark:text-red-400 font-medium mb-1">Failed to load chart</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 max-w-xs mx-auto">
          {{ error.message || 'An unexpected error occurred' }}
        </p>
        <UButton 
          color="gray" 
          variant="ghost" 
          size="sm" 
          class="mt-1"
          @click="loadChart(true)"
          :loading="isLoading"
        >
          <template #leading>
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
          </template>
          {{ isLoading ? 'Retrying...' : 'Retry' }}
        </UButton>
      </div>
    </div>
    <div v-else class="flex-1 min-h-[150px] sm:min-h-[300px] relative">
      <div ref="chartEl" class="w-full h-full"></div>
      <div v-if="isLoading" class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
        <div class="flex flex-col items-center gap-2">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary-500" />
          <span class="text-sm text-gray-500 dark:text-gray-400">Updating chart...</span>
        </div>
      </div>
    </div>

    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import * as d3 from 'd3';
import type { PropType } from 'vue';
import type { ChartOptions } from '~/types/dashboard';
import { useD3Charts } from '~/composables/useD3Charts';
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
    default: 'line'
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

// Use D3 charts composable
const { 
  createGroupedBarChart, 
  createLineChart, 
  cleanupChart, 
  isLoading, 
  error: chartError
} = useD3Charts();

// Local error state
const error = ref<Error | null>(null);

// Emit events for parent component to handle
const emit = defineEmits(['range-change']);

// Map chart options to d3 compatible format
const d3ChartOptions = computed(() => {
  // Safely access nested properties with fallbacks
  const chartOptions = props.chartOptions || {};
  const hAxis = chartOptions.hAxis || {};
  const vAxis = chartOptions.vAxis || {};
  
  // Handle gridlines safely
  const hGridlines = (hAxis as any).gridlines || {};
  const vGridlines = (vAxis as any).gridlines || {};
  
  // Get format with fallback
  const vFormat = (vAxis as any).format || '';
  
  // Base options with type safety
  const baseOptions: any = {
    ...chartOptions,
    colors: Array.isArray(chartOptions.colors) ? chartOptions.colors : [],
    xAxisLabel: hAxis.title || '',
    yAxisLabel: vAxis.title || '',
    xTicks: typeof hGridlines.count === 'number' ? hGridlines.count : undefined,
    yTicks: typeof vGridlines.count === 'number' ? vGridlines.count : undefined,
    yFormat: (d: number) => {
      if (typeof vFormat === 'string' && vFormat.includes('%')) {
        return d3.format('.0%')(d);
      } else if (typeof vFormat === 'string' && vFormat.includes('currency')) {
        return d3.format('$,.0f')(d);
      }
      return d3.format(',.0f')(d);
    }
  };

  return baseOptions;
});

// Draw the chart when data or container changes
const drawChart = async () => {
  error.value = null;
  // If DOM not mounted yet (SSR or before mount), skip without error
  if (!chartEl.value) {
    return;
  }
  
  if (!props.showChart) {
    console.log('[DEBUG] Chart rendering is disabled (showChart=false)');
    cleanupChart(chartEl.value);
    return;
  }
  
  // Validate chart data, silently skip if insufficient
  if (!Array.isArray(props.chartData) || props.chartData.length <= 1) {
    cleanupChart(chartEl.value);
    return;
  }

  try {
    // Clear any existing chart
    cleanupChart(chartEl.value);
    
    // Format data for D3
    const formattedData = formatChartData(props.chartData);
    
    // Create the appropriate chart type
    if (props.chartType.toLowerCase().includes('bar') || props.chartType === 'ColumnChart') {
      await createGroupedBarChart(chartEl.value, formattedData, d3ChartOptions.value);
    } else {
      // Default to line chart
      await createLineChart(chartEl.value, formattedData, d3ChartOptions.value);
    }
  } catch (err) {
    const errorMsg = 'Failed to render chart';
    console.error(`[ERROR] ${errorMsg}:`, err);
    error.value = err instanceof Error ? err : new Error(String(err));
  }
};

// Load and draw chart when component is mounted
const loadChart = async (fromButton = false) => {
  if (fromButton) {
    console.log('[DEBUG] loadChart called from button or parent');
  }
  
  if (!props.showChart) {
    if (chartEl.value) {
      cleanupChart(chartEl.value);
    }
    return;
  }
  
  isLoading.value = true;
  error.value = null;
  
  try {
    // Wait for next tick to ensure DOM is updated
    await nextTick();
    
    if (fromButton) {
      console.log('[DEBUG] loadChart - redrawing chart');
    }
    
    // Draw the chart
    await drawChart();
  } catch (err) {
    const errorMsg = fromButton ? 'Error in loadChart:' : 'Error loading chart:';
    console.error(errorMsg, err);
    error.value = err instanceof Error ? err : new Error(String(err));
  } finally {
    isLoading.value = false;
  }
};

// Format chart data for D3
const formatChartData = (data: any[][]) => {
  try {
    // If the first row contains headers and the rest contains data
    if (data.length > 0 && Array.isArray(data[0])) {
      return data;
    }
    
    // Handle case where data might be in a different format
    console.warn('Unexpected chart data format, attempting to convert');
    return [];
  } catch (err) {
    console.error('Error formatting chart data:', err);
    error.value = new Error('Invalid chart data format');
    return [];
  }
};

// Determine when chart has enough data and is allowed to render
const isRenderable = computed(() => {
  return (
    !!props.showChart &&
    Array.isArray(props.chartData) &&
    props.chartData.length > 1
  );
});

// Watch for any relevant prop changes and redraw
watch(
  [() => props.chartData, () => props.chartOptions, () => props.chartType],
  async () => {
    if (!isRenderable.value) return;
    await nextTick();
    error.value = null;
    await drawChart();
  },
  { deep: true }
);

// Specifically watch renderability flip (e.g., after data arrives or showChart toggles)
watch(
  () => isRenderable.value,
  async (canRender) => {
    if (!canRender) return;
    await nextTick();
    error.value = null;
    await drawChart();
  },
  { immediate: true }
);

// Draw once on mount
onMounted(async () => {
  if (!isRenderable.value) return;
  await nextTick();
  error.value = null;
  await drawChart();
});

// Watch for range changes
watch(selectedRange, (newRange) => {
  emit('range-change', newRange);
});

// Expose method to parent component
defineExpose({
  loadChart
});
</script>
