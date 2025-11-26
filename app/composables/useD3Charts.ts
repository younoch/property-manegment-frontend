import * as d3 from 'd3';
import type { Ref } from 'vue';

export interface ChartOptions {
  colors?: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  xTicks?: number;
  yTicks?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  yFormat?: (d: any) => string;
  title?: string;
}

export function useD3Charts() {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  let resizeObserver: ResizeObserver | null = null;

  // Clean up chart and event listeners
  const cleanupChart = (element: HTMLElement | null) => {
    if (!element) return;
    
    // Remove any existing SVG
    d3.select(element).selectAll('*').remove();
    
    // Clean up resize observer if it exists
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  };

  // Handle window resize for responsive charts
  const setupResizeObserver = (element: HTMLElement, drawFunction: () => void) => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    
    // Create a debounced resize handler
    const debouncedDraw = debounce(() => {
      drawFunction();
    }, 200);
    
    resizeObserver = new ResizeObserver(debouncedDraw);
    resizeObserver.observe(element);
    
    // Also listen to window resize for cases where the container size changes
    // due to layout changes rather than viewport changes
    window.addEventListener('resize', debouncedDraw);
    
    // Return cleanup function
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      window.removeEventListener('resize', debouncedDraw);
    };
  };

  // Simple debounce helper
  const debounce = <F extends (...args: any[]) => any>(func: F, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return function(this: ThisParameterType<F>, ...args: Parameters<F>) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Create a line chart
  const createLineChart = async (
    element: HTMLElement,
    data: any[][],
    options: ChartOptions = {}
  ) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      // Skip if no data
      if (!data || data.length <= 1) {
        console.warn('No data available for line chart');
        return;
      }

      // Clean up any existing chart
      cleanupChart(element);
      
      // Set up dimensions and margins
      const width = element.clientWidth;
      const height = element.clientHeight || 300;
      const margin = options.margin || { top: 20, right: 30, bottom: 50, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Create SVG
      const svg = d3.select(element)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Parse the date / time
      const parseTime = d3.timeParse('%Y-%m-%d');
      
      // Format the data
      const headers = data[0];
      const series = headers.slice(1); // Skip the first column which is the x-axis
      
      const formattedData = data.slice(1).map(d => {
        const item: any = { date: d[0] };
        for (let i = 0; i < series.length; i++) {
          item[series[i]] = +d[i + 1];
        }
        return item;
      });

      // Set the ranges
      const x = d3.scaleTime()
        .range([0, innerWidth]);
      
      const y = d3.scaleLinear()
        .range([innerHeight, 0]);

      // Define the line
      const line = d3.line()
        .x((d: any) => x(d.date))
        .y((d: any) => y(d.value));

      // Scale the range of the data
      const allValues = formattedData.flatMap(d => 
        series.map(s => d[s])
      ).filter(v => !isNaN(v));
      
      x.domain(d3.extent(formattedData, d => d.date) as [Date, Date]);
      y.domain([
        d3.min(allValues, d => d) as number * 0.95, // Add some padding
        d3.max(allValues, d => d) as number * 1.05  // Add some padding
      ]);

      // Add the X Axis
      const xAxis = d3.axisBottom(x)
        .ticks(options.xTicks || 5)
        .tickFormat(d3.timeFormat('%b %Y') as any);
      
      // Add the Y Axis
      const yAxis = d3.axisLeft(y)
        .ticks(options.yTicks || 5);
      
      // Add the X Axis
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-45)');
      
      // Add the Y Axis
      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
      
      // Add X axis label
      if (options.xAxisLabel) {
        svg.append('text')
          .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.top + 20})`)
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(options.xAxisLabel);
      }
      
      // Add Y axis label
      if (options.yAxisLabel) {
        svg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - margin.left)
          .attr('x', 0 - (innerHeight / 2))
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(options.yAxisLabel);
      }
      
      // Add the lines with theme-aware styling
      const colorScale = d3.scaleOrdinal<string>()
        .domain(series)
        .range(options.colors || d3.schemeCategory10);
      
      // Add grid lines for better readability
      const yGrid = d3.axisLeft(y)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
        .ticks(5);
      
      svg.append('g')
        .attr('class', 'grid')
        .call(yGrid)
        .selectAll('line')
          .style('stroke', 'var(--color-gray-100, #F3F4F6)') // Tailwind gray-100
          .style('shape-rendering', 'crispEdges')
          .style('stroke-dasharray', '2,2');
      
      // Add the lines with theme-aware styling
      series.forEach((s, i) => {
        const lineData = formattedData.map(d => ({
          date: d.date,
          value: d[s]
        }));

        const linePath = d3.line()
          .x((d: any) => x(d.date))
          .y((d: any) => y(d.value));

        // Add the line path
        svg.append('path')
          .datum(lineData)
          .attr('class', 'line')
          .style('fill', 'none')
          .style('stroke', colorScale(s))
          .style('stroke-width', 2)
          .style('stroke-linecap', 'round')
          .style('stroke-linejoin', 'round')
          .attr('d', linePath as any);
          
        // Add interactive dots
        const dotGroup = svg.append('g')
          .attr('class', `dots-${i}`);
        
        dotGroup.selectAll(`.dot-${i}`)
          .data(formattedData)
          .enter()
          .append('circle')
            .attr('class', `dot dot-${i}`)
            .attr('cx', (d: any) => x(d.date))
            .attr('cy', (d: any) => y(d[s]))
            .attr('r', 3)
            .style('fill', options.colors?.[i] || d3.schemeCategory10[i])
            .style('opacity', 0.8)
            .style('stroke', 'white')
            .style('stroke-width', 1.5);
        
        // Add hover effects
        dotGroup.selectAll(`.dot-${i}`)
          .on('mouseover', function() {
            d3.select(this)
              .transition()
              .duration(150)
              .attr('r', 5)
              .style('opacity', 1);
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(150)
              .attr('r', 3)
              .style('opacity', 0.8);
          });
      });
      
      // Add a title
      if (options.title) {
        svg.append('text')
          .attr('x', innerWidth / 2)
          .attr('y', 0 - (margin.top / 2))
          .attr('text-anchor', 'middle')
          .style('font-size', '14px')
          .style('font-weight', 'bold')
          .text(options.title);
      }
      
      // Set up responsive behavior
      setupResizeObserver(element, () => {
        createLineChart(element, data, options);
      });
      
    } catch (err) {
      console.error('Error creating line chart:', err);
      error.value = err as Error;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Create a grouped bar chart
  const createGroupedBarChart = async (
    element: HTMLElement,
    data: any[][],
    options: ChartOptions = {}
  ) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      // Skip if no data
      if (!data || data.length <= 1) {
        console.warn('No data available for bar chart');
        return;
      }

      // Clean up any existing chart
      cleanupChart(element);
      
      // Set up dimensions and margins
      const width = element.clientWidth;
      const height = element.clientHeight || 300;
      const margin = options.margin || { top: 20, right: 30, bottom: 50, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Create SVG
      const svg = d3.select(element)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Format the data
      const headers = data[0];
      const groups = data.slice(1).map(d => d[0]); // First column is the group
      const series = headers.slice(1); // Skip the first column which is the group
      
      const formattedData = data.slice(1).map((d, i) => {
        const item: any = { group: d[0] };
        for (let j = 0; j < series.length; j++) {
          item[series[j]] = +d[j + 1];
        }
        return item;
      });

      // Set up the X scale for groups
      const x0 = d3.scaleBand()
        .domain(groups)
        .rangeRound([0, innerWidth])
        .paddingInner(0.1);
        
      // Set up the X scale for subgroups
      const x1 = d3.scaleBand()
        .domain(series)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05);
      
      // Set up the Y scale
      const y = d3.scaleLinear()
        .range([innerHeight, 0]);
      
      // Get all values for the Y domain
      const allValues = formattedData.flatMap(d => 
        series.map(s => d[s])
      ).filter(v => !isNaN(v));
      
      y.domain([0, d3.max(allValues) as number * 1.1]); // Add 10% padding
      
      // Add the X Axis
      const xAxis = d3.axisBottom(x0);
      
      // Add the Y Axis
      const yAxis = d3.axisLeft(y)
        .ticks(options.yTicks || 5);
      
      // Add the X Axis
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-45)');
      
      // Add the Y Axis
      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
      
      // Add X axis label
      if (options.xAxisLabel) {
        svg.append('text')
          .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.top + 20})`)
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(options.xAxisLabel);
      }
      
      // Add Y axis label
      if (options.yAxisLabel) {
        svg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - margin.left)
          .attr('x', 0 - (innerHeight / 2))
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(options.yAxisLabel);
      }
      
      // Create a group for each group of bars
      const group = svg.selectAll('.group')
        .data(formattedData)
        .enter().append('g')
        .attr('class', 'group')
        .attr('transform', d => `translate(${x0(d.group)},0)`);
      
      // Create a rect for each series
      series.forEach((s, i) => {
        group.append('rect')
          .attr('class', 'bar')
          .attr('x', d => x1(s) || 0)
          .attr('y', d => y(d[s]) || 0)
          .attr('width', x1.bandwidth())
          .attr('height', d => innerHeight - (y(d[s]) || 0))
          .style('fill', options.colors?.[i] || d3.schemeCategory10[i])
          .style('opacity', 0.8);
          
        // Add value labels
        group.append('text')
          .attr('x', d => (x1(s) || 0) + x1.bandwidth() / 2)
          .attr('y', d => (y(d[s]) || 0) - 5)
          .attr('text-anchor', 'middle')
          .style('font-size', '10px')
          .text(d => options.yFormat ? options.yFormat(d[s]) : d[s]);
      });
      
      // Add a legend
      const legend = svg.selectAll('.legend')
        .data(series)
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0,${i * 20})`);
        
      legend.append('rect')
        .attr('x', innerWidth - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', (d, i) => options.colors?.[i] || d3.schemeCategory10[i]);
        
      legend.append('text')
        .attr('x', innerWidth - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(d => d);
      
      // Add a title
      if (options.title) {
        svg.append('text')
          .attr('x', innerWidth / 2)
          .attr('y', 0 - (margin.top / 2))
          .attr('text-anchor', 'middle')
          .style('font-size', '14px')
          .style('font-weight', 'bold')
          .text(options.title);
      }
      
      // Set up responsive behavior
      setupResizeObserver(element, () => {
        createGroupedBarChart(element, data, options);
      });
      
    } catch (err) {
      console.error('Error creating bar chart:', err);
      error.value = err as Error;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    createLineChart,
    createGroupedBarChart,
    cleanupChart,
    isLoading: readonly(isLoading),
    error: readonly(error) as Readonly<Ref<Error | null>>
  };
}
