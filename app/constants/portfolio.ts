export interface PortfolioStatus {
  value: 'active' | 'inactive' | 'suspended'
  label: string
  color?: string
  description?: string
}

export const PORTFOLIO_STATUSES: PortfolioStatus[] = [
  { 
    value: 'active', 
    label: 'Active',
    color: 'green',
    description: 'Portfolio is active and fully operational'
  },
  { 
    value: 'inactive', 
    label: 'Inactive',
    color: 'gray',
    description: 'Portfolio is not currently active'
  },
  { 
    value: 'suspended', 
    label: 'Suspended',
    color: 'orange',
    description: 'Portfolio access has been temporarily suspended'
  }
]
