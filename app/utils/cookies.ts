/**
 * Cookie utility functions for authentication
 */

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null; // SSR safety
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Set a cookie
 */
export function setCookie(name: string, value: string, options: {
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
} = {}): void {
  if (typeof document === 'undefined') return; // SSR safety
  
  let cookie = `${name}=${value}`;
  
  if (options.expires) {
    cookie += `; expires=${options.expires.toUTCString()}`;
  }
  
  if (options.path) {
    cookie += `; path=${options.path}`;
  }
  
  if (options.domain) {
    cookie += `; domain=${options.domain}`;
  }
  
  if (options.secure) {
    cookie += '; secure';
  }
  
  if (options.sameSite) {
    cookie += `; samesite=${options.sameSite}`;
  }
  
  document.cookie = cookie;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, options: {
  path?: string;
  domain?: string;
} = {}): void {
  if (typeof document === 'undefined') return; // SSR safety
  
  setCookie(name, '', {
    ...options,
    expires: new Date(0)
  });
}

/**
 * Check if a cookie exists and has a value
 */
export function hasCookie(name: string): boolean {
  const value = getCookie(name);
  return value !== null && value !== '';
}

/**
 * Get all cookies as an object
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {}; // SSR safety
  
  const cookies: Record<string, string> = {};
  const cookieString = document.cookie;
  
  if (cookieString) {
    cookieString.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }
  
  return cookies;
}

/**
 * Log all cookies for debugging
 */
export function logCookies(): void {
  if (typeof document === 'undefined') return; // SSR safety
  
  const cookies = getAllCookies();

  
  // Log specific auth-related cookies
  const authCookies = ['access_token', 'refresh_token', 'token', 'auth_token', 'session'];
  authCookies.forEach(cookieName => {
    const value = getCookie(cookieName);
    if (value) {

    }
  });
  
  // Log cookie details for debugging

}

/**
 * Check if a cookie might be HttpOnly (we can't directly check, but we can infer)
 * This is useful for debugging authentication issues
 */
export async function checkCookieAccessibility(): Promise<void> {
  if (typeof document === 'undefined') return; // SSR safety
  

  
  // Check if we can access cookies at all
  try {
    const testCookie = 'test_cookie_' + Date.now();
    document.cookie = `${testCookie}=test_value`;
    const canRead = getCookie(testCookie);
    document.cookie = `${testCookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    if (canRead) {
      // JavaScript can read and write cookies
    } else {
      // JavaScript cannot read cookies (might be HttpOnly)
    }
  } catch (error) {
    
  }
  
  // Check for common cookie issues
  const currentDomain = window.location.hostname;
  const currentOrigin = window.location.origin;
  

  
  // Check if we're on localhost vs production
  if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {

  }
  
  // Check for cross-origin issues
  try {
    let baseUrl: string | undefined;
    try {
      const { getRuntimeApiConfig } = await import('../config/api');
      baseUrl = getRuntimeApiConfig().BASE_URL;
    } catch {
      const { useApiConfig } = await import('../composables/useApiConfig');
      baseUrl = useApiConfig().API_CONFIG.BASE_URL;
    }
    const frontendOrigin = window.location.origin;
    const backendOrigin = (baseUrl || '').replace('/api', '');
    if (frontendOrigin !== backendOrigin) {
      // Cross-origin development detected
    } else {
      // Same-origin development
    }
  } catch (error) {
    // ignore
  }
}

/**
 * Test setting a cookie to check domain/path restrictions
 */
export function testCookieSetting(): void {
  if (typeof document === 'undefined') return; // SSR safety
  

  
  const testCookies = [
    { name: 'test_basic', value: 'basic_value' },
    { name: 'test_path', value: 'path_value', options: { path: '/' } },
    { name: 'test_domain', value: 'domain_value', options: { domain: window.location.hostname } },
    { name: 'test_secure', value: 'secure_value', options: { secure: true } },
    { name: 'test_samesite', value: 'samesite_value', options: { sameSite: 'lax' as const } }
  ];
  
  testCookies.forEach(({ name, value, options = {} }) => {
    try {
      setCookie(name, value, options);
      const readValue = getCookie(name);
      
      if (readValue === value) {
        // Successfully set and read
      } else {
        // Set but couldn't read
      }
      
      // Clean up
      deleteCookie(name, options);
    } catch (error) {
      
    }
  });
}
