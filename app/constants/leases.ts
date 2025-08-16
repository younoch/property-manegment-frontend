export interface LeaseStatus {
  value: string;
  label: string;
  color: string;
  description: string;
}

export interface LeaseChargeCadence {
  value: string;
  label: string;
  description: string;
}

export const LEASE_STATUSES: LeaseStatus[] = [
  {
    value: 'draft',
    label: 'Draft',
    color: 'gray',
    description: 'Lease is in draft form, not yet active'
  },
  {
    value: 'active',
    label: 'Active',
    color: 'green',
    description: 'Lease is currently active and in force'
  },
  {
    value: 'ended',
    label: 'Ended',
    color: 'blue',
    description: 'Lease has ended naturally'
  },
  {
    value: 'evicted',
    label: 'Evicted',
    color: 'red',
    description: 'Tenant was evicted from the property'
  },
  {
    value: 'broken',
    label: 'Broken',
    color: 'orange',
    description: 'Lease was broken by either party'
  }
];

export const LEASE_CHARGE_CADENCES: LeaseChargeCadence[] = [
  {
    value: 'monthly',
    label: 'Monthly',
    description: 'Charges are billed monthly'
  },
  {
    value: 'quarterly',
    label: 'Quarterly',
    description: 'Charges are billed every three months'
  },
  {
    value: 'yearly',
    label: 'Yearly',
    description: 'Charges are billed annually'
  }
];

export const getLeaseStatusByValue = (value: string): LeaseStatus | undefined => {
  return LEASE_STATUSES.find(status => status.value === value);
};

export const getLeaseStatusColor = (value: string): string => {
  const status = getLeaseStatusByValue(value);
  return status?.color || 'gray';
};

export const getLeaseChargeCadenceByValue = (value: string): LeaseChargeCadence | undefined => {
  return LEASE_CHARGE_CADENCES.find(cadence => cadence.value === value);
};


