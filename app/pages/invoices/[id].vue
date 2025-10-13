<template>
  <div class="max-w-3xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-xl sm:text-xl md:text-2xl font-semibold">Invoice #{{ model?.invoice_number }}</h1>
          <UBadge :color="badgeColor" variant="soft" class="capitalize text-xs sm:text-sm">{{ model?.status || 'open' }}</UBadge>
        </div>
        <p class="text-xs sm:text-sm text-gray-500">
          <span>Lease: <span class="font-medium">#{{ model?.lease_id }}</span></span>
          <span class="hidden sm:inline"> · </span>
          <span class="block sm:inline">Portfolio: <span class="font-medium">#{{ model?.portfolio_id }}</span></span>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2 justify-end">
        <UButton 
          size="xs"
          variant="ghost" 
          :to="`/leases/${model?.lease_id}`" 
          icon="i-heroicons-arrow-left"
          class="text-xs sm:text-sm"
        >
          <span class="hidden sm:inline">Back</span>
        </UButton>
        <UButton
          v-if="!editMode"
          size="xs"
          icon="i-lucide-send"
          color="green"
          :loading="sending"
          @click="sendInvoice"
          class="text-xs sm:text-sm"
        >
          <span class="hidden sm:inline">Send</span>
        </UButton>
        <UButton
          v-if="!editMode"
          size="xs"
          :disabled="!canEdit"
          icon="i-lucide-pencil-line"
          @click="enterEdit"
          class="text-xs sm:text-sm"
        >
          <span class="hidden sm:inline">Edit</span>
        </UButton>
        <template v-else>
          <UButton
            variant="soft"
            color="neutral"
            icon="i-lucide-undo-2"
            :loading="saving"
            @click="cancelEdit"
          >
            Cancel
          </UButton>
          <UButton
            icon="i-lucide-check"
            :loading="saving"
            @click="save"
          >
            Save
          </UButton>
        </template>
      </div>
    </div>

    <!-- Meta -->
    <UCard>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <div class="text-xs text-gray-500">Issue date</div>
          <div v-if="!editMode" class="font-medium">{{ fmtDate(model.issue_date) }}</div>
          <UInput v-else v-model="model.issue_date" type="date" />
        </div>
        <div>
          <div class="text-xs text-gray-500">Due date</div>
          <div v-if="!editMode" class="font-medium">{{ fmtDate(model.due_date) }}</div>
          <UInput v-else v-model="model.due_date" type="date" />
        </div>
        <div>
          <div class="text-xs text-gray-500">Status</div>
          <div v-if="!editMode" class="font-medium capitalize">{{ model.status }}</div>
          <USelect
            v-else
            v-model="model.status"
            :items="statusOptions"
            class="w-full"
          />
        </div>
      </div>
    </UCard>

    <!-- Items -->
    <UCard>
      <div class="flex items-center justify-between mb-2 sm:mb-3">
        <h3 class="text-sm font-medium">Items</h3>
        <UButton
          v-if="editMode"
          size="2xs"
          variant="soft"
          icon="i-lucide-plus"
          @click="addRow"
          class="text-xs"
        >
          <span class="hidden sm:inline">Add row</span>
        </UButton>
      </div>

      <div class="overflow-x-auto -mx-2 sm:mx-0">
        <div class="min-w-full inline-block align-middle">
          <div class="overflow-hidden rounded-md ring-1 ring-black/5 dark:ring-white/10">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm">
              <thead class="bg-gray-50/70 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                <tr>
                  <th class="py-2 px-2 sm:px-3 text-left w-6"></th>
                  <th class="py-2 px-2 sm:px-3 text-left">Name</th>
                  <th class="py-2 px-1 sm:px-3 text-right whitespace-nowrap">Qty</th>
                  <th class="py-2 px-1 sm:px-3 text-right whitespace-nowrap">Unit price</th>
                  <th class="py-2 px-2 sm:px-3 text-right whitespace-nowrap">Amount</th>
                </tr>
              </thead>
          <tbody class="divide-y divide-gray-100/70 dark:divide-white/10">
            <tr v-for="(row, idx) in model.items" :key="row.__key" class="align-top">
              <td class="py-2 px-3">
                <UButton
                  v-if="editMode"
                  size="xs"
                  variant="soft"
                  color="rose"
                  icon="i-lucide-minus"
                  :disabled="model.items.length === 1"
                  @click="removeRow(idx)"
                />
              </td>
              <td class="py-2 px-2 sm:px-3">
                <div v-if="!editMode" class="font-medium text-xs sm:text-sm">{{ row.name || '—' }}</div>
                <UInput v-else v-model.trim="row.name" placeholder="Item name" size="xs" />
              </td>
              <td class="py-2 px-1 sm:px-3 text-right whitespace-nowrap">
                <div v-if="!editMode" class="text-xs sm:text-sm">{{ row.qty }}</div>
                <UInput
                  v-else
                  v-model.number="row.qty"
                  type="number"
                  min="0.01"
                  step="0.01"
                  class="text-right text-xs sm:text-sm"
                  size="xs"
                  @input="recalcRow(row)"
                />
              </td>
              <td class="py-2 px-1 sm:px-3 text-right whitespace-nowrap">
                <div v-if="!editMode" class="text-xs sm:text-sm">{{ fmtBDT(row.unit_price) }}</div>
                <UInput
                  v-else
                  v-model.number="row.unit_price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="text-right text-xs sm:text-sm"
                  size="xs"
                  @input="recalcRow(row)"
                />
              </td>
              <td class="py-2 px-2 sm:px-3 text-right font-medium whitespace-nowrap">
                <span class="text-xs sm:text-sm">{{ fmtBDT(row.amount) }}</span>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50/50 dark:bg-white/5">
            <tr>
              <td colspan="4" class="py-2 px-3 text-right text-gray-600">Subtotal</td>
              <td class="py-2 px-3 text-right font-medium">{{ fmtBDT(subtotal) }}</td>
            </tr>
            <tr>
              <td colspan="4" class="py-2 px-3 text-right text-gray-600">Tax</td>
              <td class="py-2 px-3 text-right font-medium">{{ fmtBDT(model.tax) }}</td>
            </tr>
            <tr>
              <td colspan="4" class="py-2 px-3 text-right text-gray-700">Total</td>
              <td class="py-2 px-3 text-right font-semibold">{{ fmtBDT(total) }}</td>
            </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Footer actions (view mode) -->
    <div v-if="!editMode" class="flex flex-wrap items-center justify-end gap-2">
      <UButton 
        size="xs" 
        variant="soft" 
        icon="i-lucide-download" 
        @click="downloadPdf"
        class="text-xs sm:text-sm"
      >
        <span class="hidden sm:inline">Download</span> PDF
      </UButton>
      <UButton 
        size="xs" 
        :disabled="!canEdit" 
        icon="i-lucide-pencil-line" 
        @click="enterEdit"
        class="text-xs sm:text-sm"
      >
        <span class="hidden sm:inline">Edit</span>
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { createProtectedApiClient } from '~/utils/api'
import { useAuth } from '~/composables/useAuth'
import { useApiToast } from '~/composables/useApiToast'

