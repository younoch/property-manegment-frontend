<template>
  <div class="h-full w-full flex flex-col">
    <div class="px-4 pt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Top Endpoints by Error</div>
    <div ref="chartContainer" class="flex-1 w-full relative min-h-0"></div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { ref, onMounted, watch, onUnmounted } from 'vue';

const props = defineProps<{
  data: Array<{ endpoint: string; errors: number }>;
  options?: {
    height?: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    colors?: {
      bar: string;
      text: string;
      background: string;
    };
  };
}>();

const chartContainer = ref<HTMLElement | null>(null);

// Default options
const defaultOptions = {
  height: 300,
  margin: { top: 20, right: 100, bottom: 40, left: 150 },
  colors: {
    bar: '#ef4444',
    text: '#1f2937',
    background: 'transparent'
  }
};

// Merge default and provided options
const chartOptions = { ...defaultOptions, ...props.options };

// Draw chart function
const drawChart = () => {
  if (!chartContainer.value || !props.data.length) return;

  // Clear previous chart
  d3.select(chartContainer.value).selectAll('*').remove();

  const width = chartContainer.value.clientWidth - chartOptions.margin.left - chartOptions.margin.right;
  const height = Math.max(
    props.data.length * 30, // Minimum height based on number of bars
    chartOptions.height - chartOptions.margin.top - chartOptions.margin.bottom
  );

  // Create SVG
  const svg = d3.select(chartContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width + chartOptions.margin.left + chartOptions.margin.right} ${height + chartOptions.margin.top + chartOptions.margin.bottom}`)
    .append('g')
    .attr('transform', `translate(${chartOptions.margin.left},${chartOptions.margin.top})`);

  // Sort data by error count (descending)
  const sortedData = [...props.data].sort((a, b) => b.errors - a.errors);

  // Create scales
  const x = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.errors) * 1.1] as [number, number])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(sortedData.map(d => d.endpoint))
    .range([0, height])
    .padding(0.2);

  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5))
    .selectAll('text')
      .attr('fill', chartOptions.colors.text);

  // Add Y axis
  svg.append('g')
    .call(d3.axisLeft(y))
    .selectAll('text')
      .attr('fill', chartOptions.colors.text)
      .style('font-size', '12px');

  // Add bars
  svg.selectAll('.bar')
    .data(sortedData)
    .enter()
    .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d.endpoint) || 0)
      .attr('width', d => x(d.errors))
      .attr('height', y.bandwidth())
      .attr('fill', chartOptions.colors.bar)
      .attr('rx', 2)
      .attr('ry', 2);

  // Add value labels at the end of each bar
  svg.selectAll('.value-label')
    .data(sortedData)
    .enter()
    .append('text')
      .attr('class', 'value-label')
      .attr('x', d => x(d.errors) + 5)
      .attr('y', d => (y(d.endpoint) || 0) + y.bandwidth() / 2 + 4)
      .attr('fill', chartOptions.colors.text)
      .style('font-size', '12px')
      .style('font-weight', '500')
      .text(d => d.errors);

  // Add axis labels
  svg.append('text')
    .attr('transform', `translate(${width / 2}, ${height + chartOptions.margin.bottom - 10})`)
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('fill', chartOptions.colors.text)
    .text('Number of Errors');
};

// Watch for data changes
watch(() => [...props.data], () => {
  drawChart();
}, { deep: true });

// Handle window resize
const handleResize = () => {
  drawChart();
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  drawChart();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.bar {
  transition: width 0.3s ease, opacity 0.3s ease;
  opacity: 0.8;
}

.bar:hover {
  opacity: 1;
}

.value-label {
  transition: opacity 0.3s ease;
}
</style>
