// Export all constants from a single entry point
export * from './roles';
export * from './property';
export * from './maintenance';
export * from './ui';
export * from './units';
export * from './leases';
export * from './invoices';
export * from './payments';
export * from './documents';
export * from './subscription';

// Re-export commonly used constants for convenience
export { USER_ROLES, ROLE_OPTIONS, getRoleByValue, getRoleColor, getRolePermissions } from './roles';
export { 
  PROPERTY_TYPES, 
  PROPERTY_STATUSES, 
  PROPERTY_AMENITIES,
  getPropertyTypeByValue,
  getPropertyStatusByValue,
  getAmenitiesByCategory
} from './property';
export { 
  MAINTENANCE_PRIORITIES, 
  MAINTENANCE_STATUSES, 
  MAINTENANCE_CATEGORIES,
  getMaintenancePriorityByValue,
  getMaintenanceStatusByValue,
  getMaintenanceCategoryByValue
} from './maintenance';
export { 
  UNIT_STATUSES,
  getUnitStatusByValue,
  getUnitStatusColor
} from './units';
export { 
  LEASE_STATUSES,
  LEASE_CHARGE_CADENCES,
  getLeaseStatusByValue,
  getLeaseStatusColor,
  getLeaseChargeCadenceByValue
} from './leases';
export { 
  INVOICE_STATUSES,
  getInvoiceStatusByValue,
  getInvoiceStatusColor
} from './invoices';
export { 
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  getPaymentMethodByValue,
  getPaymentStatusByValue,
  getPaymentStatusColor
} from './payments';
export { 
  DOCUMENT_SUBJECT_TYPES,
  getDocumentSubjectTypeByValue
} from './documents';
export { 
  COLOR_SCHEMES, 
  UI_SIZES, 
  BREAKPOINTS, 
  SPACING,
  getColorScheme,
  getSpacing,
  getBreakpoint
} from './ui';

// Demo and utility constants
export * from './demo';
