<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-semibold">Lease #{{ leaseId }}</h1>
          <UBadge :color="statusColor(lease?.status)" variant="soft" class="capitalize">
            {{ lease?.status || 'draft' }}
          </UBadge>
        </div>
        <p class="text-sm text-gray-500 mt-1">
          Unit: <span class="font-medium">{{ lease?.unit?.label ?? ('#' + lease?.unit_id) }}</span>
          · Property: <span class="font-medium">{{ lease?.property?.name ?? ('#' + lease?.property_id) }}</span>
          · Portfolio: <span class="font-medium">#{{ lease?.portfolio_id }}</span>
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton variant="ghost" to="/leases" icon="i-heroicons-arrow-left">Back</UButton>
      </div>
    </div>

    <!-- Actions bar -->
    <UCard>
      <div class="flex flex-wrap items-center gap-2">
        <UButton
          v-if="lease?.status === 'draft'"
          :loading="activating"
          icon="i-lucide-file-signature"
          @click="openActivate = true"
        >
          Activate
        </UButton>

        <UButton
          v-if="lease?.status === 'active'"
          variant="soft"
          color="neutral"
          icon="i-lucide-calendar-x"
          @click="openEnd = true"
        >
          End Lease
        </UButton>

        <UButton
          v-if="lease?.status === 'active'"
          variant="soft"
          color="primary"
          icon="i-lucide-file-plus"
          @click="generateNextInvoice"
          :loading="generatingInvoice"
        >
          Generate Next Invoice
        </UButton>

        <UButton
          variant="soft"
          color="neutral"
          icon="i-lucide-rotate-cw"
          @click="reload"
          :loading="loading"
        >
          Refresh
        </UButton>
      </div>
    </UCard>

    <!-- Tabs -->
    <UTabs v-model="tab" :items="tabs" class="w-full" />

    <div v-if="tab === 0">
      <!-- Overview -->
      <UCard>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium mb-2">Dates</h3>
            <div class="text-sm text-gray-600">
              Start: <span class="font-medium">{{ lease?.start_date }}</span><br>
              End: <span class="font-medium">{{ lease?.end_date || '—' }}</span>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-medium mb-2">Finance</h3>
            <div class="text-sm text-gray-600">
              Rent: <span class="font-medium">{{ fmtBDT(lease?.rent) }}</span><br>
              Deposit: <span class="font-medium">{{ fmtBDT(lease?.deposit) }}</span><br>
              Billing Day: <span class="font-medium">{{ lease?.billing_day }}</span>
              · Grace: <span class="font-medium">{{ lease?.grace_days }}d</span>
            </div>
          </div>

          <div class="sm:col-span-2">
            <h3 class="text-sm font-medium mb-2">Tenants</h3>
            <div v-if="(lease?.tenants || []).length === 0" class="text-sm text-gray-500">No tenants linked.</div>
            <ul v-else class="text-sm text-gray-700 list-disc list-inside">
              <li v-for="t in lease.tenants" :key="t.id">
                {{ t.first_name }} {{ t.last_name }}
                <span v-if="t.phone" class="text-gray-500">· {{ t.phone }}</span>
                <span v-if="t.email" class="text-gray-500">· {{ t.email }}</span>
              </li>
            </ul>
          </div>

          <div class="sm:col-span-2">
            <h3 class="text-sm font-medium mb-2">Notes</h3>
            <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ lease?.notes || '—' }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <div v-else-if="tab === 1">
      <!-- Invoices -->
      <UCard>
        <div class="text-sm text-gray-500" v-if="invoices.length === 0">No invoices yet.</div>
        <div v-else class="overflow-hidden rounded-md ring-1 ring-black/5 dark:ring-white/10">
          <table class="w-full text-sm">
            <thead class="bg-gray-50/70 dark:bg-white/5 text-gray-600 dark:text-gray-300">
              <tr>
                <th class="py-2 px-3 text-left">Invoice</th>
                <th class="py-2 px-3 text-left">Type</th>
                <th class="py-2 px-3 text-left">Period</th>
                <th class="py-2 px-3 text-right">Amount</th>
                <th class="py-2 px-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/70 dark:divide-white/10">
              <tr v-for="inv in invoices" :key="inv.id" class="hover:bg-gray-50/60 dark:hover:bg-white/5 transition">
                <td class="py-2 px-3 font-medium">#{{ inv.id }}</td>
                <td class="py-2 px-3 capitalize">{{ inv.type || 'rent' }}</td>
                <td class="py-2 px-3">{{ inv.period || '—' }}</td>
                <td class="py-2 px-3 text-right font-medium">{{ fmtBDT(inv.amount) }}</td>
                <td class="py-2 px-3">
                  <UBadge :color="inv.status === 'paid' ? 'primary' : inv.status === 'overdue' ? 'warning' : 'neutral'" variant="soft" class="capitalize">
                    {{ inv.status || 'open' }}
                  </UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>

    <div v-else-if="tab === 2">
      <!-- Payments -->
      <UCard>
        <div class="text-sm text-gray-500" v-if="payments.length === 0">No payments yet.</div>
        <div v-else class="overflow-hidden rounded-md ring-1 ring-black/5 dark:ring-white/10">
          <table class="w-full text-sm">
            <thead class="bg-gray-50/70 dark:bg-white/5 text-gray-600 dark:text-gray-300">
              <tr>
                <th class="py-2 px-3 text-left">Payment</th>
                <th class="py-2 px-3 text-left">Method</th>
                <th class="py-2 px-3 text-left">Date</th>
                <th class="py-2 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/70 dark:divide-white/10">
              <tr v-for="p in payments" :key="p.id" class="hover:bg-gray-50/60 dark:hover:bg-white/5 transition">
                <td class="py-2 px-3 font-medium">#{{ p.id }}</td>
                <td class="py-2 px-3 capitalize">{{ (p.method || '').replace('_',' ') }}</td>
                <td class="py-2 px-3">{{ fmtDate(p.at || p.created_at) }}</td>
                <td class="py-2 px-3 text-right font-medium">{{ fmtBDT(p.amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>

    <div v-else-if="tab === 3">
      <!-- Tenants -->
      <UCard>
        <div class="text-sm text-gray-500" v-if="(lease?.tenants || []).length === 0">No tenants linked.</div>
        <ul v-else class="text-sm text-gray-700 list-disc list-inside">
          <li v-for="t in lease.tenants" :key="t.id">
            {{ t.first_name }} {{ t.last_name }}
            <span v-if="t.phone" class="text-gray-500">· {{ t.phone }}</span>
            <span v-if="t.email" class="text-gray-500">· {{ t.email }}</span>
          </li>
        </ul>
      </UCard>
    </div>

    <div v-else>
      <!-- Documents -->
      <UCard>
        <div class="text-sm text-gray-500">No documents yet.</div>
      </UCard>
    </div>

    <!-- Activate modal -->
    <UModal v-model:open="openActivate" title="Activate Lease">
      <template #body>
        <div class="space-y-3">
          <div class="text-sm text-gray-600">Choose what to do on activation.</div>
          <div class="flex items-center gap-3">
            <USwitch v-model="createFirstInvoice" />
            <span class="text-sm">Create first rent invoice now</span>
          </div>
          <div class="flex items-center gap-3">
            <USwitch v-model="createDepositInvoice" :disabled="!(lease?.deposit > 0)" />
            <span class="text-sm" :class="!(lease?.deposit > 0) ? 'text-gray-400' : ''">Create deposit invoice now</span>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <UButton variant="soft" color="neutral" @click="openActivate = false">Cancel</UButton>
          <UButton :loading="activating" icon="i-lucide-file-signature" @click="doActivate">Activate</UButton>
        </div>
      </template>
    </UModal>

    <!-- End lease modal -->
    <UModal v-model:open="openEnd" title="End Lease">
      <template #body>
        <div class="space-y-3">
          <UFormField label="End Date"><UInput v-model="endDate" type="date" /></UFormField>
          <p class="text-xs text-gray-500">Tenant will move out on this date. Future invoices should stop.</p>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <UButton variant="soft" color="neutral" @click="openEnd = false">Cancel</UButton>
          <UButton color="rose" icon="i-lucide-calendar-x" :loading="ending" @click="doEndLease">End Lease</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { createProtectedApiClient } from '../../utils/api'
import { useAuth } from '../../composables/useAuth'
import { useApiToast } from '../../composables/useApiToast'

const api = createProtectedApiClient()
const { checkAuth } = useAuth()
await checkAuth()

const route = useRoute()
const router = useRouter()
const { success: toastSuccess, error: toastError } = useApiToast()

const leaseId = Number(route.params.id)

// UI state
const loading = ref(false)
const generatingInvoice = ref(false)
const activating = ref(false)
const ending = ref(false)

const openActivate = ref(false)
const openEnd = ref(false)
const endDate = ref('')

// toggles for activation
const createFirstInvoice = ref(true)
const createDepositInvoice = ref(true)

// data
const lease = ref<any | null>(null)
const invoices = ref<any[]>([])
const payments = ref<any[]>([])

// Tabs
const tab = ref(0)
const tabs = [
  { label: 'Overview' },
  { label: 'Invoices' },
  { label: 'Payments' },
  { label: 'Tenants' },
  { label: 'Documents' }
]

// formatters
const fmtBDT = (n: number | string | null | undefined) =>
  n == null
    ? '—'
    : new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(n))

const fmtDate = (iso?: string) =>
  iso ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(new Date(iso)) : '—'

const statusColor = (s?: string) => {
  switch (s) {
    case 'active': return 'primary'
    case 'draft': return 'neutral'
    case 'ended': return 'secondary'
    default: return 'neutral'
  }
}

// load lease + related
async function reload() {
  loading.value = true
  try {
    // Lease detail
    const res = await api.get<any>(`/leases/${leaseId}`)
    const data = res?.data?.data ?? res?.data ?? res
    lease.value = data

    // Optionally load related using portfolio scope if available
    const pid = data?.portfolio_id
    // Invoices
    try {
      const invRes = pid
        ? await api.get<any>(`/portfolios/${pid}/leases/${leaseId}/invoices`)
        : await api.get<any>(`/leases/${leaseId}/invoices`)
      const iData = invRes?.data?.data ?? invRes?.data ?? invRes
      invoices.value = Array.isArray(iData) ? iData : (Array.isArray(iData?.items) ? iData.items : [])
    } catch { invoices.value = [] }

    // Payments
    try {
      const payRes = pid
        ? await api.get<any>(`/portfolios/${pid}/leases/${leaseId}/payments`)
        : await api.get<any>(`/leases/${leaseId}/payments`)
      const pData = payRes?.data?.data ?? payRes?.data ?? payRes
      payments.value = Array.isArray(pData) ? pData : (Array.isArray(pData?.items) ? pData.items : [])
    } catch { payments.value = [] }
  } catch (e: any) {
    toastError(e?.message || 'Failed to load lease')
  } finally {
    loading.value = false
  }
}
onMounted(reload)

// actions
async function doActivate() {
  if (!lease.value) return
  const pid = lease.value.portfolio_id
  activating.value = true
  try {
    const endpoint = pid ? `/portfolios/${pid}/leases/${leaseId}/activate` : `/leases/${leaseId}/activate`
    await api.post<any>(endpoint, {
      create_first_invoice: createFirstInvoice.value,
      create_deposit_invoice: createDepositInvoice.value
    })
    toastSuccess('Lease activated')
    openActivate.value = false
    await reload()
  } catch (e: any) {
    const msg = e?.message || 'Activation failed'
    toastError(msg)
  } finally {
    activating.value = false
  }
}

async function doEndLease() {
  if (!lease.value) return
  if (!endDate.value) {
    toastError('Please pick an end date')
    return
  }
  if (new Date(endDate.value) < new Date(lease.value.start_date)) {
    toastError('End date cannot be before start date')
    return
  }
  const pid = lease.value.portfolio_id
  ending.value = true
  try {
    const endpoint = pid ? `/portfolios/${pid}/leases/${leaseId}/end` : `/leases/${leaseId}/end`
    await api.post<any>(endpoint, { end_date: endDate.value })
    toastSuccess('Lease ended')
    openEnd.value = false
    await reload()
  } catch (e: any) {
    toastError(e?.message || 'Failed to end lease')
  } finally {
    ending.value = false
  }
}

async function generateNextInvoice() {
  if (!lease.value) return
  const pid = lease.value.portfolio_id
  generatingInvoice.value = true
  try {
    const endpoint = pid ? `/portfolios/${pid}/leases/${leaseId}/invoices/generate-next` : `/leases/${leaseId}/invoices/generate-next`
    await api.post<any>(endpoint, {})
    toastSuccess('Next invoice generated')
    await reload()
    tab.value = 1
  } catch (e: any) {
    toastError(e?.message || 'Failed to generate invoice')
  } finally {
    generatingInvoice.value = false
  }
}
</script>
