<template>
  <div class="h-full w-full flex flex-col">
    <div class="px-4 pt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Memory Usage</div>
    <div ref="chartContainer" class="flex-1 w-full relative min-h-0"></div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { ref, onMounted, watch, onUnmounted } from 'vue';

const props = defineProps<{
  data: Array<{ label: string; value: number; total: number }>;
  options?: {
    height?: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    colors?: {
      used: string;
      total: string;
      text: string;
    };
  };
}>();

const chartContainer = ref<HTMLElement | null>(null);

// Default options
const defaultOptions = {
  height: 300,
  margin: { top: 20, right: 20, bottom: 50, left: 60 },
  colors: {
    used: '#3b82f6',
    total: '#e5e7eb',
    text: '#1f2937'
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
    .padding(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(props.data, d => d.total) || 100])
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

  // Add total memory bars (background)
  svg.selectAll('.bar-total')
    .data(props.data)
    .enter()
    .append('rect')
      .attr('class', 'bar-total')
      .attr('x', d => x(d.label) || 0)
      .attr('y', 0)
      .attr('width', x.bandwidth())
      .attr('height', height)
      .attr('fill', chartOptions.colors.total)
      .attr('rx', 2)
      .attr('ry', 2);

  // Add used memory bars
  svg.selectAll('.bar-used')
    .data(props.data)
    .enter()
    .append('rect')
      .attr('class', 'bar-used')
      .attr('x', d => x(d.label) || 0)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', chartOptions.colors.used)
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
      .attr('fill', chartOptions.colors.text)
      .text(d => `${d.value}GB / ${d.total}GB`);
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
.bar-used, .bar-total {
  transition: all 0.3s ease;
}

.bar-used:hover {
  opacity: 0.9;
}
</style>
