export const topHeaderNav = [
  { label: 'Dashboard', to: '/app/dashboard', icon: 'i-heroicons-home' },
  { label: 'Settings', to: '/app/settings', icon: 'i-heroicons-cog-6-tooth' }
]

export const sidebarNav = [
  { label: 'Leases', to: '/app/leases', icon: 'i-heroicons-document-text' },
  { label: 'Units', to: '/app/units', icon: 'i-heroicons-home-modern' },
  { label: 'Expenses', to: '/app/expenses', icon: 'i-heroicons-currency-dollar' },
  { label: 'Tenants', to: '/app/tenants', icon: 'i-heroicons-users' },
  { label: 'Properties', to: '/app/properties', icon: 'i-heroicons-building-office' },
  { 
    label: 'Communication', 
    to: '/app/communication', 
    icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
    badge: 'Coming Soon',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  { 
    label: 'Maintenance', 
    to: '/app/maintenance', 
    icon: 'i-heroicons-wrench-screwdriver',
    badge: 'Coming Soon',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  { 
    label: 'Management', 
    to: '/app/management', 
    icon: 'i-heroicons-clipboard-document-list',
    badge: 'Coming Soon',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  
  { 
    label: 'Payments', 
    to: '/app/payments', 
    icon: 'i-heroicons-banknotes',
    badge: 'Coming Soon',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  { 
    label: 'User Management', 
    to: '/app/users', 
    icon: 'i-heroicons-identification', 
    roles: ['super_admin'] 
  },
]
