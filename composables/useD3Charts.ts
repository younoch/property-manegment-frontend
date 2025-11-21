import * as d3 from 'd3';
import { ref, onUnmounted } from 'vue';

export interface D3ChartOptions {
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  xAxisLabel?: string;
  yAxisLabel?: string;
  colors?: string[];
  xTicks?: number;
  yTicks?: number;
  xFormat?: (d: any) => string;
  yFormat?: (d: any) => string;
  tooltipFormat?: (d: any) => string;
}

export function useD3Charts() {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  
  // Cleanup function to remove existing chart
  const cleanupChart = (container: HTMLElement) => {
    d3.select(container).selectAll('*').remove();
  };

  // Create a grouped bar chart
  const createGroupedBarChart = (
    container: HTMLElement,
    data: any[][],
    options: D3ChartOptions = {}
  ) => {
    try {
      cleanupChart(container);
      
      // Set up dimensions and margins
      const width = options.width || container.clientWidth;
      const height = options.height || 400;
      const margin = options.margin || { top: 30, right: 30, bottom: 60, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const colors = options.colors || ['#4ade80', '#f87171'];
      
      // Create SVG
      const svg = d3.select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      
      // Skip header row
      const chartData = data.slice(1);
      
      // Extract categories (months) and series names
      const categories = chartData.map(d => {
        const date = d[0];
        return date instanceof Date ? date : new Date(date);
      });
      
      const seriesNames = data[0].slice(1); // Skip the first column (date)
      
      // Set up scales
      const x0 = d3.scaleBand()
        .domain(categories.map((d, i) => i))
        .range([0, innerWidth])
        .padding(0.2);
        
      const x1 = d3.scaleBand()
        .domain(seriesNames.map((_, i) => i.toString()))
        .range([0, x0.bandwidth()])
        .padding(0.05);
        
      const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => Math.max(...d.slice(1) as number[])) || 0])
        .nice()
        .range([innerHeight, 0]);

      // Gridlines
      svg.append('g')
        .attr('class', 'y-grid')
        .call(
          d3.axisLeft(y)
            .ticks(options.yTicks || 5)
            .tickSize(-innerWidth)
            .tickFormat(() => '') as any
        )
        .selectAll('line')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-opacity', 1);
      svg.selectAll('.y-grid .domain').remove();

      // Add X axis
      const xAxis = d3.axisBottom(x0)
        .tickFormat((d, i) => {
          if (options.xFormat) return options.xFormat(categories[i]);
          return d3.timeFormat('%b %Y')(categories[+d]);
        })
        .tickSizeOuter(0);
      
      if (options.xTicks) {
        xAxis.ticks(options.xTicks);
      }
      
      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-45)');
      
      // Add Y axis
      const yAxis = d3.axisLeft(y)
        .tickFormat(d => {
          if (options.yFormat) return options.yFormat(d);
          return d3.format('$,.0f')(+d);
        });
      
      if (options.yTicks) {
        yAxis.ticks(options.yTicks);
      }
      
      svg.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);
      
      // Create a group for each category
      const categoryGroups = svg.selectAll('.category-group')
        .data(chartData)
        .enter()
        .append('g')
        .attr('class', 'category-group')
        .attr('transform', (d, i) => `translate(${x0(i)},0)`);
      
      // Tooltip
      const tooltip = d3.select(container)
        .append('div')
        .attr('class', 'd3-tooltip')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('background', 'rgba(17,24,39,0.9)')
        .style('color', '#fff')
        .style('padding', '6px 8px')
        .style('font-size', '12px')
        .style('border-radius', '6px')
        .style('opacity', 0);

      // Add bars for each series with transition and tooltip
      seriesNames.forEach((seriesName, seriesIndex) => {
        const series = categoryGroups
          .append('rect')
          .attr('class', `bar series-${seriesIndex}`)
          .attr('x', x1(seriesIndex.toString()) || 0)
          .attr('y', innerHeight)
          .attr('width', x1.bandwidth())
          .attr('height', 0)
          .attr('fill', colors[seriesIndex % colors.length])
          .attr('rx', 2)
          .attr('ry', 2)
          .on('mousemove', function (event, d: any) {
            const val = d[seriesIndex + 1] as number;
            const month = categories[chartData.indexOf(d)];
            const content = options.tooltipFormat
              ? options.tooltipFormat({ label: seriesName, value: val, date: month })
              : `${seriesName}: ${d3.format('$,.0f')(val)}\n${d3.timeFormat('%b %Y')(month)}`;
            tooltip
              .style('opacity', 1)
              .html(content.replace(/\n/g, '<br/>'))
              .style('left', event.offsetX + 16 + 'px')
              .style('top', event.offsetY - 28 + 'px');
          })
          .on('mouseleave', function () {
            tooltip.style('opacity', 0);
          });

        series
          .transition()
          .duration(500)
          .attr('y', (d: any) => y(d[seriesIndex + 1] as number) || 0)
          .attr('height', (d: any) => innerHeight - (y(d[seriesIndex + 1] as number) || 0));
      });
      
      // Add axis labels
      if (options.xAxisLabel) {
        svg.append('text')
          .attr('class', 'axis-label x')
          .attr('x', innerWidth / 2)
          .attr('y', innerHeight + margin.bottom - 10)
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', '#6b7280')
          .text(options.xAxisLabel);
      }
      
      if (options.yAxisLabel) {
        svg.append('text')
          .attr('class', 'axis-label y')
          .attr('transform', 'rotate(-90)')
          .attr('y', -margin.left + 15)
          .attr('x', -innerHeight / 2)
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', '#6b7280')
          .text(options.yAxisLabel);
      }
      
      // Add legend
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(0, -20)`);
      
      const legendItems = legend.selectAll('.legend-item')
        .data(seriesNames)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(${i * 120}, 0)`);
      
      legendItems.append('rect')
        .attr('x', 0)
        .attr('width', 12)
        .attr('height', 12)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('fill', (d, i) => colors[i % colors.length]);
      
      legendItems.append('text')
        .attr('x', 20)
        .attr('y', 9)
        .style('font-size', '12px')
        .style('fill', '#6b7280')
        .text(d => d);
      
      // Handle window resize
      const handleResize = () => {
        if (container.clientWidth !== width) {
          cleanupChart(container);
          createGroupedBarChart(container, data, { ...options, width: container.clientWidth });
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup event listener on component unmount
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        d3.select(container).selectAll('.d3-tooltip').remove();
      });
      
      return { svg };
    } catch (err) {
      console.error('Error creating grouped bar chart:', err);
      error.value = err as Error;
      return null;
    }
  };
  
  // Create a line chart
  const createLineChart = (
    container: HTMLElement,
    data: any[][],
    options: D3ChartOptions = {}
  ) => {
    try {
      cleanupChart(container);
      
      // Set up dimensions and margins
      const width = options.width || container.clientWidth;
      const height = options.height || 400;
      const margin = options.margin || { top: 30, right: 30, bottom: 60, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const colors = options.colors || ['#3b82f6'];
      
      // Create SVG
      const svg = d3.select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      
      // Skip header row and filter out invalid data
      const chartData = data.slice(1).filter(d => d[0] && d[1] !== undefined);
      
      // Parse dates and values
      const parsedData = chartData.map(d => ({
        date: d[0] instanceof Date ? d[0] : new Date(d[0]),
        value: +d[1]
      }));
      
      // Set up scales
      const x = d3.scaleTime()
        .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
        .range([0, innerWidth]);
          .attr('y', innerHeight + margin.bottom - 10)
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', '#6b7280')
          .text(options.xAxisLabel);
      }
      
      if (options.yAxisLabel) {
        svg.append('text')
          .attr('class', 'axis-label y')
          .attr('transform', 'rotate(-90)')
          .attr('y', -margin.left + 15)
          .attr('x', -innerHeight / 2)
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', '#6b7280')
          .text(options.yAxisLabel);
      }
      
      // Handle window resize
      const handleResize = () => {
        if (container.clientWidth !== width) {
          cleanupChart(container);
          createLineChart(container, data, { ...options, width: container.clientWidth });
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup event listener on component unmount
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        d3.select(container).selectAll('.d3-tooltip').remove();
      });
      
      return { svg };
    } catch (err) {
      console.error('Error creating line chart:', err);
      error.value = err as Error;
      return null;
    }
  };
  
  return {
    isLoading,
    error,
    createGroupedBarChart,
    createLineChart,
    cleanupChart
  };
}
