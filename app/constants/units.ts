export interface UnitStatus {
  value: string;
  label: string;
  color: string;
  description: string;
}

export const UNIT_STATUSES: UnitStatus[] = [
  {
    value: 'vacant',
    label: 'Vacant',
    color: 'primary',
    description: 'Unit is available for rent'
  },
  {
    value: 'occupied',
    label: 'Occupied',
    color: 'secondary',
    description: 'Unit is currently rented'
  },
  {
    value: 'maintenance',
    label: 'Under Maintenance',
    color: 'warning',
    description: 'Unit is undergoing maintenance'
  },
  {
    value: 'offmarket',
    label: 'Off Market',
    color: 'neutral',
    description: 'Unit is not available for rent'
  }
];

export const getUnitStatusByValue = (value: string): UnitStatus | undefined => {
  return UNIT_STATUSES.find(status => status.value === value);
};


export const getUnitStatusColor = (value: string): string => {
  const status = getUnitStatusByValue(value);
  return status?.color || 'gray';
};


