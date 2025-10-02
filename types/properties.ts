export interface Property {
  id: number | string;
  account_id?: number; // Made optional since backend handles it
  portfolio_id?: number; // Owning portfolio
  name: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  property_type: string;
  number_of_units: number;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyStats {
  totalUnits: number;
  rentedUnits: number;
  activeTenants: number;
  totalRevenue: number;
  totalExpenses: number;
  overduePayments: any[]; // You might want to create a specific type for this
  activeLeases: number;
  monthlyRevenue: Array<{
    year: number;
    month: number;
    amount: number;
    label: string;
  }>;
  monthlyExpenses: Array<{
    year: number;
    month: number;
    amount: number;
    label: string;
  }>;
  occupancyRate: number;
  historicalOccupancy: Array<[string, number]>;
}

export interface Unit {
  id: number | string;
  portfolio_id: number;
  property_id: number;
  label: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  market_rent: number;
  status: 'vacant' | 'occupied' | 'maintenance' | 'offmarket';
  created_at?: string;
  updated_at?: string;
}

export interface AddPropertyPayload {
  account_id?: number; // Made optional since backend handles it
  portfolio_id: number; // Required: property must belong to a portfolio
  name: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  property_type: string;
  description?: string | null;
}

export interface AddUnitPayload {
  portfolio_id: number;
  property_id: number;
  label: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  market_rent: number;
  status: 'vacant' | 'occupied' | 'maintenance' | 'offmarket';
}

export type CreatedProperty = Property;
export type CreatedUnit = Unit;