const api = createProtectedApiClient()
const { checkAuth } = useAuth()
await checkAuth()

const { success: toastSuccess, error: toastError } = useApiToast()
const route = useRoute()
const invoiceId = route.params.id

type ItemRow = {
  id?: string
  name: string
  qty: number
  unit_price: number
  amount: number
  __key: string         // local key for v-for stability
}

import type { InvoiceVM } from '~/types/invoice'

const raw = ref<any>(null)                 // last-loaded server response
const lease = ref<any>(null)                // lease data
const model = reactive<InvoiceVM>({
  id: invoiceId,
  invoice_number: '',
  portfolio_id: '',
  lease_id: '',
  issue_date: '',
  due_date: '',
  status: 'open',
  subtotal: 0,
  tax: 0,
  total: 0,
  items: []
})

const loading = ref(false)
const saving = ref(false)
const sending = ref(false)
const editMode = ref(false)

const canEdit = computed(() => model.status === 'draft' || model.status === 'open')
const badgeColor = computed(() =>
  model.status === 'paid' ? 'primary'
  : model.status === 'overdue' ? 'warning'
  : model.status === 'void' ? 'gray'
  : 'neutral'
)

const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Void', value: 'void' }
]

// formatters
const fmtBDT = (n: number | string | null | undefined) =>
  n == null ? '—' : new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(Number(n))
const fmtDate = (iso?: string) =>
  iso ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(new Date(iso)) : '—'

// totals
const subtotal = computed(() => model.items.reduce((s, r) => s + (Number(r.amount) || 0), 0))
const total = computed(() => subtotal.value + (Number(model.tax) || 0))

function recalcRow(row: ItemRow) {
  const q = Number(row.qty) || 0
  const up = Number(row.unit_price) || 0
  row.amount = +(q * up).toFixed(2)
}

function addRow() {
  model.items.push({
    name: '',
    qty: 1,
    unit_price: 0,
    amount: 0,
    __key: crypto.randomUUID()
  })
}

function removeRow(idx: number) {
  if (model.items.length === 1) return
  model.items.splice(idx, 1)
}

function snapshotFromServer(src: any) {
  raw.value = src
  const it = Array.isArray(src.items) ? src.items : []
  model.id = src.id
  model.portfolio_id = src.portfolio_id
  model.lease_id = src.lease_id
  model.invoice_number = src.invoice_number
  // Store the raw data for reverting changes
  raw.value = JSON.parse(JSON.stringify(src))
  model.issue_date = (src.issue_date || '').slice(0,10)
  model.due_date = (src.due_date || '').slice(0,10)
  model.status = src.status
  model.tax = Number(src.tax ?? 0)
  model.items = it.map((x: any) => ({
    id: x.id,
    name: x.name,
    qty: Number(x.qty ?? 1),
    unit_price: Number(x.unit_price ?? 0),
    amount: Number(x.amount ?? (Number(x.qty||0)*Number(x.unit_price||0))),
    __key: `row-${x.id ?? crypto.randomUUID()}`
  }))
  if (model.items.length === 0) addRow()
}

