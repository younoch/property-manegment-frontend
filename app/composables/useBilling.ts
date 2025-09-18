import { createProtectedApiClient } from '~/app/utils/api'
import type { Invoice, Payment } from '@/types/billing'

export function useBilling() {
  const api = createProtectedApiClient()

  const listInvoices = async (leaseId: number) => {
    const res = await api.get<{ data: Invoice[] } | Invoice[]>(`/leases/${leaseId}/invoices`)
    const data = (res?.data as any)?.data ?? res?.data ?? res
    return Array.isArray(data) ? data : []
  }

  const generateNextInvoice = async (leaseId: number) => {
    return api.post(`/leases/${leaseId}/invoices/generate-next`, {})
  }

  const listPayments = async (leaseId: number) => {
    const res = await api.get<{ data: Payment[] } | Payment[]>(`/leases/${leaseId}/payments`)
    const data = (res?.data as any)?.data ?? res?.data ?? res
    return Array.isArray(data) ? data : []
  }

  const recordPaymentForInvoice = async (invoiceId: number, payload: {
    amount: number, method: string, at: string, reference?: string, notes?: string
  }) => {
    return api.post(`/invoices/${invoiceId}/payments`, payload)
  }

  return { listInvoices, generateNextInvoice, listPayments, recordPaymentForInvoice }
}
