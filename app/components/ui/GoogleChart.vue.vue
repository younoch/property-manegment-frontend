<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

type ChartType = 'LineChart' | 'ColumnChart' | 'BarChart' | 'PieChart' | 'Table' | 'ComboChart'

const props = defineProps<{
  type: ChartType
  data: (string | number | Date)[][]
  options?: Record<string, any>
  /** Tailwind classes for the outer wrapper (sets size). Default: w-full h-[300px] */
  wrapperClass?: string
}>()

const emit = defineEmits<{
  (e: 'ready'): void
  (e: 'error', err: Error): void
}>()

const wrapperEl = ref<HTMLDivElement | null>(null)
const chartEl = ref<HTMLDivElement | null>(null)

let chart: any = null
let ro: ResizeObserver | null = null

const draw = () => {
  // SSR guard + safety
  if (typeof window === 'undefined') return
  // @ts-ignore
  const google = (window as any).google
  if (!google?.visualization || !chartEl.value) return

  try {
    const dataTable = google.visualization.arrayToDataTable(props.data)
    const Ctor = google.visualization[props.type]
    if (!Ctor) throw new Error(`Unknown Google Chart type: ${props.type}`)
    chart = new Ctor(chartEl.value)
    chart.draw(dataTable, props.options || {})
    emit('ready')
  } catch (err: any) {
    emit('error', err)
    // Optional: console.error(err)
  }
}

const nuxtApp = useNuxtApp()

onMounted(async () => {
  try {
    await nuxtApp.$googleChartsReady()
    draw()
    // Redraw when the container resizes (more robust than window resize)
    if ('ResizeObserver' in window && wrapperEl.value) {
      ro = new ResizeObserver(() => draw())
      ro.observe(wrapperEl.value)
    } else {
      // fallback
      window.addEventListener('resize', draw)
    }
  } catch (err: any) {
    emit('error', err)
  }
})

watch(
  () => [props.type, props.options, props.data],
  () => draw(),
  { deep: true }
)

onBeforeUnmount(() => {
  if (ro) ro.disconnect()
  else if (typeof window !== 'undefined') window.removeEventListener('resize', draw)
  chart = null
})
</script>

<template>
  <div :class="wrapperClass || 'w-full h-[300px] relative' " ref="wrapperEl">
    <div ref="chartEl" class="w-full h-full" />
  </div>
</template>
