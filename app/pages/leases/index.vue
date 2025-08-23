<!-- app/pages/leases/index.vue -->
<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between gap-2">
      <UTooltip
        text="Create and manage lease agreements for a unit."
        :content="{ side: 'right' }"
      >
        <div class="flex gap-2 cursor-pointer">
          <h1 class="text-2xl font-semibold">Leases</h1>
          <UButton
            icon="i-heroicons-information-circle"
            color="neutral"
            variant="ghost"
            aria-label="About Leases"
            class="p-1"
          />
        </div>
      </UTooltip>
      <UButton icon="i-heroicons-plus" :disabled="!selectedPortfolioId || !selectedUnitId" @click="() => { formModel = null; isFormOpen = true }">Add Lease</UButton>
    </div>

    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <USelect
        v-model.number="selectedPortfolioId"
        :items="portfolioOptions"
        placeholder="Select Portfolio"
        class="min-w-[220px]"
      />

      <USelect
        v-model.number="selectedPropertyId"
        :items="propertyOptions"
        placeholder="Select Property"
        class="min-w-[220px]"
      />
      <USelect
        v-model.number="selectedUnitId"
        :items="unitOptions"
        placeholder="Select Unit"
        class="min-w-[220px]"
      />
    </div>

    <UCard>
      <UTable
        :data="rowsArray"
        :columns="columns"
        class="flex-1"
        :loading="loading"
        loading-color="primary"
        loading-animation="carousel"
      />
    </UCard>

    <div class="mt-2 text-xs text-gray-500">
      <div v-if="error">Error: {{ error?.message || error }}</div>
    </div>

    <LeaseForm
      v-model:open="isFormOpen"
      :portfolio-id="selectedPortfolioId"
      :unit-id="selectedUnitId"
      :portfolio-options="portfolioOptions"
      :unit-options="unitOptions"
      @created="onCreated"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { h, resolveComponent, defineAsyncComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { createProtectedApiClient } from '../../utils/api'
import { useAuth } from '../../composables/useAuth'
import { LEASE_STATUSES, getLeaseStatusColor } from '../../constants/leases'

// @ts-ignore - type shim for .vue handled globally
const LeaseForm = defineAsyncComponent(() => import('../../components/leases/LeaseForm.vue'))

const UButton = resolveComponent('UButton')

const columns: TableColumn<any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'start_date', header: 'Start' },
  { accessorKey: 'end_date', header: 'End' },
  { accessorKey: 'rent', header: 'Rent' },
  { accessorKey: 'deposit', header: 'Deposit' },
  { accessorKey: 'status', header: 'Status' }
]

const api = createProtectedApiClient()
const { user, checkAuth } = useAuth()
await checkAuth()

const landlordId = computed(() => {
  const id = user.value?.id
  return typeof id === 'string' ? Number(id) : id
})

const selectedPortfolioId = ref<number | undefined>(undefined)
const selectedUnitId = ref<number | undefined>(undefined)
const selectedPropertyId = ref<number | undefined>(undefined)

// Load portfolios with units
const { data: portfoliosResponse, pending, error } = await useAsyncData(
  'landlord-portfolios-for-leases',
  async () => {
    if (!landlordId.value) return []
    const endpoint = `/portfolios/landlord/${landlordId.value}`
    const res = await api.get<any>(endpoint)
    return res
  },
  {
    watch: [landlordId],
    server: false,
    immediate: true,
    transform: (res: any) => {
      const payload = res?.data ?? res
      const list = Array.isArray(payload) ? payload : (payload?.data ?? [])
      return list
    }
  }
)

const portfolios = computed(() => Array.isArray(portfoliosResponse.value) ? portfoliosResponse.value : [])
const portfolioOptions = computed(() => (portfolios.value || []).map((p: any) => ({
  label: p?.name ?? `Portfolio #${p?.id}`,
  value: typeof p?.id === 'string' ? Number(p.id) : (p?.id ?? 0)
})))

watch(portfolios, (list) => {
  const options = (list || []).map((p: any) => (typeof p?.id === 'string' ? Number(p.id) : p?.id)).filter((id: any) => Number.isFinite(id))
  if ((!selectedPortfolioId.value || !options.includes(selectedPortfolioId.value)) && options.length > 0) {
    selectedPortfolioId.value = options[0]
  }
})

const propertyOptions = computed(() => {
  const selected = portfolios.value.find((p: any) => p?.id === selectedPortfolioId.value)
  const properties = Array.isArray(selected?.properties) ? selected.properties : []
  return properties.map((p: any) => ({
    label: p?.name ? `${p.name} (#${p.id})` : `Property #${p.id}`,
    value: typeof p?.id === 'string' ? Number(p.id) : (p?.id ?? 0)
  }))
})

const unitOptions = computed(() => {
  const portfolio = portfolios.value.find((p: any) => p?.id === selectedPortfolioId.value)
  const properties = Array.isArray(portfolio?.properties) ? portfolio.properties : []
  const property = properties.find((pr: any) => (typeof pr?.id === 'string' ? Number(pr.id) : pr?.id) === selectedPropertyId.value)
  const units = Array.isArray(property?.units) ? property.units : []
  return units.map((u: any) => ({
    label: u?.label ? `${u.label} (#${u.id})` : `Unit #${u.id}`,
    value: typeof u?.id === 'string' ? Number(u.id) : (u?.id ?? 0)
  }))
})

// Leases list
const leases = ref<any[]>([])
const pendingLeases = ref(false)

async function loadLeases() {
  leases.value = []
  const pid = selectedPortfolioId.value
  const uid = selectedUnitId.value
  if (!pid || !uid) return
  try {
    pendingLeases.value = true
    const res = await api.get<any>(`/portfolios/${pid}/units/${uid}/leases`)
    const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? [])
    leases.value = list || []
  } catch (e) {
  } finally {
    pendingLeases.value = false
  }
}

watch(selectedPortfolioId, async (id, oldId) => {
  if (id !== oldId) {
    selectedPropertyId.value = undefined
    selectedUnitId.value = undefined
  }
  await loadLeases()
}, { immediate: true })

watch(selectedPropertyId, async (id, oldId) => {
  if (id !== oldId) selectedUnitId.value = undefined
  await loadLeases()
}, { immediate: true })

watch(selectedUnitId, async () => {
  await loadLeases()
})

const rowsArray = computed(() => leases.value || [])
const loading = computed(() => pending.value || pendingLeases.value)

const isFormOpen = ref(false)
const formModel = ref<any | null>(null)

const onCreated = (created: any) => {
  leases.value.unshift({ ...created })
}

</script>


