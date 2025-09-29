export const expenseStatuses = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'overdue', label: 'Overdue', color: 'red' }
] as const

export const expenseCategories = [
  { value: 'repairs', label: 'Repairs', icon: 'i-heroicons-wrench-screwdriver' },
  { value: 'utilities', label: 'Utilities', icon: 'i-heroicons-bolt' },
  { value: 'tax', label: 'Tax', icon: 'i-heroicons-document-text' },
  { value: 'insurance', label: 'Insurance', icon: 'i-heroicons-shield-check' },
  { value: 'maintenance', label: 'Maintenance', icon: 'i-heroicons-wrench' },
  { value: 'other', label: 'Other', icon: 'i-heroicons-ellipsis-horizontal' }
] as const

export type ExpenseStatus = typeof expenseStatuses[number]
export type ExpenseCategory = typeof expenseCategories[number]

/**
 * Get expense status by its value
 */
export const getExpenseStatusByValue = (value: string): ExpenseStatus | undefined => {
  return expenseStatuses.find(status => status.value === value)
}

/**
 * Get color for an expense status
 */
export const getExpenseStatusColor = (value: string): string => {
  const status = getExpenseStatusByValue(value)
  return status?.color || 'gray'
}

/**
 * Get expense category by its value
 */
export const getExpenseCategoryByValue = (value: string): ExpenseCategory | undefined => {
  return expenseCategories.find(category => category.value === value)
}

/**
 * Get icon for an expense category
 */
export const getExpenseCategoryIcon = (value: string): string => {
  const category = getExpenseCategoryByValue(value)
  return category?.icon || 'i-heroicons-question-mark-circle'
}

export const paymentMethods = [
  { value: 'credit_card', label: 'Credit Card', icon: 'i-heroicons-credit-card' },
  { value: 'debit_card', label: 'Debit Card', icon: 'i-heroicons-credit-card' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: 'i-heroicons-banknotes' },
  { value: 'ach_transfer', label: 'ACH Transfer', icon: 'i-heroicons-arrow-path' },
  { value: 'wire_transfer', label: 'Wire Transfer', icon: 'i-heroicons-arrow-up-right' },
  { value: 'check', label: 'Check', icon: 'i-heroicons-document-text' },
  { value: 'money_order', label: 'Money Order', icon: 'i-heroicons-document-duplicate' },
  { value: 'cash', label: 'Cash', icon: 'i-heroicons-banknotes' },
  { value: 'paypal', label: 'PayPal', icon: 'i-simple-icons-paypal' },
  { value: 'venmo', label: 'Venmo', icon: 'i-simple-icons-venmo' },
  { value: 'zelle', label: 'Zelle', icon: 'i-simple-icons-zelle' },
  { value: 'cash_app', label: 'Cash App', icon: 'i-simple-icons-cashapp' },
  { value: 'cryptocurrency', label: 'Cryptocurrency', icon: 'i-heroicons-currency-dollar' },
  { value: 'other', label: 'Other', icon: 'i-heroicons-ellipsis-horizontal' }
] as const
