<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-semibold">Rental Portfolios</h1>
        <UTooltip
          text="Group properties for organization and reporting. Most small landlords only need one portfolio."
          :content="{ side: 'right' }"
        >
          <UButton icon="i-heroicons-information-circle" color="neutral" variant="ghost" class="p-1" aria-label="About Portfolios"/>
        </UTooltip>
      </div>

      <div class="flex items-center gap-2">
        <UButton icon="i-heroicons-plus" @click="openCreate">New Portfolio</UButton>
      </div>
    </div>

    <!-- Controls -->
    <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2 overflow-x-auto">
        <UInput
          v-model="searchQuery"
          color="neutral"
          highlight
          placeholder="Search portfolios…"
          @input="onSearchInput"
          class="min-w-[240px]"
        >
          <template v-if="searchQuery?.length" #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-circle-x"
              aria-label="Clear"
              @click="clearSearch"
            />
          </template>
        </UInput>

        <USelect
          v-model="filterStatus"
          :items="statusFilterItems"
          class="min-w-[160px]"
          aria-label="Filter by status"
        />
        <USelect
          v-model="sortKey"
          :items="sortItems"
          class="min-w-[160px]"
          aria-label="Sort"
        />
      </div>

      <!-- View toggle -->
      <div class="flex items-center">
        <UButtonGroup size="sm">
          <button 
            :class="[
              'p-2 rounded-md',
              viewMode === 'grid' 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' 
                : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50'
            ]"
            @click="viewMode = 'grid'"
            aria-label="Grid view"
          >
            <UIcon name="i-lucide-layout-grid" class="w-5 h-5" />
          </button>
          <button
            :class="[
              'p-2 rounded-md',
              viewMode === 'list' 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' 
                : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50'
            ]"
            @click="viewMode = 'list'"
            aria-label="List view"
          >
            <UIcon name="i-lucide-list" class="w-5 h-5" />
          </button>
        </UButtonGroup>
      </div>
    </div>

    <!-- Content -->
    <div class="mt-4">
      <UCard v-if="pending">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <USkeleton class="h-28 rounded-xl" v-for="i in 3" :key="i" />
        </div>
      </UCard>

      <!-- Empty state -->
      <UCard v-else-if="filteredAndSorted.length === 0">
        <div class="py-10 flex flex-col items-center text-center gap-3">
          <div class="i-lucide-briefcase h-8 w-8 text-primary/80" aria-hidden="true" />
          <p class="text-lg font-medium">No portfolios yet</p>
          <p class="text-sm text-gray-500 max-w-md">
            Most small landlords start with a single portfolio. Create one now and add your properties later.
          </p>
          <UButton icon="i-heroicons-plus" class="mt-2" @click="openCreate">Create your first portfolio</UButton>
        </div>
      </UCard>

      <!-- GRID VIEW -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <UCard
          v-for="row in filteredAndSorted"
          :key="row.id"
          class="relative overflow-hidden group rounded-2xl"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <p class="font-semibold text-base leading-tight truncate max-w-[200px]">
                  {{ displayName(row) }}
                </p>
                <UBadge :color="row.status === 'Active' ? 'primary' : 'neutral'">
                  {{ row.status }}
                </UBadge>
              </div>
              <div class="text-xs text-gray-500 flex items-center gap-2">
                <span class="i-lucide-badge-percent h-4 w-4" aria-hidden="true" />
                <span>{{ row.subscription_plan || '—' }}</span>
              </div>
              <div class="text-xs text-gray-500 flex items-center gap-2">
                <span class="i-lucide-link-2 h-4 w-4" aria-hidden="true" />
                <span class="truncate max-w-[220px]">{{ row.provider_customer_id || 'No external ID' }}</span>
              </div>
            </div>

            <UDropdownMenu
              :content="{ align: 'end' }"
              :items="getRowItems({ original: row })"
              aria-label="Actions"
            >
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" class="-m-1" />
            </UDropdownMenu>
          </div>

          <div class="mt-4 flex gap-2">
            <UButton size="sm" variant="soft" icon="i-lucide-eye" @click="onView(row)">View</UButton>
            <UButton size="sm" variant="soft" icon="i-lucide-pencil" @click="onEdit(row)">Edit</UButton>
            <UButton size="sm" color="error" variant="soft" icon="i-lucide-trash" @click="onAskDelete(row)">Delete</UButton>
          </div>
        </UCard>
      </div>

      <!-- LIST VIEW -->
      <UCard v-else class="overflow-hidden">
        <UTable
          :data="filteredAndSorted"
          :columns="columns"
          class="flex-1"
          :loading="pending"
          loading-color="primary"
          loading-animation="carousel"
          :ui="{ th: 'bg-transparent', td: 'align-middle' }"
          :empty-state="{ icon: 'i-lucide-briefcase', label: 'No portfolios' }"
        />
      </UCard>
    </div>

    <div class="mt-2 text-xs text-gray-500">
      <div v-if="error">Error: {{ error?.message || error }}</div>
    </div>

    <!-- Modals -->
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
      :message="`Are you sure you want to delete portfolio “${selectedRow?.name || ('#' + deletingId)}”? This action cannot be undone.`"
      @update:open="(v: boolean) => { if (!v) { isDeleteOpen = false; deletingId = null; selectedRow = null } }"
      @confirm="confirmDelete"
      @cancel="() => { isDeleteOpen = false; deletingId = null; selectedRow = null }"
    />
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal.vue'
import PortfolioForm from '../components/portfolios/PortfolioForm.vue'
import { createProtectedApiClient } from '../utils/api'
import { useAuth } from '../composables/useAuth'

