<template>
  <div class="max-w-6xl mx-auto p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 w-full">
    <LeaseHeader :leaseId="leaseId" :lease="lease" />

    <LeaseActions
      :lease="lease"
      :loading="loading"
      :generating-invoice="generatingInvoice"
      :activating="activating"
      @open-activate="openActivate = true"
      @open-end="openEnd = true"
      @generate-next="onGenerateNext"
      @refresh="reload"
      @open-payment="openPaymentModal"
    />

    <UTabs 
      v-model="tab" 
      :items="tabs" 
      variant="link" 
      orientation="vertical" 
      :ui="{ 
        root: 'w-full text-xs sm:text-sm items-start',
        wrapper: 'w-full overflow-x-auto overflow-y-hidden hide-scrollbar', 
        base: 'flex-1', 
        list: 'flex-nowrap', 
        container: 'border-b border-gray-200 dark:border-gray-700', 
        tab: { 
          padding: 'py-1.5 px-2 sm:py-2 sm:px-4', 
          size: 'text-xs sm:text-sm md:text-base' 
        } 
      }" 
    >
      <template #overview>
        <LeaseOverview :lease="lease" :balanceBDT="balanceBDT" :fmtBDT="fmtBDT" />
      </template>

      <template #invoices>
        <LeaseInvoicesTable
          :items="invoices"
          :totals="invoiceTotals"
          :generating="generatingInvoice"
          :fmtBDT="fmtBDT"
          :fmtDate="fmtDate"
          @generate-next="onGenerateNext"
          @pay-clicked="openPaymentModal"
        />
      </template>

      <template #payments>
        <LeasePaymentsTable
          :items="payments"
          :fmtBDT="fmtBDT"
          :fmtDate="fmtDate"
          @open-payment="openPayment = true"
        />
      </template>

      <template #tenants>
        <UCard :ui="{ body: 'p-2 sm:p-4' }">
          <div class="text-xs sm:text-sm text-gray-500" v-if="(lease?.lease_tenants || []).length === 0">No tenants linked.</div>
          <ul class="space-y-2">
            <li v-for="t in lease.lease_tenants" :key="t.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div class="font-medium">{{ t.tenant.first_name }} {{ t.tenant.last_name }}</div>
              <div v-if="t.tenant.phone || t.tenant.email" class="text-sm text-gray-500 mt-1 space-y-1">
                <div v-if="t.tenant.phone" class="flex items-center">
                  <UIcon name="i-lucide-phone" class="w-4 h-4 mr-2" />
                  <a :href="'tel:' + t.tenant.phone" class="hover:text-primary-600 dark:hover:text-primary-400">{{ t.tenant.phone }}</a>
                </div>
                <div v-if="t.tenant.email" class="flex items-center">
                  <UIcon name="i-lucide-mail" class="w-4 h-4 mr-2" />
                  <a :href="'mailto:' + t.tenant.email" class="hover:text-primary-600 dark:hover:text-primary-400 break-all">{{ t.tenant.email }}</a>
                </div>
              </div>
            </li>
          </ul>
        </UCard>
      </template>

      <template #documents>
        <UCard :ui="{ body: { padding: 'p-3 sm:p-4' } }">
      <div class="text-sm text-gray-500">No documents yet.</div>
    </UCard>
      </template>
    </UTabs>

    <!-- Modals -->
    <ActivateLeaseModal
      v-model:open="openActivate"
      :loading="activating"
      :create-first-invoice="createFirstInvoice"
      :create-deposit-invoice="createDepositInvoice"
      :allow-deposit="Number(lease?.deposit || 0) > 0"
      @update:createFirstInvoice="v => createFirstInvoice = v"
      @update:createDepositInvoice="v => createDepositInvoice = v"
      @confirm="doActivate"
    />
    <EndLeaseModal v-model:open="openEnd" :loading="ending" @confirm="doEndLease" />

    <RecordPaymentModal
      v-model:open="openPayment"
      :loading="submittingPayment"
      :portfolio-id="lease?.portfolio_id"
      :lease-id="leaseId"
      :invoice="selectedInvoice"
      @submitted="onPaymentSubmitted"
      @error="onPaymentError"
      @close="selectedInvoice = {}"
    />
  </div>
</template>

<script setup lang="ts">
import { useLeaseDetail } from '~/composables/useLeaseDetail'

import LeaseHeader from '~/components/leases/LeaseHeader.vue'
import LeaseActions from '~/components/leases/LeaseActions.vue'
import LeaseOverview from '~/components/leases/LeaseOverview.vue'
import LeaseInvoicesTable from '~/components/leases/LeaseInvoicesTable.vue'
import LeasePaymentsTable from '~/components/leases/LeasePaymentsTable.vue'
import RecordPaymentModal from '~/components/leases/modals/RecordPaymentModal.vue'
import ActivateLeaseModal from '~/components/leases/modals/ActivateLeaseModal.vue'
import EndLeaseModal from '~/components/leases/modals/EndLeaseModal.vue'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()

const leaseId = Number(route.params.id)

const {
  // state
  lease, invoices, payments,
  loading, generatingInvoice, activating, ending, submittingPayment,
  // toggles
  createFirstInvoice, createDepositInvoice,
  // utils
  invoiceTotals, balanceBDT, fmtBDT, fmtDate,
  // actions
  reload, doActivate, doEndLease, generateNextInvoice, submitPayment
} = useLeaseDetail(leaseId)

// UI state
const tab = ref<'overview'|'invoices'|'payments'|'tenants'|'documents'>('overview')
const toast = useToast()

// Payment modal state
const selectedInvoice = ref<any>({})
const openPayment = ref(false)

// Open payment modal with invoice data
function openPaymentModal(invoice: any = null) {
  selectedInvoice.value = invoice
  openPayment.value = true
}

// Handle payment submission
async function onPaymentSubmitted(paymentData: any) {
  try {
    // If paying an invoice, include the invoice ID
    if (selectedInvoice.value) {
      paymentData.invoice_id = selectedInvoice.value.id
    }
    
    await submitPayment(paymentData)
    toast.add({
      title: 'Payment recorded',
      color: 'green',
      icon: 'i-lucide-check-circle'
    })
    
    // Reset the selected invoice after successful payment
    selectedInvoice.value = null
  } catch (error) {
    console.error('Payment submission failed:', error)
    toast.add({
      title: 'Failed to record payment',
      description: 'Please try again',
      color: 'red',
      icon: 'i-lucide-alert-circle'
    })
  }
}

// Handle payment errors
function onPaymentError(message: string) {
  toast.add({
    title: 'Validation Error',
    description: message,
    color: 'red',
    icon: 'i-lucide-alert-circle'
  })
}
const tabs = [
  { label:'Overview',  icon:'i-lucide-layout-dashboard', value:'overview',  slot:'overview'  as const },
  { label:'Invoices',  icon:'i-lucide-receipt',          value:'invoices',  slot:'invoices'  as const },
  { label:'Payments',  icon:'i-lucide-banknote',         value:'payments',  slot:'payments'  as const },
  { label:'Tenants',   icon:'i-lucide-users',            value:'tenants',   slot:'tenants'   as const },
  { label:'Documents', icon:'i-lucide-file',             value:'documents', slot:'documents' as const },
] satisfies import('@nuxt/ui').TabsItem[]

const openActivate = ref(false)
const openEnd = ref(false)

onMounted(reload)

async function onGenerateNext() {
  const created = await generateNextInvoice()
  if (created?.id) {
    navigateTo(`/invoices/${created.id}`)
  } else {
    await reload()
    tab.value = 'invoices'
  }
}
</script>
