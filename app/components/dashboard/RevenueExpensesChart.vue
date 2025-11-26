<template>
  <div class="flex-1 flex flex-col min-h-0">
    <div v-if="chartData.length === 0" class="h-full flex flex-col items-center justify-center text-gray-500 p-4 text-center">
      <p>No data available for the selected period</p>
      <p class="text-sm mt-2">Please select a different date range or check back later for more data.</p>
    </div>
    <div v-else class="h-full w-full flex flex-col">
      <div class="px-4 pt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Revenue vs Expenses</div>
      <div ref="chartContainer" class="flex-1 w-full relative min-h-0">
        <!-- Debug info (only visible in development) -->
        <div v-if="isDev" class="absolute bottom-0 left-0 p-2 bg-black bg-opacity-50 text-white text-xs">
          Data points: {{ chartData.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

// Color scheme
const colors = {
  revenue: '#4f46e5',      // Indigo-600
  revenueHover: '#4338ca', // Indigo-700
  expenses: '#10b981',     // Emerald-500
  expensesHover: '#059669',// Emerald-600
  text: '#4b5563',         // Gray-600
  axis: '#9ca3af',         // Gray-400
  background: 'transparent'
};

// Debug helper
const isDev = import.meta.env.DEV;

interface MonthlyData {
  year: number;
  month: number;
  amount: number;
  label: string;
}

interface ChartDataPoint {
  label: string;
  revenue: number;
  expenses: number;
}

const props = defineProps<{
  monthlyRevenue: MonthlyData[];
  monthlyExpenses: MonthlyData[];
  chartOptions?: any;
}>()

// Combine revenue and expenses data by month
const chartData = computed<ChartDataPoint[]>(() => {
  console.log('[RevenueExpensesChart] Combining data...');
  const revenueMap = new Map<string, number>();
  const expensesMap = new Map<string, number>();
  
  // Process revenue data
  console.log('[RevenueExpensesChart] Processing revenue data:', props.monthlyRevenue);
  props.monthlyRevenue?.forEach(item => {
    if (item?.label !== undefined && item?.amount !== undefined) {
      revenueMap.set(item.label, item.amount);
    }
  });
  
  // Process expenses data
  console.log('[RevenueExpensesChart] Processing expenses data:', props.monthlyExpenses);
  props.monthlyExpenses?.forEach(item => {
    if (item?.label !== undefined && item?.amount !== undefined) {
      expensesMap.set(item.label, item.amount);
    }
  });
  
  // Get all unique months
  const allMonths = Array.from(new Set([...revenueMap.keys(), ...expensesMap.keys()]));
  console.log('[RevenueExpensesChart] All unique months:', allMonths);
  
  // Sort months chronologically
  allMonths.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  const result = allMonths.map(month => ({
    label: month,
    revenue: revenueMap.get(month) || 0,
    expenses: expensesMap.get(month) || 0
  }));
  
  return result;
});

const chartContainer = ref<HTMLElement | null>(null);
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
let resizeObserver: ResizeObserver;

const drawChart = () => {
  if (!chartContainer.value) {
    return;
  }
  
  if (chartData.value.length === 0) {
    return;
  }
  
  // Clear previous chart
  d3.select(chartContainer.value).selectAll('*').remove();
  
  // Set up dimensions
  const width = chartContainer.value.clientWidth;
  const height = chartContainer.value.clientHeight;
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create SVG
  svg = d3.select(chartContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Prepare data
  const data = chartData.value;
  
  // Set up scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, innerWidth])
    .padding(data.length === 1 ? 0.4 : 0.2); // More padding for single bar

  // Find max value between revenue and expenses for the y-axis
  const maxValue = d3.max(data, d => Math.max(d.revenue, d.expenses)) || 0;
  
  const y = d3.scaleLinear()
    .domain([0, maxValue * 1.1]) // Add 10% padding at the top
    .nice()
    .range([innerHeight, 0]);

  // Add bars for revenue
  g.selectAll('.revenue-bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'transition-colors')
    .attr('fill', colors.revenue)
    .on('mouseover', function() { d3.select(this).attr('fill', colors.revenueHover) })
    .on('mouseout', function() { d3.select(this).attr('fill', colors.revenue) })
    .attr('x', d => (x(d.label) || 0) + (data.length === 1 ? x.bandwidth() * 0.25 : 0))
    .attr('y', d => y(d.revenue))
    .attr('width', data.length === 1 ? x.bandwidth() * 0.5 : x.bandwidth() / 2 - 2)
    .attr('height', d => innerHeight - y(d.revenue))
    .attr('rx', 2) // Rounded corners
    .attr('ry', 2);

  // Add bars for expenses
  g.selectAll('.expense-bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'transition-colors')
    .attr('fill', colors.expenses)
    .on('mouseover', function() { d3.select(this).attr('fill', colors.expensesHover) })
    .on('mouseout', function() { d3.select(this).attr('fill', colors.expenses) })
    .attr('x', d => (x(d.label) || 0) + (data.length === 1 ? x.bandwidth() * 0.25 : x.bandwidth() / 2 + 2))
    .attr('y', d => y(d.expenses))
    .attr('width', data.length === 1 ? x.bandwidth() * 0.5 : x.bandwidth() / 2 - 2)
    .attr('height', d => innerHeight - y(d.expenses))
    .attr('rx', 2) // Rounded corners
    .attr('ry', 2);

  // Add value labels on top of bars
  g.selectAll('.revenue-text')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'text-xs font-medium')
    .style('fill', colors.text)
    .attr('x', d => (x(d.label) || 0) + (data.length === 1 ? x.bandwidth() * 0.5 : x.bandwidth() / 4))
    .attr('y', d => y(d.revenue) - 5)
    .attr('text-anchor', 'middle')
    .text(d => `$${d.revenue}`);

  g.selectAll('.expense-text')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'text-xs font-medium')
    .style('fill', colors.text)
    .attr('x', d => (x(d.label) || 0) + (data.length === 1 ? x.bandwidth() * 0.5 : x.bandwidth() * 0.75))
    .attr('y', d => y(d.expenses) - 5)
    .attr('text-anchor', 'middle')
    .text(d => `$${d.expenses}`);

  // Add legend
  const legend = g.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${innerWidth - 100}, 10)`);

  // Revenue legend
  legend.append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', colors.revenue);

  legend.append('text')
    .attr('x', 15)
    .attr('y', 9)
    .text('Revenue');

  // Expenses legend
  legend.append('rect')
    .attr('y', 15)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', colors.expenses);

  legend.append('text')
    .attr('x', 15)
    .attr('y', 24)
    .text('Expenses');

  // Add x-axis with labels
  const xAxis = g.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .style('color', colors.axis);
    
  // Style x-axis text
  xAxis.selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-45)');

  // Add y-axis
  g.append('g')
    .attr('class', 'y axis')
    .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => ''))
    .style('color', colors.axis)
    .selectAll('line')
      .style('stroke', colors.axis)
      .style('opacity', 0.2)
      .style('stroke-dasharray', '2,2');
};

// Watch for data changes
watch([() => props.monthlyRevenue, () => props.monthlyExpenses], () => {
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
  drawChart();
  
  // Set up resize observer
  resizeObserver = new ResizeObserver(() => {
    drawChart();
  });
  
  if (chartContainer.value) {
    resizeObserver.observe(chartContainer.value);
  }
});

onUnmounted(() => {
  console.log('[RevenueExpensesChart] Component unmounting');
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>
