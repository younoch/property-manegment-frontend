export interface InvoiceStatus {
  value: string;
  label: string;
  color: string;
  description: string;
}

export const INVOICE_STATUSES: InvoiceStatus[] = [
  {
    value: 'draft',
    label: 'Draft',
    color: 'gray',
    description: 'Invoice is in draft form, not yet sent'
  },
  {
    value: 'open',
    label: 'Open',
    color: 'blue',
    description: 'Invoice has been sent and is awaiting payment'
  },
  {
    value: 'partially_paid',
    label: 'Partially Paid',
    color: 'yellow',
    description: 'Invoice has been partially paid'
  },
  {
    value: 'paid',
    label: 'Paid',
    color: 'green',
    description: 'Invoice has been fully paid'
  },
  {
    value: 'void',
    label: 'Void',
    color: 'red',
    description: 'Invoice has been voided and is no longer valid'
  }
];

export const getInvoiceStatusByValue = (value: string): InvoiceStatus | undefined => {
  return INVOICE_STATUSES.find(status => status.value === value);
};

export const getInvoiceStatusColor = (value: string): string => {
  const status = getInvoiceStatusByValue(value);
  return status?.color || 'gray';
};


