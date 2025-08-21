<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between gap-2">
      <UTooltip
        text="Group properties for organization and reporting. Each portfolio can contain many properties."
        :content="{ side: 'right' }"
      >
        <div class="flex gap-2 cursor-pointer">
          <h1 class="text-2xl font-semibold">Rental Portfolios</h1>
          <UButton
            icon="i-heroicons-information-circle"
            color="neutral"
            variant="ghost"
            aria-label="About Portfolios"
            class="p-1"
          />
        </div>
      </UTooltip>
      <UButton icon="i-heroicons-plus" @click="() => { formModel = null; isFormOpen = true }">New Portfolio</UButton>
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
    <PortfolioForm
      v-model:open="isFormOpen"
      :model="formModel"
      :view="isViewing"
      @created="onCreated"
      @updated="onUpdated"
      @update:open="onFormOpenChange"
    />
    <ConfirmDeleteModal
      :open="isDeleteOpen"
      :loading="isDeleting"
      title="Delete Portfolio"
      :message="`Are you sure you want to delete portfolio #${deletingId}? This action cannot be undone.`"
      @update:open="(v: boolean) => { if (!v) { isDeleteOpen = false; deletingId = null } }"
      @confirm="confirmDelete"
      @cancel="() => { isDeleteOpen = false; deletingId = null }"
    />
  </div>
  
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { h, resolveComponent, nextTick } from 'vue'
import { useToast } from '#imports'
import type { TableColumn } from '@nuxt/ui'
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal.vue'
import PortfolioForm from '../components/portfolios/PortfolioForm.vue'
import { createProtectedApiClient } from '../utils/api'
import { useAuth } from '../composables/useAuth'

type PortfolioRow = {
  id: number | string
  name: string
  subscription_plan: string
  provider_customer_id: string
  status: string
}

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<PortfolioRow>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'subscription_plan', header: 'Plan' },
  { accessorKey: 'provider_customer_id', header: 'Provider ID' },
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
    const endpoint = `/portfolios/landlord/${landlordId.value}?${params.toString()}`
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



const isFormOpen = ref(false)
const formModel = ref<any | null>(null)
const isViewing = ref(false)
const isDeleteOpen = ref(false)
const deletingId = ref<number | string | null>(null)
const isDeleting = ref(false)
const onCreated = (created: any) => {
  rows.value.unshift({
    name: created?.name ?? 'New Portfolio',
    value: created?.value ?? '-',
    status: 'Active'
  })
  // Optionally refresh from server to ensure consistency
  refresh()
}

const onUpdated = (updated: any) => {
  // Update in place if present
  const idx = Array.isArray(rows.value) ? rows.value.findIndex((r: any) => r?.id === updated?.id) : -1
  if (idx >= 0) {
    rows.value[idx] = {
      ...rows.value[idx],
      name: updated?.name ?? rows.value[idx].name,
      subscription_plan: updated?.subscription_plan ?? rows.value[idx].subscription_plan,
      provider_customer_id: updated?.provider_customer_id ?? rows.value[idx].provider_customer_id,
      status: updated?.status ?? rows.value[idx].status
    }
  }
  refresh()
}

function onFormOpenChange(v: boolean) {
  if (!v) {
    // Reset model on close
    formModel.value = null
    isViewing.value = false
  }
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
    },
    {
      type: 'separator'
    },
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
  ]
}

async function confirmDelete() {
  if (!deletingId.value) return
  try {
    isDeleting.value = true
    await api.delete(`/portfolios/${deletingId.value}`)
    toast.add({ title: `Portfolio #${deletingId.value} deleted`, color: 'success', icon: 'i-lucide-check' })
    // Remove from local array for instant UI feedback
    if (Array.isArray(rows.value)) {
      const idx = rows.value.findIndex((r: any) => r?.id === deletingId.value)
      if (idx >= 0) rows.value.splice(idx, 1)
    }
    // Refresh to ensure consistency
    await refresh()
  } catch (e: any) {
    toast.add({ title: e?.data?.message || e?.message || 'Delete failed', color: 'error', icon: 'i-lucide-x' })
  } finally {
    isDeleting.value = false
    isDeleteOpen.value = false
    deletingId.value = null
  }
}
</script>


