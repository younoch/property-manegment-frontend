<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll">
    <div class="flex items-center justify-between gap-2">
      <UTooltip 
      text="Here you can add and manage the apartments or rooms you rent out. Each unit belongs to one of your properties."
      :content="{side: 'right'}"
      :ui="{content: 'text-sm text-primary-800 bg-white shadow-lg rounded-md p-3'}"
    >
      <div class="flex gap-2 cursor-pointer">
        <h1 class="text-2xl font-semibold">Units</h1>
        <UButton
          icon="i-heroicons-information-circle"
          color="neutral"
          variant="ghost"
          aria-label="About Units"
          class="p-1"
        />
      </div>
      </UTooltip>
      <UButton icon="i-heroicons-plus" @click="() => { formModel = null; isFormOpen = true }" :disabled="!selectedPortfolioId || !selectedPropertyId" >Add Unit</UButton>
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
        placeholder="Filter by Property (optional)"
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

    <UnitForm
      v-model:open="isFormOpen"
      :model="formModel"
      :view="isViewing"
      :portfolio-id="selectedPortfolioId"
      :property-id="selectedPropertyId"
      :portfolio-options="portfolioOptions"
      :property-options="propertyOptions"
      @created="onCreated"
    />
  </div>
  
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { h, resolveComponent, defineAsyncComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { createProtectedApiClient } from '../utils/api'
const UnitForm = defineAsyncComponent(() => import('~/components/units/UnitForm.vue'))
import { useAuth } from '../composables/useAuth'
import { getUnitStatusColor } from '../constants/units'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'label', header: 'Label' },
  { accessorKey: 'property_id', header: 'Property' },
  { accessorKey: 'bedrooms', header: 'Beds' },
  { accessorKey: 'bathrooms', header: 'Baths' },
  { accessorKey: 'sqft', header: 'Sqft' },
  { accessorKey: 'market_rent', header: 'Market Rent' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (cell: any) => {
      const status = cell.getValue() as string | undefined
      return h(
        UBadge,
        {
          color: getUnitStatusColor(status || 'vacant'),
          variant: 'soft',
        },
        {
          default: () => status || 'vacant',
        }
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: { align: 'end' },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]


const api = createProtectedApiClient()
const { user, checkAuth } = useAuth()
await checkAuth()

const landlordId = computed(() => {
  const id = user.value?.id
  return typeof id === 'string' ? Number(id) : id
})

const selectedPortfolioId = ref<number | undefined>(undefined)
const selectedPropertyId = ref<number | undefined>(undefined)
const isViewing = ref(false)
const isDeleteOpen = ref(false)

const { data: portfoliosResponse, pending, error } = await useAsyncData(
  'landlord-portfolios-for-units',
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
  const props = Array.isArray(selected?.properties) ? selected.properties : []
  return props.map((prop: any) => ({
    label: prop?.name ? `${prop.name} (#${prop.id})` : `Property #${prop.id}`,
    value: typeof prop?.id === 'string' ? Number(prop.id) : (prop?.id ?? 0)
  }))
})

// Units for selected portfolio & property
const units = ref<any[]>([])
const pendingUnits = ref(false)

async function loadUnits() {
  units.value = []
  const pid = selectedPortfolioId.value
  const propId = selectedPropertyId.value
  if (!pid || !propId) return
  try {
    pendingUnits.value = true
    const res = await api.get<any>(`/portfolios/${pid}/properties/${propId}/units`)
    const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? [])
    units.value = list || []

  } catch (e) {
    // error toast handled in api client
  } finally {
    pendingUnits.value = false
  }
}

function getRowItems(row: any) {
  const items = [
    { type: 'label', label: 'Actions' },
    {
      label: 'View',
      icon: 'i-lucide-eye',
      color: 'info',
      class: 'text-info',
      onSelect() {
        formModel.value = { ...row.original }
        isViewing.value = true
        isFormOpen.value = true
      }
    },
    {
      label: 'Edit',
      icon: 'i-lucide-pencil',
      color: 'primary',
      class: 'text-primary',
      onSelect() {
        formModel.value = { ...row.original }
        isViewing.value = false
        isFormOpen.value = true
      }
    }
  ]
  if (row.original.status === 'vacant') {
    items.push({
      label: 'Lease unit',
      icon: 'i-lucide-key',
      color: 'secondary',
      class: 'text-secondary',
      onSelect() {
        navigateTo(`/leases/new?unitId=${row.original.id}&propertyId=${row.original.property_id}&portfolioId=${row.original.portfolio_id}`)
      }
    })
  }
  items.push(
    { type: 'separator' },
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'error',
      class: 'text-error',
      onSelect() {
        deletingId.value = row.original.id
        isDeleteOpen.value = true
      }
    }
  )
  return items
}

watch(selectedPortfolioId, async (id, oldId) => {
  if (id !== oldId) {
    selectedPropertyId.value = undefined
  }
  await loadUnits()
}, { immediate: true })

watch(selectedPropertyId, async () => {
  await loadUnits()
})

const rowsArray = computed(() => {
  const allUnits = units.value || []
  if (selectedPropertyId.value) {
    return allUnits.filter((u: any) => (typeof u?.property_id === 'string' ? Number(u.property_id) : u?.property_id) === selectedPropertyId.value)
  }
  return allUnits
})

const loading = computed(() => pending.value || pendingUnits.value)

const isFormOpen = ref(false)
const formModel = ref<any | null>(null)


const onCreated = (created: any) => {
  units.value.unshift({ ...created })
}

</script>