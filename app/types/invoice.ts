export type InvoiceStatus = 'open' | 'paid' | 'overdue' | 'void'

export interface InvoiceItem {
  id?: string
  name: string
  qty: number
  unit_price: number
  amount: number
  __key: string // local key for v-for stability
}

export interface InvoiceVM {
  id: string
  invoice_number: string
  portfolio_id: string
  lease_id: string
  issue_date: string
  due_date: string
  status: InvoiceStatus
  subtotal: number
  tax: number
  total: number
  items: InvoiceItem[]
  updated_at?: string
  reference?: string
  notes?: string
}
