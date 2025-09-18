export interface PaymentMethod {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export interface PaymentStatus {
  value: string;
  label: string;
  color: string;
  description: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    value: 'cash',
    label: 'Cash',
    icon: 'i-heroicons-banknotes',
    description: 'Cash payment'
  },
  {
    value: 'bank_transfer',
    label: 'Bank Transfer',
    icon: 'i-heroicons-building-library',
    description: 'Direct bank transfer'
  },
  {
    value: 'card',
    label: 'Card',
    icon: 'i-heroicons-credit-card',
    description: 'Credit or debit card payment'
  },
  {
    value: 'ach',
    label: 'ACH',
    icon: 'i-heroicons-building-library',
    description: 'Automated Clearing House transfer'
  },
  {
    value: 'mobile',
    label: 'Mobile',
    icon: 'i-heroicons-device-phone-mobile',
    description: 'Mobile payment (Apple Pay, Google Pay, etc.)'
  }
];

export const PAYMENT_STATUSES: PaymentStatus[] = [
  {
    value: 'pending',
    label: 'Pending',
    color: 'yellow',
    description: 'Payment is being processed'
  },
  {
    value: 'succeeded',
    label: 'Succeeded',
    color: 'green',
    description: 'Payment was successful'
  },
  {
    value: 'failed',
    label: 'Failed',
    color: 'red',
    description: 'Payment failed to process'
  },
  {
    value: 'refunded',
    label: 'Refunded',
    color: 'blue',
    description: 'Payment was refunded'
  }
];

export const getPaymentMethodByValue = (value: string): PaymentMethod | undefined => {
  return PAYMENT_METHODS.find(method => method.value === value);
};

export const getPaymentStatusByValue = (value: string): PaymentStatus | undefined => {
  return PAYMENT_STATUSES.find(status => status.value === value);
};

export const getPaymentStatusColor = (value: string): string => {
  const status = getPaymentStatusByValue(value);
  return status?.color || 'gray';
};


