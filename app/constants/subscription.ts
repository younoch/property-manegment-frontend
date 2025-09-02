export interface SubscriptionPlan {
  value: string;
  label: string;
  description: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    value: 'free',
    label: 'Free',
    description: 'Free plan for individuals or small portfolios'
  },
  {
    value: 'basic',
    label: 'Basic',
    description: 'Core features for individuals or small portfolios'
  },
  {
    value: 'premium',
    label: 'Premium',
    description: 'Advanced features for growing teams'
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    description: 'Full platform capabilities and support'
  }
];

export const SUBSCRIPTION_PLAN_OPTIONS = SUBSCRIPTION_PLANS.map(plan => ({
  label: plan.label,
  value: plan.value
}));

export const getSubscriptionPlanByValue = (value: string): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.value === value);
};

export const getSubscriptionPlanLabel = (value: string): string => {
  const plan = getSubscriptionPlanByValue(value);
  return plan?.label || value;
};


