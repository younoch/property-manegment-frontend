export interface MaintenancePriority {
  value: string;
  label: string;
  color: string;
  description: string;
  responseTime: string;
}

export interface MaintenanceStatus {
  value: string;
  label: string;
  color: string;
  description: string;
}

export interface MaintenanceCategory {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export const MAINTENANCE_PRIORITIES: MaintenancePriority[] = [
  {
    value: 'low',
    label: 'Low',
    color: 'green',
    description: 'Non-urgent maintenance that can be scheduled',
    responseTime: 'Within 7 days'
  },
  {
    value: 'medium',
    label: 'Medium',
    color: 'yellow',
    description: 'Important maintenance that should be addressed soon',
    responseTime: 'Within 3 days'
  },
  {
    value: 'high',
    label: 'High',
    color: 'orange',
    description: 'Urgent maintenance affecting daily use',
    responseTime: 'Within 24 hours'
  },
  {
    value: 'emergency',
    label: 'Emergency',
    color: 'red',
    description: 'Emergency maintenance requiring immediate attention',
    responseTime: 'Within 4 hours'
  }
];

export const MAINTENANCE_STATUSES: MaintenanceStatus[] = [
  {
    value: 'open',
    label: 'Open',
    color: 'gray',
    description: 'Request submitted, waiting for review'
  },
  {
    value: 'in_progress',
    label: 'In Progress',
    color: 'orange',
    description: 'Maintenance work has started'
  },
  {
    value: 'completed',
    label: 'Completed',
    color: 'green',
    description: 'Maintenance work completed'
  },
  {
    value: 'canceled',
    label: 'Canceled',
    color: 'red',
    description: 'Request was cancelled'
  }
];

export const MAINTENANCE_CATEGORIES: MaintenanceCategory[] = [
  {
    value: 'plumbing',
    label: 'Plumbing',
    icon: 'i-heroicons-truck',
    description: 'Water, pipes, fixtures, and drainage issues'
  },
  {
    value: 'electrical',
    label: 'Electrical',
    icon: 'i-heroicons-bolt',
    description: 'Wiring, outlets, switches, and electrical systems'
  },
  {
    value: 'hvac',
    label: 'HVAC',
    icon: 'i-heroicons-fire',
    description: 'Heating, ventilation, and air conditioning'
  },
  {
    value: 'appliances',
    label: 'Appliances',
    icon: 'i-heroicons-cog',
    description: 'Kitchen and laundry appliances'
  },
  {
    value: 'structural',
    label: 'Structural',
    icon: 'i-heroicons-home-modern',
    description: 'Walls, floors, ceilings, and structural integrity'
  },
  {
    value: 'pest_control',
    label: 'Pest Control',
    icon: 'i-heroicons-bug-ant',
    description: 'Insect, rodent, and pest issues'
  },
  {
    value: 'landscaping',
    label: 'Landscaping',
    icon: 'i-heroicons-tree',
    description: 'Garden, lawn, and outdoor maintenance'
  },
  {
    value: 'security',
    label: 'Security',
    icon: 'i-heroicons-shield-check',
    description: 'Locks, security systems, and safety features'
  },
  {
    value: 'other',
    label: 'Other',
    icon: 'i-heroicons-wrench-screwdriver',
    description: 'Other maintenance categories'
  }
];

export const getMaintenancePriorityByValue = (value: string): MaintenancePriority | undefined => {
  return MAINTENANCE_PRIORITIES.find(priority => priority.value === value);
};

export const getMaintenanceStatusByValue = (value: string): MaintenanceStatus | undefined => {
  return MAINTENANCE_STATUSES.find(status => status.value === value);
};

export const getMaintenanceCategoryByValue = (value: string): MaintenanceCategory | undefined => {
  return MAINTENANCE_CATEGORIES.find(category => category.value === value);
};
