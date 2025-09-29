export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'tenant' | 'landlord' | 'manager' | 'super_admin';
  profile_image_url?: string;
  is_active?: boolean;
  requires_onboarding?: boolean;
  onboarding_completed_at?: string | null;
  last_activity?: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  errorType: string;
  [key: string]: any; // For any additional fields that might be present
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  lastActivity?: Date | null;
  error?: string | null;
  lastAuthCheck?: Date | null;
  lastCsrfCheck?: Date | null;
  authCacheDuration?: number;
  csrfCacheDuration?: number;
  apiError?: ErrorResponse | null;
}
