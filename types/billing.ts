export type InvoiceType = 'rent'|'deposit'|'adjustment'
export type InvoiceStatus = 'open'|'paid'|'void'|'overdue'

export interface Invoice {
  id: number
  portfolio_id: number
  lease_id: number
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
  id: number
  portfolio_id: number
  lease_id: number
  amount: number
  method: 'cash'|'bank'|'mobile'|'other'
  at: string
  reference?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}
