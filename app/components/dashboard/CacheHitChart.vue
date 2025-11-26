<template>
  <div class="h-full w-full flex flex-col">
    <div class="px-4 pt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cache Hit Ratio</div>
    <div ref="chartContainer" class="flex-1 w-full relative min-h-0"></div>
    <div class="px-4 pb-2 text-xs text-gray-500 text-center">
      <span class="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
      <span class="mr-4">Hits: {{ hitsPercentage }}%</span>
      <span class="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
      <span>Misses: {{ missesPercentage }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';

const props = defineProps<{
  data: Array<{ date: Date; hits: number; misses: number }>;
  options?: {
    height?: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    colors?: {
      hits: string;
      misses: string;
      text: string;
    };
  };
}>();

const chartContainer = ref<HTMLElement | null>(null);

// Default options
const defaultOptions = {
  height: 300,
  margin: { top: 20, right: 20, bottom: 60, left: 60 },
  colors: {
    hits: '#10b981',
    misses: '#ef4444',
    text: '#1f2937'
  }
};

// Merge default and provided options
const chartOptions = { ...defaultOptions, ...props.options };

// Computed properties for percentages
const hitsPercentage = computed(() => {
  if (!props.data.length) return 0;
  const last = props.data[props.data.length - 1];
  const total = last.hits + last.misses;
  return total > 0 ? Math.round((last.hits / total) * 100) : 0;
});

const missesPercentage = computed(() => 100 - hitsPercentage.value);

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

  // Stack the data
  const stack = d3.stack()
    .keys(['hits', 'misses'])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetExpand);

  const stackedData = stack(props.data as any);

  // Create scales
  const x = d3.scaleTime()
    .domain(d3.extent(props.data, d => d.date) as [Date, Date])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

  // Create area generator
  const area = d3.area<[number, number]>()
    .x((d, i) => x(props.data[i].date))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))
    .curve(d3.curveBasis);

  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis with percentage
  svg.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.0%')));

  // Create color scale
  const color = d3.scaleOrdinal()
    .domain(['hits', 'misses'])
    .range([chartOptions.colors.hits, chartOptions.colors.misses]);

  // Add areas
  const areas = svg.selectAll('.area')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('class', 'area');

  areas.append('path')
    .attr('d', d => area(d as any))
    .attr('fill', d => color(d.key) as string)
    .attr('opacity', 0.8);

  // Add value labels for the last point
  if (props.data.length > 0) {
    const lastPoint = props.data[props.data.length - 1];
    const total = lastPoint.hits + lastPoint.misses;
    
    if (total > 0) {
      const hitsY = y(1 - (lastPoint.hits / total));
      const missesY = y(1);
      
      // Hits label
      svg.append('text')
        .attr('class', 'text-xs font-medium')
        .attr('x', x(lastPoint.date) + 5)
        .attr('y', hitsY - 5)
        .attr('fill', chartOptions.colors.text)
        .text(`${Math.round((lastPoint.hits / total) * 100)}% hits`);
        
      // Misses label
      svg.append('text')
        .attr('class', 'text-xs font-medium')
        .attr('x', x(lastPoint.date) + 5)
        .attr('y', missesY - 5)
        .attr('fill', chartOptions.colors.text)
        .text(`${Math.round((lastPoint.misses / total) * 100)}% misses`);
    }
  }

  // Add legend
  const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width - 100}, ${-15})`);

  const legendItems = [
    { label: 'Hits', color: chartOptions.colors.hits },
    { label: 'Misses', color: chartOptions.colors.misses }
  ];

  legend.selectAll('.legend-item')
    .data(legendItems)
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(0, ${i * 20})`)
    .each(function(d) {
      const g = d3.select(this);
      g.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', d.color);
      g.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .attr('fill', chartOptions.colors.text)
        .text(d.label);
    });
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
.area {
  transition: opacity 0.3s ease;
}

.area:hover {
  opacity: 0.9;
}

.legend-item {
  font-size: 12px;
  cursor: default;
}
</style>
