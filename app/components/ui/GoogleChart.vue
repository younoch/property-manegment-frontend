<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useGoogleCharts } from '../../../composables/useGoogleCharts'

type ChartType = 'LineChart' | 'ColumnChart' | 'BarChart' | 'PieChart' | 'Table' | 'ComboChart'

const props = withDefaults(defineProps<{
  type: ChartType
  data: (string | number | Date)[][]
  options?: Record<string, any>
  wrapperClass?: string
  autoResize?: boolean
}>(), {
  options: () => ({}),
  wrapperClass: 'w-full h-[150px] sm:h-[300px] relative',
  autoResize: true
})

const emit = defineEmits<{
  (e: 'ready'): void
  (e: 'error', err: Error): void
  (e: 'loading', isLoading: boolean): void
}>()

const wrapperEl = ref<HTMLDivElement | null>(null)
const chartEl = ref<HTMLDivElement | null>(null)
const { loadGoogleCharts, isLoading, error } = useGoogleCharts()

let chart: any = null
let ro: ResizeObserver | null = null

const draw = async () => {
  // SSR guard + safety
  if (typeof window === 'undefined' || !chartEl.value) return
  
  const { google } = window as any
  if (!google?.visualization) {
    await loadGoogleCharts()
    await nextTick()
    return draw()
  }

  try {
    const dataTable = google.visualization.arrayToDataTable(props.data)
    const Ctor = google.visualization[props.type]
    
    if (!Ctor) {
      throw new Error(`Unknown Google Chart type: ${props.type}`)
    }
    
    if (chart) {
      // Update existing chart
      chart.draw(dataTable, props.options || {})
    } else {
      // Create new chart instance
      chart = new Ctor(chartEl.value)
      chart.draw(dataTable, props.options || {})
    }
    
    emit('ready')
  } catch (err: any) {
    const error = err instanceof Error ? err : new Error('Failed to draw chart')
    emit('error', error)
    console.error('Google Chart error:', error)
  }
}

// Handle window resize with debounce
const handleResize = debounce(() => {
  if (chart) {
    draw()
  }
}, 150)

// Initialize the chart
const initChart = async () => {
  try {
    emit('loading', true)
    await loadGoogleCharts()
    await nextTick()
    await draw()
    
    // Set up resize observer for container
    if (props.autoResize && 'ResizeObserver' in window && wrapperEl.value) {
      ro = new ResizeObserver(handleResize)
      ro.observe(wrapperEl.value)
    }
  } catch (err: any) {
    const error = err instanceof Error ? err : new Error('Failed to initialize chart')
    emit('error', error)
  } finally {
    emit('loading', false)
  }
}

// Watch for data changes
watch(
  [() => props.data, () => props.options, () => props.type],
  () => {
    if (chart) {
      draw()
    } else {
      initChart()
    }
  },
  { deep: true }
)

// Initialize on mount
onMounted(initChart)

// Clean up
onBeforeUnmount(() => {
  if (ro) {
    ro.disconnect()
    ro = null
  }
  
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
  
  if (chart) {
    if (chart.clearChart) {
      chart.clearChart()
    }
    chart = null
  }
})

// Simple debounce helper
function debounce<F extends (...args: any[]) => any>(fn: F, delay: number): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return function(...args: Parameters<F>) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
</script>

<template>
  <div :class="wrapperClass || 'w-full h-[150px] sm:h-[300px] relative' " ref="wrapperEl">
    <div ref="chartEl" class="w-full h-full" />
  </div>
</template>
