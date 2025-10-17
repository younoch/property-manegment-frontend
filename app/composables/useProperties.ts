import type { Property, AddPropertyPayload } from '~/types/properties'
import { createProtectedApiClient } from '~/utils/api'

export interface UpdatePropertyData extends Partial<AddPropertyPayload> {
  id: string;
}

export const useProperties = () => {
  const properties = useState<Property[]>('properties', () => []);
  const loading = useState<boolean>('properties-loading', () => false);
  const error = useState<string | null>('properties-error', () => null);

  // Use the protected API client for CSRF-protected requests
  const api = createProtectedApiClient();

  // Get all properties
  const fetchProperties = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await api.get<Property[]>('/properties');
      properties.value = data;
      return { success: true, properties: data };
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to fetch properties';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Get property by ID
  const fetchProperty = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await api.get<Property>(`/properties/${id}`);
      return { success: true, property: data };
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to fetch property';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Create new property - Uses CSRF protection
  const createProperty = async (propertyData: AddPropertyPayload) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await api.post<Property>('/properties', propertyData);
      
      // Add to local state
      properties.value.push(data);
      
      return { success: true, property: data };
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to create property';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Update property - Uses CSRF protection
  const updateProperty = async (propertyData: UpdatePropertyData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await api.patch<Property>(`/properties/${propertyData.id}`, propertyData);
      
      // Update local state
      const index = properties.value.findIndex((p: Property) => p.id === propertyData.id);
      if (index !== -1) {
        properties.value[index] = data;
      }
      
      return { success: true, property: data };
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to update property';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Delete property - Uses CSRF protection
  const deleteProperty = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      await api.delete(`/properties/${id}`);
      
      // Remove from local state
      properties.value = properties.value.filter((p: Property) => p.id !== id);
      
      return { success: true };
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to delete property';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Get properties by owner
  const fetchPropertiesByOwner = async (ownerId: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await api.get<Property[]>(`/properties?ownerId=${ownerId}`);
      return { success: true, properties: data };
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to fetch owner properties';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Search properties
  const searchProperties = async (query: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await api.get<Property[]>(`/properties/search?q=${encodeURIComponent(query)}`);
      return { success: true, properties: data };
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to search properties';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    properties: readonly(properties),
    loading: readonly(loading),
    error: readonly(error),
    
    // Methods
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    fetchPropertiesByOwner,
    searchProperties
  };
};
