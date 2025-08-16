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
    color: 'green',
    description: 'Unit is available for rent'
  },
  {
    value: 'occupied',
    label: 'Occupied',
    color: 'blue',
    description: 'Unit is currently rented'
  },
  {
    value: 'maintenance',
    label: 'Under Maintenance',
    color: 'yellow',
    description: 'Unit is undergoing maintenance'
  }
];

export const getUnitStatusByValue = (value: string): UnitStatus | undefined => {
  return UNIT_STATUSES.find(status => status.value === value);
};

export const getUnitStatusColor = (value: string): string => {
  const status = getUnitStatusByValue(value);
  return status?.color || 'gray';
};


