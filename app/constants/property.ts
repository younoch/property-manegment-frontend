export interface PropertyType {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export interface PropertyStatus {
  value: string;
  label: string;
  color: string;
  description: string;
}

export interface Amenity {
  value: string;
  label: string;
  icon: string;
  category: 'basic' | 'luxury' | 'outdoor' | 'security';
}

export const PROPERTY_TYPES: PropertyType[] = [
  {
    value: 'apartment',
    label: 'Apartment',
    icon: 'i-heroicons-building-office-2',
    description: 'Multi-unit residential building'
  },
  {
    value: 'house',
    label: 'House',
    icon: 'i-heroicons-home',
    description: 'Single-family residential home'
  },
  {
    value: 'condo',
    label: 'Condo',
    icon: 'i-heroicons-building-office',
    description: 'Individually owned unit in shared building'
  },
  {
    value: 'townhouse',
    label: 'Townhouse',
    icon: 'i-heroicons-home-modern',
    description: 'Multi-story attached home'
  },
  {
    value: 'duplex',
    label: 'Duplex',
    icon: 'i-heroicons-home-modern',
    description: 'Two-unit residential building'
  },
  {
    value: 'studio',
    label: 'Studio',
    icon: 'i-heroicons-home-modern',
    description: 'Single-room apartment'
  }
];

export const PROPERTY_STATUSES: PropertyStatus[] = [
  {
    value: 'available',
    label: 'Available',
    color: 'green',
    description: 'Property is available for rent'
  },
  {
    value: 'rented',
    label: 'Rented',
    color: 'blue',
    description: 'Property is currently rented'
  },
  {
    value: 'maintenance',
    label: 'Under Maintenance',
    color: 'yellow',
    description: 'Property is undergoing maintenance'
  },
  {
    value: 'unavailable',
    label: 'Unavailable',
    color: 'red',
    description: 'Property is not available for rent'
  },
  {
    value: 'reserved',
    label: 'Reserved',
    color: 'purple',
    description: 'Property is reserved for future tenant'
  }
];

export const PROPERTY_AMENITIES: Amenity[] = [
  // Basic amenities
  {
    value: 'parking',
    label: 'Parking',
    icon: 'i-heroicons-truck',
    category: 'basic'
  },
  {
    value: 'laundry',
    label: 'Laundry',
    icon: 'i-heroicons-arrow-path',
    category: 'basic'
  },
  {
    value: 'heating',
    label: 'Heating',
    icon: 'i-heroicons-fire',
    category: 'basic'
  },
  {
    value: 'air_conditioning',
    label: 'Air Conditioning',
    icon: 'i-heroicons-snowflake',
    category: 'basic'
  },
  {
    value: 'wifi',
    label: 'WiFi',
    icon: 'i-heroicons-signal',
    category: 'basic'
  },
  
  // Luxury amenities
  {
    value: 'gym',
    label: 'Gym',
    icon: 'i-heroicons-muscle',
    category: 'luxury'
  },
  {
    value: 'pool',
    label: 'Swimming Pool',
    icon: 'i-heroicons-swimming-pool',
    category: 'luxury'
  },
  {
    value: 'elevator',
    label: 'Elevator',
    icon: 'i-heroicons-arrow-up',
    category: 'luxury'
  },
  {
    value: 'doorman',
    label: 'Doorman',
    icon: 'i-heroicons-user',
    category: 'luxury'
  },
  
  // Outdoor amenities
  {
    value: 'balcony',
    label: 'Balcony',
    icon: 'i-heroicons-home-modern',
    category: 'outdoor'
  },
  {
    value: 'garden',
    label: 'Garden',
    icon: 'i-heroicons-tree',
    category: 'outdoor'
  },
  {
    value: 'patio',
    label: 'Patio',
    icon: 'i-heroicons-home-modern',
    category: 'outdoor'
  },
  
  // Security amenities
  {
    value: 'security_system',
    label: 'Security System',
    icon: 'i-heroicons-shield-check',
    category: 'security'
  },
  {
    value: 'cctv',
    label: 'CCTV',
    icon: 'i-heroicons-video-camera',
    category: 'security'
  },
  {
    value: 'gated',
    label: 'Gated Community',
    icon: 'i-heroicons-lock-closed',
    category: 'security'
  }
];

export const getPropertyTypeByValue = (value: string): PropertyType | undefined => {
  return PROPERTY_TYPES.find(type => type.value === value);
};

export const getPropertyStatusByValue = (value: string): PropertyStatus | undefined => {
  return PROPERTY_STATUSES.find(status => status.value === value);
};

export const getAmenitiesByCategory = (category: Amenity['category']): Amenity[] => {
  return PROPERTY_AMENITIES.filter(amenity => amenity.category === category);
};
