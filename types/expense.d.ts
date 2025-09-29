export interface Expense {
  id?: string | number;
  dateIncurred: string;
  category: string;
  amount: number;
  vendor: string;
  status: 'pending' | 'paid' | 'overdue';
  property: string;
  description: string;
  receipt?: File | string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseFilters {
  search?: string;
  status?: string[];
  category?: string[];
  dateFrom?: string;
  dateTo?: string;
  property?: string[];
}

export interface ExpenseSummary {
  total: number;
  pending: number;
  paid: number;
  overdue: number;
  byCategory: Array<{ category: string; amount: number }>;
}

export const expenseStatuses = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'overdue', label: 'Overdue', color: 'red' }
] as const;

export const expenseCategories = [
  { value: 'repairs', label: 'Repairs', icon: 'i-heroicons-wrench-screwdriver' },
  { value: 'utilities', label: 'Utilities', icon: 'i-heroicons-bolt' },
  { value: 'tax', label: 'Tax', icon: 'i-heroicons-document-text' },
  { value: 'insurance', label: 'Insurance', icon: 'i-heroicons-shield-check' },
  { value: 'maintenance', label: 'Maintenance', icon: 'i-heroicons-wrench' },
  { value: 'other', label: 'Other', icon: 'i-heroicons-ellipsis-horizontal' }
] as const;

export type ExpenseStatus = typeof expenseStatuses[number]['value'];
export type ExpenseCategory = typeof expenseCategories[number]['value'];