// Components are auto-imported in Nuxt 3

definePageMeta({ middleware: ['auth'] })

type PortfolioRow = {
  id: number | string
  name: string
  subscription_plan: string
  provider_customer_id: string
  status: string
}

/** --- State --- */
const api = createProtectedApiClient()
const { user, checkAuth } = useAuth()
await checkAuth()

const landlordId = computed(() => {
  const id = user.value?.id
  return typeof id === 'string' ? Number(id) : id
})

const displayName = (r: Partial<PortfolioRow>) => (r?.name && r.name.trim().length ? r.name : 'Untitled portfolio')

const searchQuery = ref('')
const filterStatus = ref<'all' | 'Active' | 'Archived'>('all')
const sortKey = ref<'name_asc' | 'name_desc' | 'recent'>('recent')
const viewMode = ref<'grid' | 'list'>('grid')

// removed explicit pagination; show all (typical is ≤3)
const { data: rows, pending, error, refresh } = await useAsyncData(
  'landlord-portfolios',
  async () => {
    if (!landlordId.value) return []
    const params = new URLSearchParams({
      // fetch generously; backend can still paginate internally if needed
      page: '1',
      limit: '100',
      search: searchQuery.value || ''
    })
    const endpoint = `/portfolios/landlord/${landlordId.value}?${params.toString()}`
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
      const mapped = (list || []).map((p: any) => ({
        id: p?.id,
        name: p?.name ?? '-',
        subscription_plan: p?.subscription_plan ?? '-',
        provider_customer_id: p?.provider_customer_id ?? '',
        status: p?.status ? (String(p.status).charAt(0).toUpperCase() + String(p.status).slice(1)) : 'Active'
      }))
      if (process.client) nextTick(() => console.log('[Portfolios] loaded:', mapped.length))
      return mapped
    }
  }
)

const rowsArray = computed<PortfolioRow[]>(() => Array.isArray(rows.value) ? rows.value as PortfolioRow[] : [])

/** --- Filters + Sort + Search (debounced) --- */
const statusFilterItems = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'Active' },
  { label: 'Archived', value: 'Archived' }
]

const sortItems = [
  { label: 'Recently Updated', value: 'recent' },
  { label: 'Name A → Z', value: 'name_asc' },
  { label: 'Name Z → A', value: 'name_desc' }
]

const filtered = computed(() => {
  let list = rowsArray.value
  if (filterStatus.value !== 'all') {
    list = list.filter(r => r.status === filterStatus.value)
  }
  if (searchQuery.value?.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r =>
      r.name?.toLowerCase().includes(q) ||
      r.subscription_plan?.toLowerCase().includes(q) ||
      r.provider_customer_id?.toLowerCase().includes(q)
    )
  }
  return list
})

const filteredAndSorted = computed<PortfolioRow[]>(() => {
  const list = [...filtered.value]
  switch (sortKey.value) {
    case 'name_asc':
      return list.sort((a, b) => a.name.localeCompare(b.name))
    case 'name_desc':
      return list.sort((a, b) => b.name.localeCompare(a.name))
    case 'recent':
    default:
      // if backend sends updated_at later, sort by it; for now fall back to id desc
      return list.sort((a: any, b: any) => Number(b.id) - Number(a.id))
  }
})

