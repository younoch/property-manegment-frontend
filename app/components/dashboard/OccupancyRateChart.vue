<template>
  <div class="flex-1 flex flex-col min-h-0">
    <div v-if="!occupancyData.length" class="h-full flex items-center justify-center text-gray-500">
      <p>No occupancy data available</p>
    </div>
    <div v-else class="h-full w-full flex flex-col">
      <div class="px-4 pt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Occupancy Rate</div>
      <div ref="chartContainer" class="flex-1 w-full relative min-h-0"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';

const props = defineProps({
  occupancyData: {
    type: Array as () => Array<{ label: string; value: number }>,
    required: true
  },
  occupancyChartOptions: {
    type: Object,
    required: true
  }
});

const chartContainer = ref<HTMLElement | null>(null);
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
let resizeObserver: ResizeObserver;

const drawChart = () => {
  if (!chartContainer.value || !props.occupancyData.length) return;
  
  // Clear previous chart
  d3.select(chartContainer.value).select('svg').remove();
  
  // Set up dimensions
  const container = chartContainer.value;
  const width = container.clientWidth;
  const height = container.clientHeight - 30; // Account for title
  const margin = { top: 10, right: 20, bottom: 30, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create SVG
  svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Prepare data
  const data = props.occupancyData;
  
  // Set up scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, innerWidth])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, 100]) // Occupancy rate is typically 0-100%
    .nice()
    .range([innerHeight, 0]);

  // Create line generator
  const line = d3.line<{ label: string; value: number }>()
    .x(d => (x(d.label) || 0) + x.bandwidth() / 2)
    .y(d => y(d.value));

  // Add line path
  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#3b82f6') // blue-500
    .attr('stroke-width', 2)
    .attr('d', line);

  // Add circles for data points
  g.selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => (x(d.label) || 0) + x.bandwidth() / 2)
    .attr('cy', d => y(d.value))
    .attr('r', 4)
    .attr('fill', '#3b82f6') // blue-500
    .attr('stroke', 'white')
    .attr('stroke-width', 1);

  // Add x-axis with styled labels
  const xAxis = g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .style('color', '#9ca3af'); // gray-400
    
  // Style x-axis text
  xAxis.selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .style('font-size', '11px')
    .attr('transform', 'rotate(-45)');

  // Add y-axis with percentage
  g.append('g')
    .attr('class', 'text-gray-600 text-xs')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`));

  // Add grid lines
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y)
      .tickSize(-innerWidth)
      .tickFormat(() => '')
      .tickValues(y.ticks(5)) as any
    )
    .selectAll('line')
    .attr('stroke', '#e5e7eb') // gray-200
    .attr('stroke-dasharray', '2,2');
};

// Watch for data changes
watch(() => [...props.occupancyData], () => {
  drawChart();
}, { deep: true });

// Handle window resize
const handleResize = () => {
  if (chartContainer.value) {
    drawChart();
  }
};

onMounted(() => {
  // Initial draw
  nextTick(() => {
    drawChart();
    
    // Set up resize observer
    resizeObserver = new ResizeObserver(handleResize);
    if (chartContainer.value) {
      resizeObserver.observe(chartContainer.value);
    }
  });
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped>
.grid line {
  stroke: #e5e7eb;
  stroke-opacity: 0.7;
  shape-rendering: crispEdges;
}
</style>
