<template>
  <div class="h-full w-full flex flex-col">
    <div class="px-4 pt-2 text-sm font-medium text-gray-700 dark:text-gray-300">CPU Usage</div>
    <div ref="chartContainer" class="flex-1 w-full relative min-h-0"></div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { ref, onMounted, watch, onUnmounted } from 'vue';

const props = defineProps<{
  data: Array<{ label: string; value: number }>;
  options?: {
    height?: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    colors?: string[];
  };
}>();

const chartContainer = ref<HTMLElement | null>(null);

// Default options
const defaultOptions = {
  height: 300,
  margin: { top: 20, right: 20, bottom: 50, left: 50 },
  colors: ['#3b82f6', '#93c5fd']
};

// Merge default and provided options
const chartOptions = { ...defaultOptions, ...props.options };

// Draw chart function
const drawChart = () => {
  if (!chartContainer.value || !props.data.length) return;

  // Clear previous chart
  d3.select(chartContainer.value).selectAll('*').remove();

  const width = chartContainer.value.clientWidth - chartOptions.margin.left - chartOptions.margin.right;
  const height = chartOptions.height - chartOptions.margin.top - chartOptions.margin.bottom;

  // Create SVG
  const svg = d3.select(chartContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width + chartOptions.margin.left + chartOptions.margin.right} ${height + chartOptions.margin.top + chartOptions.margin.bottom}`)
    .append('g')
    .attr('transform', `translate(${chartOptions.margin.left},${chartOptions.margin.top})`);

  // Create scales
  const x = d3.scaleBand()
    .domain(props.data.map(d => d.label))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, 100]) // CPU usage percentage (0-100%)
    .nice()
    .range([height, 0]);

  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

  // Add Y axis
  svg.append('g')
    .call(d3.axisLeft(y));

  // Add bars
  svg.selectAll('.bar')
    .data(props.data)
    .enter()
    .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', chartOptions.colors[0])
      .attr('rx', 2)
      .attr('ry', 2);

  // Add value labels
  svg.selectAll('.value-label')
    .data(props.data)
    .enter()
    .append('text')
      .attr('class', 'value-label text-xs font-medium')
      .attr('x', d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .text(d => `${d.value}%`);
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
  transition: fill 0.3s ease;
}

.bar:hover {
  opacity: 0.8;
}
</style>
