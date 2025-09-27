export interface PortfolioRow {
  id?: number | string
  name: string
  status?: string
  subscription_plan?: string
  timezone?: string
  email?: string
  phone?: string
  website?: string
  logo_url?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  tax_id?: string
  registration_number?: string
  vat_number?: string
  provider_customer_id?: string
  currency?: string
  created_at?: string
  updated_at?: string
  [key: string]: any
}