/** --- Columns for list view --- */
const columns: TableColumn<PortfolioRow>[] = [
  { 
    accessorKey: 'name', 
    header: 'Name',
    cell: ({ row }) => h('div', row.original.name)
  },
  { 
    accessorKey: 'subscription_plan', 
    header: 'Plan',
    cell: ({ row }) => h('div', row.original.subscription_plan || '—')
  },
  {
    accessorKey: 'provider_customer_id',
    header: 'External ID',
    cell: ({ row }) => h('div', row.original.provider_customer_id || '—')
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h('div', { class: 'flex items-center' }, [
      h('span', {
        class: [
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          row.original.status === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        ]
      }, row.original.status)
    ])
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const items = getRowItems(row)
      return h('div', { class: 'text-right' }, [
        h('div', { class: 'relative inline-block text-left' }, [
          h('div', [
            h('button', {
              class: 'flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
              'aria-label': 'Actions',
              onClick: (e: Event) => {
                e.stopPropagation()
                // Handle click to show dropdown
                const dropdown = document.getElementById(`dropdown-${row.original.id}`)
                if (dropdown) {
                  dropdown.classList.toggle('hidden')
                }
              }
            }, [
              h('span', { class: 'h-5 w-5 flex items-center justify-center' }, [
                h('svg', { 
                  xmlns: 'http://www.w3.org/2000/svg',
                  width: '20',
                  height: '20',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': '2',
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  class: 'lucide lucide-ellipsis-vertical'
                }, [
                  h('circle', { cx: '12', cy: '12', r: '1' }),
                  h('circle', { cx: '12', cy: '5', r: '1' }),
                  h('circle', { cx: '12', cy: '19', r: '1' })
                ])
              ])
            ])
          ]),
          h('div', {
            id: `dropdown-${row.original.id}`,
            class: 'hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10',
            role: 'menu',
            'aria-orientation': 'vertical',
            'aria-labelledby': 'menu-button',
            tabindex: -1
          }, items.map((item: any) => 
            h('div', { class: 'py-1', role: 'none' }, [
              h('a', {
                href: item.to || '#',
                class: [
                  'text-gray-700 dark:text-gray-200 block px-4 py-2 text-sm',
                  item.danger ? 'text-red-600 dark:text-red-400' : ''
                ],
                onClick: (e: Event) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (item.click) item.click()
                  const dropdown = document.getElementById(`dropdown-${row.original.id}`)
                  if (dropdown) dropdown.classList.add('hidden')
                }
              }, item.label)
            ])
          ))
        ])
      ])
    }
  }
]

/** --- Search debounce --- */
let searchDebounce: any
function onSearchInput () {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    refresh()
  }, 300)
}
function clearSearch () {
  searchQuery.value = ''
  refresh()
}

/** --- Actions --- */
const isFormOpen = ref(false)
const formModel = ref<any | null>(null)
const isViewing = ref(false)

const isDeleteOpen = ref(false)
const deletingId = ref<number | string | null>(null)
const selectedRow = ref<PortfolioRow | null>(null)
const isDeleting = ref(false)
const toast = useToast()

function openCreate() {
  formModel.value = null
  isViewing.value = false
  isFormOpen.value = true
}

function onView(row: PortfolioRow) {
  formModel.value = { ...row }
  isViewing.value = true
  isFormOpen.value = true
}
function onEdit(row: PortfolioRow) {
  formModel.value = { ...row }
  isViewing.value = false
  isFormOpen.value = true
}
function onAskDelete(row: PortfolioRow) {
  deletingId.value = row.id
  selectedRow.value = row
  isDeleteOpen.value = true
}

function onFormOpenChange(v: boolean) {
  if (!v) {
    formModel.value = null
    isViewing.value = false
  }
}

const onCreated = (created: any) => {
  // optimistic add
  rows.value = [{ 
    id: created?.id ?? Date.now(), 
    name: created?.name ?? 'New Portfolio', 
    subscription_plan: created?.subscription_plan ?? '-', 
    provider_customer_id: created?.provider_customer_id ?? '', 
    status: created?.status ?? 'Active' 
  }, ...(rowsArray.value || [])]
  refresh()
}

const onUpdated = (updated: any) => {
  const idx = rowsArray.value.findIndex((r: any) => r?.id === updated?.id)
  if (idx >= 0) {
    rows.value[idx] = { ...rows.value[idx], ...updated }
  }
  refresh()
}

function getRowItems(row: any) {
  const original = row.original || row
  return [
    { type: 'label', label: 'Actions' },
    { label: 'View', icon: 'i-lucide-eye', onSelect: () => onView(original) },
    { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => onEdit(original) },
    { type: 'separator' },
    { label: 'Delete', icon: 'i-lucide-trash', color: 'error', class: 'text-error', onSelect: () => onAskDelete(original) }
  ]
}

async function confirmDelete () {
  if (!deletingId.value) return
  try {
    isDeleting.value = true
    await api.delete(`/portfolios/${deletingId.value}`)
    toast.add({ title: `Portfolio deleted`, color: 'success', icon: 'i-lucide-check' })
    rows.value = rowsArray.value.filter(r => r.id !== deletingId.value)
    await refresh()
  } catch (e: any) {
    toast.add({ title: e?.data?.message || e?.message || 'Delete failed', color: 'error', icon: 'i-lucide-x' })
  } finally {
    isDeleting.value = false
    isDeleteOpen.value = false
    selectedRow.value = null
    deletingId.value = null
  }
}
</script>