async function loadInvoice() {
  loading.value = true
  try {
    // Load invoice data
    const res = await api.get(`/invoices/${invoiceId}`)
    const data = res?.data?.data ?? res?.data ?? res
    snapshotFromServer(data)
    
    // Load lease data if lease_id exists
    if (data.lease_id) {
      try {
        const leaseRes = await api.get(`/leases/${data.lease_id}`)
        lease.value = leaseRes?.data?.data ?? leaseRes?.data ?? leaseRes
      } catch (e: any) {
        console.error('Failed to load lease data:', e)
        // Don't show error to user for lease data as it's secondary
      }
    }
  } catch (e: any) {
    toastError(e?.message || 'Failed to load invoice')
  } finally {
    loading.value = false
  }
}

function enterEdit() {
  if (!canEdit.value) return
  editMode.value = true
}

function cancelEdit() {
  // revert to last server state
  if (raw.value) snapshotFromServer(raw.value)
  editMode.value = false
}

async function save() {
  // lightweight client validation
  if (!model.issue_date || !model.due_date) {
    toastError('Issue and Due dates are required')
    return
  }
  if (new Date(model.due_date) < new Date(model.issue_date)) {
    toastError('Due date cannot be before issue date')
    return
  }
  for (const r of model.items) {
    if (!r.name?.trim()) return toastError('Each item needs a name')
    if ((Number(r.qty) || 0) <= 0) return toastError('Qty must be greater than 0')
    if ((Number(r.unit_price) || 0) < 0) return toastError('Unit price cannot be negative')
  }

  saving.value = true
  try {
    // server recomputes amounts/totals; send only editable fields
    const payload = {
      issue_date: model.issue_date,
      due_date: model.due_date,
      status: model.status,
      items: model.items.map(r => ({
        id: r.id,
        name: r.name,
        qty: Number(r.qty),
        unit_price: Number(r.unit_price)
        // amount intentionally omitted (server will compute)
      }))
      // optionally: updated_at for optimistic locking
      // updated_at: raw.value?.updated_at
    }
    const res = await api.patch(`/invoices/${invoiceId}`, payload)
    const data = res?.data?.data ?? res?.data ?? res
    toastSuccess('Invoice saved')
    snapshotFromServer(data)
    editMode.value = false
  } catch (e: any) {
    toastError(e?.message || 'Failed to save invoice')
  } finally {
    saving.value = false
  }
}

function downloadPdf() {
  window.print()
}

const sendInvoice = async () => {
  if (!confirm('Are you sure you want to send this invoice to the tenant?')) {
    return
  }
  
  try {
    sending.value = true
    
    // Prepare the email payload
    const payload = {
      recipient_email: lease.value?.lease_tenants?.[0]?.tenant?.email || '',
      recipient_name: `${lease.value?.lease_tenants?.[0]?.tenant?.first_name || ''} ${lease.value?.lease_tenants?.[0]?.tenant?.last_name || ''}`.trim(),
      recipient_phone: lease.value?.lease_tenants?.[0]?.tenant?.phone || '',
      subject: `Invoice #${model.id} for ${lease.value?.property?.name || 'Property'} - ${lease.value?.unit?.label || ''}`,
      message: `Dear ${lease.value?.lease_tenants?.[0]?.tenant?.first_name || 'Tenant'},\n\nPlease find attached your invoice for ${lease.value?.property?.name || 'the property'}, Unit ${lease.value?.unit?.label || ''}.\n\nInvoice Details:\n- Invoice #${model.id}\n- Issue Date: ${model.issue_date}\n- Due Date: ${model.due_date}\n- Amount Due: ${fmtBDT(total.value)}\n\nBest regards,\nYour Property Management Team`,
      property_address: `${lease.value?.property?.name || ''}${lease.value?.unit?.label ? `, Unit ${lease.value.unit.label}` : ''}`,
      cc_emails: [],
      bcc_emails: [],
      reply_to: 'younoch295@gmail.com', // TODO: Replace with actual management email
      include_watermark: false,
      notes: `Invoice #${model.id} sent to tenant on ${new Date().toISOString().split('T')[0]}`
    }

    const response = await api.post(`/invoices/${invoiceId}/send`, payload)
    toastSuccess(response.message || 'Invoice sent successfully')
    // Reload the invoice to update the status
    await loadInvoice()
  } catch (error: any) {
    toastError(error.data?.message || 'Failed to send invoice')
    console.error('Error sending invoice:', error)
  } finally {
    sending.value = false
  }
}

onMounted(loadInvoice)
</script>

<style scoped>
/* Responsive table container */
@media (max-width: 640px) {
  .table-container {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  .table-container::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  .table-container {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
}

/* Better touch targets for mobile */
@media (max-width: 640px) {
  button, [role="button"], .btn {
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
  }
  
  input, .input {
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
  }
}
@media print {
  .max-w-3xl { max-width: 800px; }
  .no-print { display: none !important; }
}
</style>
