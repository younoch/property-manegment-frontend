export interface Role {
  value: string;
  label: string;
  description: string;
  color: string;
  permissions: string[];
}

export const USER_ROLES: Role[] = [
  {
    value: 'tenant',
    label: 'Tenant',
    description: 'Property tenant with limited access',
    color: 'info',
    permissions: ['view_own_properties', 'submit_maintenance_requests', 'view_own_rental_history']
  },
  {
    value: 'landlord',
    label: 'Landlord',
    description: 'Property owner with management capabilities',
    color: 'success',
    permissions: ['manage_properties', 'view_tenants', 'manage_rentals', 'view_financial_reports']
  },
  {
    value: 'manager',
    label: 'Property Manager',
    description: 'Professional property management staff',
    color: 'warning',
    permissions: ['manage_properties', 'manage_tenants', 'handle_maintenance', 'view_reports', 'manage_rentals']
  },
  {
    value: 'super_admin',
    label: 'Super Admin',
    description: 'Full system access and control',
    color: 'error',
    permissions: ['all_permissions', 'manage_users', 'system_configuration', 'view_all_data']
  }
];

export const ROLE_OPTIONS = USER_ROLES.map(role => ({
  label: role.label,
  value: role.value
}));

export const getRoleByValue = (value: string): Role | undefined => {
  return USER_ROLES.find(role => role.value === value);
};

export const getRoleColor = (value: string): string => {
  const role = getRoleByValue(value);
  return role?.color || 'gray';
};

export const getRolePermissions = (value: string): string[] => {
  const role = getRoleByValue(value);
  return role?.permissions || [];
};

export const getRoleLabel = (value: string): string => {
  const role = getRoleByValue(value);
  return role?.label || value;
};
