<template>
  <div class="h-full w-full flex flex-col">
    <div class="px-4 pt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Database Queries</div>
    <div ref="chartContainer" class="flex-1 w-full relative min-h-0"></div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { ref, onMounted, watch, onUnmounted } from 'vue';

const props = defineProps<{
  data: Array<{ date: Date; value: number }>;
  options?: {
    height?: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    colors?: {
      line: string;
      area: string;
      point: string;
    };
  };
}>();

const chartContainer = ref<HTMLElement | null>(null);

// Default options
const defaultOptions = {
  height: 300,
  margin: { top: 20, right: 20, bottom: 50, left: 60 },
  colors: {
    line: '#3b82f6',
    area: 'rgba(59, 130, 246, 0.2)',
    point: '#3b82f6'
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
  const x = d3.scaleTime()
    .domain(d3.extent(props.data, d => d.date) as [Date, Date])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(props.data, d => d.value) || 100])
    .nice()
    .range([height, 0]);

  // Create line generator
  const line = d3.line<{ date: Date; value: number }>()
    .x(d => x(d.date))
    .y(d => y(d.value))
    .curve(d3.curveMonotoneX);

  // Create area generator
  const area = d3.area<{ date: Date; value: number }>()
    .x(d => x(d.date))
    .y0(height)
    .y1(d => y(d.value))
    .curve(d3.curveMonotoneX);

  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  svg.append('g')
    .call(d3.axisLeft(y));

  // Add area
  svg.append('path')
    .datum(props.data)
    .attr('fill', chartOptions.colors.area)
    .attr('d', area);

  // Add line
  svg.append('path')
    .datum(props.data)
    .attr('fill', 'none')
    .attr('stroke', chartOptions.colors.line)
    .attr('stroke-width', 2)
    .attr('d', line);

  // Add points
  svg.selectAll('.point')
    .data(props.data)
    .enter()
    .append('circle')
      .attr('class', 'point')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.value))
      .attr('r', 3)
      .attr('fill', chartOptions.colors.point);

  // Add value labels for the last point
  if (props.data.length > 0) {
    const lastPoint = props.data[props.data.length - 1];
    svg.append('text')
      .attr('class', 'text-xs font-medium')
      .attr('x', x(lastPoint.date) + 10)
      .attr('y', y(lastPoint.value) - 5)
      .text(`${lastPoint.value} QPS`);
  }
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
.point {
  transition: r 0.2s ease;
}

.point:hover {
  r: 5;
  opacity: 0.8;
}
</style>
