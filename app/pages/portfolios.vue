<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Rental Portfolios</h1>
      <UButton icon="i-heroicons-plus" @click="isAddOpen = true">New Portfolio</UButton>
    </div>
    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <UInput v-model="searchQuery" color="neutral" highlight placeholder="Search...">
        <template v-if="searchQuery?.length" #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-circle-x"
            aria-label="Clear input"
            @click="() => { searchQuery = ''; page = 1; refresh() }"
          />
        </template>
      </UInput>

      <UButton color="primary" icon="i-lucide-search" label="Search" @click="search" />
    </div>
    <UCard>
      <UTable
        :data="rowsArray"
        :columns="columns"
        class="flex-1"
        :loading="pending"
        loading-color="primary"
        loading-animation="carousel"
      />
      <div class="flex justify-center border-t border-default pt-4">
        <UPagination
          v-model:page="page"
          :items-per-page="limit"
          :total="total"
        />
      </div>
    </UCard>
    <div class="mt-2 text-xs text-gray-500">
      <div v-if="error">Error: {{ error?.message || error }}</div>
    </div>
    <AddPortfolioForm v-model:open="isAddOpen" @created="onCreated" />
  </div>
  
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { h, resolveComponent, nextTick } from 'vue'
import { useToast } from '#imports'
import type { TableColumn } from '@nuxt/ui'
import AddPortfolioForm from '../components/portfolios/AddPortfolioForm.vue'
import { createProtectedApiClient } from '../utils/api'
import { useAuth } from '../composables/useAuth'
import { useApiConfig } from '../composables/useApiConfig'

type PortfolioRow = {
  id: number | string
  name: string
  subscription_plan: string
  provider_customer_id: string
  properties: number
  status: string
}

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<PortfolioRow>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'subscription_plan', header: 'Plan' },
  { accessorKey: 'provider_customer_id', header: 'Provider ID' },
  { accessorKey: 'properties', header: 'Properties' },
  { accessorKey: 'status', header: 'Status' },
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
const landlordId = computed(() => {
  const id = user.value?.id
  return typeof id === 'string' ? Number(id) : id
})

// Ensure user is loaded before fetching portfolios (triggers /auth/whoami under the hood)
await checkAuth()

const page = ref(1)
const limit = ref(10)
const searchQuery = ref('')
const total = ref(0)

const { data: rows, pending, error, refresh } = await useAsyncData(
  'landlord-portfolios',
  async () => {
    if (!landlordId.value) return []
    const params = new URLSearchParams({
      page: String(page.value),
      limit: String(limit.value),
      search: searchQuery.value || ''
    })
    const endpoint = `/portfolios?${params.toString()}`
    const res = await api.get<any>(endpoint)
    return res
  },
  {
    watch: [landlordId, page, limit, searchQuery],
    server: false,
    immediate: true,
    transform: (res: any) => {
      // Supports both list and paginated shapes
      const payload = res?.data ?? res
      const list = Array.isArray(payload) ? payload : (payload?.data ?? [])
      total.value = Number(payload?.total ?? (Array.isArray(payload) ? payload.length : 0))
      const mapped = (list || []).map((p: any) => ({
        id: p?.id,
        name: p?.name ?? '-',
        subscription_plan: p?.subscription_plan ?? '-',
        provider_customer_id: p?.provider_customer_id ?? '-',
        properties: Array.isArray(p?.properties) ? p.properties.length : (p?.properties_count ?? 0),
        status: p?.status ? (String(p.status).charAt(0).toUpperCase() + String(p.status).slice(1)) : 'Active'
      }))
      if (process.client) {
        console.log('[Portfolios] Mapped rows:', mapped)
        nextTick(() => console.log('[Portfolios] rows length after set:', mapped.length))
      }
      return mapped
    }
  }
)

const rowsCount = computed(() => Array.isArray(rows.value) ? rows.value.length : 0)
const rowsArray = computed(() => Array.isArray(rows.value) ? rows.value : [])



const isAddOpen = ref(false)
const onCreated = (created: any) => {
  rows.value.unshift({
    name: created?.name ?? 'New Portfolio',
    properties: created?.properties ?? 0,
    value: created?.value ?? '-',
    status: 'Active'
  })
  // Optionally refresh from server to ensure consistency
  refresh()
}

function search() {
  page.value = 1
  refresh()
}

const toast = useToast()
function getRowItems(row: any) {
  return [
    { type: 'label', label: 'Actions' },
    {
      label: 'View',
      onSelect() {
        toast.add({ title: `View portfolio #${row.original.id}`, color: 'info', icon: 'i-lucide-eye' })
      }
    },
    {
      label: 'Edit',
      onSelect() {
        toast.add({ title: `Edit portfolio #${row.original.id}`, color: 'neutral', icon: 'i-lucide-pencil' })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete',
      onSelect() {
        toast.add({ title: `Delete portfolio #${row.original.id}`, color: 'error', icon: 'i-lucide-trash' })
      }
    }
  ]
}
</script>


