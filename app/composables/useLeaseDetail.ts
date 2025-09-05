import { createProtectedApiClient } from '@/utils/api'
import { h, resolveComponent } from 'vue'
import { useApiToast } from '@/composables/useApiToast'

export function useLeaseDetail(leaseId: number) {
  const api = createProtectedApiClient()
  const { success: toastSuccess, error: toastError } = useApiToast()

  // state
  const loading = ref(false)
  const generatingInvoice = ref(false)
  const activating = ref(false)
  const ending = ref(false)
  const submittingPayment = ref(false)

  const lease = ref<any | null>(null)
  const invoices = ref<any[]>([])
  const payments = ref<any[]>([])

  // activation toggles
  const createFirstInvoice = ref(true)
  const createDepositInvoice = ref(true)

  // helpers
  const fmtBDT = (n: number | string | null | undefined) =>
    n == null ? '—' : new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(n))
  const fmtDate = (iso?: string) =>
    iso ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(new Date(iso)) : '—'

  const invoiceTotals = computed(() => ({
    open:     invoices.value.filter(i => i.status === 'open').length,
    overdue:  invoices.value.filter(i => i.status === 'overdue').length,
    paid:     invoices.value.filter(i => i.status === 'paid').length
  }))
  const balanceBDT = computed(() => {
    const invDue = invoices.value
      .filter(i => ['open','overdue'].includes(i.status))
      .reduce((s, i) => s + Number(i.total ?? i.amount ?? 0), 0)
    const paid = payments.value.reduce((s, p) => s + Number(p.amount || 0), 0)
    return fmtBDT(invDue - paid)
  })

  async function reload() {
    loading.value = true
    try {
      const res = await api.get<any>(`/leases/${leaseId}`)
      const data = res?.data?.data ?? res?.data ?? res
      lease.value = data

      try {
        const invRes = await api.get<any>(`/leases/${leaseId}/invoices`)
        const iData  = invRes?.data?.data ?? invRes?.data ?? invRes
        invoices.value = Array.isArray(iData) ? iData : (Array.isArray(iData?.items) ? iData.items : [])
      } catch { invoices.value = [] }

      try {
        const payRes = await api.get<any>(`/leases/${leaseId}/payments`)
        const pData  = payRes?.data?.data ?? payRes?.data ?? payRes
        payments.value = Array.isArray(pData) ? pData : (Array.isArray(pData?.items) ? pData.items : [])
      } catch { payments.value = [] }
    } catch (e: any) {
      toastError(e?.message || 'Failed to load lease')
    } finally {
      loading.value = false
    }
  }

  async function doActivate() {
    if (!lease.value) return
    activating.value = true
    try {
      await api.post(`/leases/${leaseId}/activate`, {
        create_first_invoice:  createFirstInvoice.value,
        create_deposit_invoice: createDepositInvoice.value
      })
      toastSuccess('Lease activated')
      await reload()
    } catch (e: any) {
      toastError(e?.message || 'Activation failed')
    } finally {
      activating.value = false
    }
  }

  async function doEndLease(endDate: string) {
    if (!lease.value) return
    ending.value = true
    try {
      const pid = lease.value.portfolio_id
      const endpoint = pid ? `/portfolios/${pid}/leases/${leaseId}/end` : `/leases/${leaseId}/end`
      await api.post(endpoint, { end_date: endDate })
      toastSuccess('Lease ended')
      await reload()
    } catch (e: any) {
      toastError(e?.message || 'Failed to end lease')
    } finally {
      ending.value = false
    }
  }

  async function generateNextInvoice() {
    console.log('Generating next invoice for lease', leaseId)
    if (!lease.value) return
    generatingInvoice.value = true
    try {
      // Make the API request using the existing API client
      const response = await api.post(`/leases/${leaseId}/invoices/generate-next`, {})
      
      // Handle successful response
      const responseData = response as any;
      const created = responseData?.data?.data ?? responseData?.data ?? responseData;
      toastSuccess('Next invoice generated');
      return created; // caller decides to navigate or refresh
    } catch (e: any) {
      console.error('Error generating invoice:', e);
      
      // Extract error message from the error object
      const errorMessage = 
        e?.response?.data?.message || 
        e?.data?.message ||
        e?.message || 
        'Failed to generate invoice';
      
      console.log('Error message to display:', errorMessage);
      toastError(String(errorMessage));
      throw e; // Re-throw to allow caller to handle the error if needed
    } finally {
      generatingInvoice.value = false
    }
  }

  async function submitPayment(payload: { 
    portfolio_id: number;
    lease_id: number;
    user_id?: number | null;
    invoice_id?: number | null;
    received_at: string;
    method: string;
    amount: number;
    reference?: string;
    notes?: string;
  }) {
    if (!lease.value) return
    submittingPayment.value = true
    try {
      // Extract only the fields we want to send to the API
      const { portfolio_id, ...paymentData } = payload;
      await api.post(`/portfolios/${portfolio_id}/payments`, {
        ...paymentData,
        // Ensure we're sending the correct field names expected by the API
        received_at: paymentData.received_at,
        method: paymentData.method,
        amount: paymentData.amount,
        reference: paymentData.reference,
        notes: paymentData.notes,
        lease_id: paymentData.lease_id,
        invoice_id: paymentData.invoice_id || null,
        user_id: paymentData.user_id || null
      })
      toastSuccess('Payment recorded successfully')
      await reload()
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Failed to record payment'
      toastError(errorMessage)
      throw e // Re-throw to allow the caller to handle the error
    } finally {
      submittingPayment.value = false
    }
  }

  return {
    // state
    lease, invoices, payments,
    loading, generatingInvoice, activating, ending, submittingPayment,
    // toggles
    createFirstInvoice, createDepositInvoice,
    // computed & utils
    invoiceTotals, balanceBDT, fmtBDT, fmtDate,
    // actions
    reload, doActivate, doEndLease, generateNextInvoice, submitPayment,
  }
}
