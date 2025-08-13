import { sidebarNav, topHeaderNav } from '~/config/navigation'

export type UserRole = 'super_admin' | 'landlord' | 'manager' | 'tenant'

export function getSidebarNav(role: UserRole) {
  return sidebarNav.filter((item: any) => {
    if ((item as any).roles) return (item as any).roles.includes(role)
    return role !== 'tenant'
  })
}

export function getTopHeaderNav() {
  return topHeaderNav
}



