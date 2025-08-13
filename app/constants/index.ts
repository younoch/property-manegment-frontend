// Export all constants from a single entry point
export * from './roles';
export * from './property';
export * from './maintenance';
export * from './ui';

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
