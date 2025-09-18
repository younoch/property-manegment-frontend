export const topHeaderNav = [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-heroicons-home' },
  { label: 'Settings', to: '/settings', icon: 'i-heroicons-cog-6-tooth' }
]

export const sidebarNav = [
  { label: 'Leases', to: '/leases', icon: 'i-heroicons-document-text' },
  { label: 'Units', to: '/units', icon: 'i-heroicons-home-modern' },
  { label: 'Tenants', to: '/tenants', icon: 'i-heroicons-users' },
  { label: 'Properties', to: '/properties', icon: 'i-heroicons-building-office' },
  { label: 'Portfolios', to: '/portfolios', icon: 'i-heroicons-briefcase' },
  { 
    label: 'Communication', 
    to: '/communication', 
    icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
    badge: 'Coming Soon',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  { 
    label: 'Maintenance', 
    to: '/maintenance', 
    icon: 'i-heroicons-wrench-screwdriver',
    badge: 'Coming Soon',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  { 
    label: 'Management', 
    to: '/management', 
    icon: 'i-heroicons-clipboard-document-list',
    badge: 'Coming Soon',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  
  { 
    label: 'Payments', 
    to: '/payments', 
    icon: 'i-heroicons-banknotes',
    badge: 'Coming Soon',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  { 
    label: 'User Management', 
    to: '/users', 
    icon: 'i-heroicons-identification', 
    roles: ['super_admin'] 
  },
]
