export interface Expense {
  id?: string;
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

export type ExpenseStatus = 'pending' | 'paid' | 'overdue';
export type ExpenseCategory = 'repairs' | 'utilities' | 'tax' | 'insurance' | 'maintenance' | 'other';
