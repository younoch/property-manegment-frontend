export type InvoiceType = 'rent'|'deposit'|'adjustment'
export type InvoiceStatus = 'open'|'paid'|'void'|'overdue'

export interface Invoice {
  id: string
  portfolio_id: string
  lease_id: string
  type: InvoiceType
  period?: string
  issue_date: string
  due_date: string
  amount: number
  status: InvoiceStatus
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  portfolio_id: string
  lease_id: string
  amount: number
  method: 'cash'|'bank'|'mobile'|'other'
  at: string
  reference?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}
