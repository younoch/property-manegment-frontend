<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 overflow-scroll">
    <div class="flex items-center justify-between gap-2">
      <UTooltip
        text="Manage tenant information and contact details. Tenants are associated with portfolios and can be assigned to units."
        :content="{ side: 'right' }"
      >
        <div class="flex gap-2 cursor-pointer">
          <h1 class="text-xl md:text-2xl font-semibold">Tenants</h1>
          <UButton
            icon="i-heroicons-information-circle"
            color="neutral"
            variant="ghost"
            aria-label="About Tenants"
            class="p-1"
          />
        </div>
      </UTooltip>
      <UButton icon="i-heroicons-plus" @click="() => { formModel = null; isViewing = false; isFormOpen = true }" :disabled="!selectedPortfolioId" >Add Tenant</UButton>
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
            @click="() => { searchQuery = '' }"
          />
        </template>
      </UInput>

      <UButton color="primary" icon="i-lucide-search" label="Search" @click="search" />

      <!-- Portfolio Filter/Selector -->
      <USelect
        v-model.string="selectedPortfolioId"
        :items="portfolioOptions"
        placeholder="All Portfolios"
        class="min-w-[220px]"
      />
    </div>

    <UCard>
      <div v-if="pending">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <USkeleton class="h-28 rounded-xl" v-for="i in 3" :key="i" />
        </div>
      </div>
      <div v-else-if="rowsArray.length === 0" class="py-10 flex flex-col items-center text-center gap-3">
        <div class="i-lucide-users h-12 w-12 text-primary/80" aria-hidden="true" />
        <p class="text-lg font-medium">No tenants yet</p>
        <p class="text-sm text-gray-500 max-w-md">
          Add your first tenant to start managing their information, leases, and communications.
        </p>
        <UButton 
          icon="i-heroicons-plus" 
          class="mt-2" 
          @click="() => { formModel = null; isViewing = false; isFormOpen = true }"
          :disabled="!selectedPortfolioId"
        >
          Add Your First Tenant
        </UButton>
      </div>
      <UTable
        v-else
        :data="rowsArray"
        :columns="columns"
        class="flex-1"
        :loading="pending"
        loading-color="primary"
        loading-animation="carousel"
        :ui="{ td: 'py-2 px-4' }"
      />
    </UCard>

    <div class="mt-2 text-xs text-gray-500">
      <div v-if="error">Error: {{ error?.message || error }}</div>
    </div>

    <ConfirmDeleteModal
      :open="isDeleteOpen"
      :loading="isDeleting"
      title="Delete Tenant"
      :message="`Are you sure you want to delete tenant ${deletingTenant?.first_name} ${deletingTenant?.last_name}? This action cannot be undone.`"
      @update:open="(v: boolean) => { if (!v) { isDeleteOpen = false; deletingTenant = null } }"
      @confirm="confirmDelete"
      @cancel="() => { isDeleteOpen = false; deletingTenant = null }"
    />

    <TenantForm
      v-model:open="isFormOpen"
      :model="formModel"
      :view="isViewing"
      :portfolio-id="selectedPortfolioId"
      :portfolio-options="portfolioOptions"
      @created="onCreated"
      @updated="onUpdated"
      @deleted="onDeleted"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { h, resolveComponent, nextTick, ref, computed, watch, defineAsyncComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'
import { createProtectedApiClient } from '@/utils/api'
import { useAuth } from '@/composables/useAuth'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const TenantForm = defineAsyncComponent(() => import('@/components/tenants/TenantForm.vue'))

const columns: TableColumn<any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'first_name', header: 'First Name' },
  { accessorKey: 'last_name', header: 'Last Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { 
    accessorKey: 'is_active', 
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original?.is_active
      return h('span', {
        class: `px-2 py-1 text-xs font-medium rounded-full ${
          isActive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`
      }, isActive ? 'Active' : 'Inactive')
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

const searchQuery = ref('')

// Fetch portfolios and tenants
const { data: portfoliosResponse, pending, error } = await useAsyncData(
  'landlord-portfolios-with-tenants',
  async () => {
    if (!user.value?.id) return []
    const endpoint = `/portfolios/landlord/${user.value.id}`
    const res = await api.get<any>(endpoint)
    return res
  },
  {
    watch: [user],
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
// Tenants list for selected portfolio
const tenants = ref<any[]>([])
const pendingTenants = ref(false)

async function loadTenants() {
  tenants.value = []
  const pid = selectedPortfolioId.value
  if (!pid) return
  try {
    pendingTenants.value = true
    const res = await api.get<any>(`/portfolios/${pid}/tenants`)
    const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? [])
    tenants.value = list || []
  } catch (e) {
  } finally {
    pendingTenants.value = false
  }
}

const rowsArray = computed(() => {
  const q = (searchQuery.value || '').toLowerCase()
  const src = tenants.value || []
  if (!q) return src
  return src.filter((t: any) =>
    String(t?.first_name || '').toLowerCase().includes(q) ||
    String(t?.last_name || '').toLowerCase().includes(q) ||
    String(t?.email || '').toLowerCase().includes(q)
  )
})

// Portfolio options for TenantForm
const portfolioOptions = computed(() => (portfolios.value || []).map((p: any) => ({
  label: p?.name ?? `Portfolio #${p?.id}`,
  value: String(p?.id ?? '')
})))
const selectedPortfolioId = ref<string>('')

watch(portfolios, (list) => {
  const options = (list || []).map((p: any) => String(p?.id ?? '')).filter(Boolean)
  if ((!selectedPortfolioId.value || !options.includes(selectedPortfolioId.value)) && options.length > 0) {
    selectedPortfolioId.value = options[0]
  }
})

watch(selectedPortfolioId, async () => {
  await loadTenants()
}, { immediate: true })

const isFormOpen = ref(false)
const formModel = ref<any | null>(null)
const isViewing = ref(false)
const isDeleteOpen = ref(false)
const deletingTenant = ref<any | null>(null)
const isDeleting = ref(false)

function search() {
  // Filtering handled by rowsArray computed
}

const toast = useToast()
function getRowItems(row: any) {
  return [
    { type: 'label', label: 'Actions' },
    { label: 'View', icon: 'i-lucide-eye', color: 'info', class: 'text-info', onSelect() {
      formModel.value = { ...row.original }
      isViewing.value = true
      isFormOpen.value = true
    } },
    { label: 'Edit', icon: 'i-lucide-pencil', color: 'primary', class: 'text-primary', onSelect() {
      formModel.value = { ...row.original }
      isViewing.value = false
      isFormOpen.value = true
    } },
    { type: 'separator' },
    { label: 'Delete', icon: 'i-lucide-trash', color: 'error', class: 'text-error', onSelect() {
      deletingTenant.value = row.original
      isDeleteOpen.value = true
    } }
  ]
}

async function confirmDelete() {
  if (!deletingTenant.value?.id) return
  try {
    isDeleting.value = true
    await api.delete(`/tenants/${deletingTenant.value.id}`)
    toast.add({ title: `Tenant ${deletingTenant.value.first_name} ${deletingTenant.value.last_name} deleted`, color: 'success', icon: 'i-lucide-check' })
    const idx = tenants.value.findIndex((t: any) => t?.id === deletingTenant.value.id)
    if (idx >= 0) tenants.value.splice(idx, 1)
  } catch (e: any) {
    toast.add({ title: e?.data?.message || e?.message || 'Delete failed', color: 'error', icon: 'i-lucide-x' })
  } finally {
    isDeleting.value = false
    isDeleteOpen.value = false
    deletingTenant.value = null
  }
}

const onCreated = (created: any) => {
  tenants.value.unshift({ ...created })
}
  
const onUpdated = (updated: any) => {
  const idx = tenants.value.findIndex((t: any) => t?.id === updated?.id)
  if (idx >= 0) tenants.value[idx] = { ...updated }
}

const onDeleted = (id: number) => {
  const idx = tenants.value.findIndex((t: any) => t?.id === id)
  if (idx >= 0) tenants.value.splice(idx, 1)
}

const loading = computed(() => pending.value || pendingTenants.value)
</script>



