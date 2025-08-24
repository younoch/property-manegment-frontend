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
    color: 'neutral', // gray badge
    description: 'Lease is in draft form, not yet active'
  },
  {
    value: 'active',
    label: 'Active',
    color: 'primary', // blue (theme primary)
    description: 'Lease is currently active and in force'
  },
  {
    value: 'ended',
    label: 'Ended',
    color: 'success', // green = completed successfully
    description: 'Lease has ended naturally'
  },
  {
    value: 'evicted',
    label: 'Evicted',
    color: 'error', // red = negative outcome
    description: 'Tenant was evicted from the property'
  },
  {
    value: 'broken',
    label: 'Broken',
    color: 'warning', // amber/yellow = caution
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
  return status?.color || 'neutral';
};

export const getLeaseChargeCadenceByValue = (value: string): LeaseChargeCadence | undefined => {
  return LEASE_CHARGE_CADENCES.find(cadence => cadence.value === value);
};
