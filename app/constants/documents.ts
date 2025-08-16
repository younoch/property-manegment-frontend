export interface DocumentSubjectType {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export const DOCUMENT_SUBJECT_TYPES: DocumentSubjectType[] = [
  {
    value: 'lease',
    label: 'Lease',
    icon: 'i-heroicons-document-text',
    description: 'Lease agreement documents'
  },
  {
    value: 'maintenance_request',
    label: 'Maintenance Request',
    icon: 'i-heroicons-wrench-screwdriver',
    description: 'Maintenance request documents'
  },
  {
    value: 'invoice',
    label: 'Invoice',
    icon: 'i-heroicons-receipt-percent',
    description: 'Invoice and billing documents'
  },
  {
    value: 'property',
    label: 'Property',
    icon: 'i-heroicons-home',
    description: 'Property-related documents'
  },
  {
    value: 'unit',
    label: 'Unit',
    icon: 'i-heroicons-building-office-2',
    description: 'Unit-specific documents'
  },
  {
    value: 'tenant',
    label: 'Tenant',
    icon: 'i-heroicons-user',
    description: 'Tenant-related documents'
  },
  {
    value: 'other',
    label: 'Other',
    icon: 'i-heroicons-document',
    description: 'Other document types'
  }
];

export const getDocumentSubjectTypeByValue = (value: string): DocumentSubjectType | undefined => {
  return DOCUMENT_SUBJECT_TYPES.find(type => type.value === value);
};


