export interface Property {
  id: number | string;
  account_id: number;
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

export interface AddPropertyPayload {
  account_id: number;
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
}

export type CreatedProperty = Property;


