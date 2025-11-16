import { ENDPOINTS } from '@/config/api';
import { createApiClient } from '@/utils/api';

export interface TokenResponse {
  message: string;
  expiresAt?: string;
  token?: string;
}

export interface JwtValidationResponse {
  valid: boolean;
  user?: any;
  message?: string;
}

export class TokenManager {
  private apiClient = createApiClient();
  private csrfToken: string | null = null;
  private jwtRefreshTimer: NodeJS.Timeout | null = null;
  private csrfRefreshTimer: NodeJS.Timeout | null = null;
  private isRefreshingJwt = false;
  private isRefreshingCsrf = false;
  private refreshQueue: Array<() => void> = [];
  private lastJwtRefresh: Date | null = null;
  private lastCsrfRefresh: Date | null = null;
  private readonly CSRF_ROTATE_INTERVAL = 20 * 60 * 1000;
  private readonly JWT_REFRESH_INTERVAL = 12 * 60 * 1000;
  private readonly CSRF_REFRESH_INTERVAL = 23 * 60 * 60 * 1000;

  constructor() {
    this.initializeTokenRefresh();
  }

  private initializeTokenRefresh() {
    if (process.client) {
      this.jwtRefreshTimer = setInterval(() => {
        this.checkAndRefreshJwtIfNeeded();
      }, 5 * 60 * 1000);

      const onVisible = () => {
        if (document.hidden) return;
        this.checkAndRotateCsrfIfNeeded();
      };
      window.addEventListener('focus', onVisible);
      document.addEventListener('visibilitychange', onVisible);
    }
  }

  private shouldRefreshJwt(): boolean {
    if (!this.lastJwtRefresh) return true;
    const timeSinceLastRefresh = Date.now() - this.lastJwtRefresh.getTime();
    return timeSinceLastRefresh >= this.JWT_REFRESH_INTERVAL;
  }

  private shouldRefreshCsrf(): boolean {
    if (!this.lastCsrfRefresh) return true;
    const timeSinceLastRefresh = Date.now() - this.lastCsrfRefresh.getTime();
    return timeSinceLastRefresh >= this.CSRF_REFRESH_INTERVAL;
  }

  private shouldRotateCsrf(): boolean {
    if (!this.lastCsrfRefresh) return true;
    const timeSinceLastRefresh = Date.now() - this.lastCsrfRefresh.getTime();
    return timeSinceLastRefresh >= this.CSRF_ROTATE_INTERVAL;
  }

  private async checkAndRefreshJwtIfNeeded(): Promise<void> {
    if (this.shouldRefreshJwt()) {
      await this.refreshJwtToken();
    }
  }

  private async checkAndRotateCsrfIfNeeded(): Promise<void> {
    if (this.shouldRotateCsrf()) {
      await this.refreshCsrfToken();
    }
  }

  getCsrfTokenValue(): string | null {
    return this.csrfToken;
  }

  async getCsrfToken(): Promise<string | null> {
    if (this.csrfToken) {
      return this.csrfToken;
    }
    return await this.fetchCsrfToken();
  }

  private async fetchCsrfToken(): Promise<string | null> {
    try {
      const response = await this.apiClient.get<TokenResponse>(ENDPOINTS.CSRF.TOKEN);
      
      if (response && typeof response === 'object') {
        let token: string | undefined;
        if ('token' in response && response.token) {
          token = response.token;
        } else if ('csrf_token' in response && (response as any).csrf_token) {
          token = (response as any).csrf_token;
        } else if ('csrfToken' in response && (response as any).csrfToken) {
          token = (response as any).csrfToken;
        } else if ('value' in response && (response as any).value) {
          token = (response as any).value;
        }

        if (token) {
          this.csrfToken = token;
          return token;
        }
      }
      
      return null;
    } catch (error: any) {
      console.error('❌ [TokenManager] Failed to fetch CSRF token:', error);
      return null;
    }
  }

  async refreshCsrfToken(): Promise<boolean> {
    if (this.isRefreshingCsrf) {
      return new Promise((resolve) => {
        this.refreshQueue.push(() => resolve(true));
      });
    }

    this.isRefreshingCsrf = true;
    
    try {
      let apiConfig = (this.apiClient as any).getApiConfig?.();
      if (!apiConfig) {
        try {
          const { getRuntimeApiConfig } = await import('@/config/api');
          apiConfig = getRuntimeApiConfig();
        } catch {
          const { useApiConfig } = await import('@/composables/useApiConfig');
          apiConfig = useApiConfig().API_CONFIG;
        }
      }
      const url = `${apiConfig.BASE_URL}${ENDPOINTS.CSRF.REFRESH}`;

      const fetchResponse = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(this.csrfToken ? { 'X-CSRF-Token': this.csrfToken } : {})
        }
      });

      const headerToken = fetchResponse.headers.get('X-CSRF-Token') || fetchResponse.headers.get('x-csrf-token');

      let body: TokenResponse | null = null;
      try {
        body = (await fetchResponse.json()) as TokenResponse;
      } catch {
        body = null;
      }

      if (fetchResponse.ok) {
        if (headerToken && headerToken.length > 0) {
          this.csrfToken = headerToken;
        } else if (body?.token) {
          this.csrfToken = body.token;
        }

        this.lastCsrfRefresh = new Date();
        this.resolveRefreshQueue();
        return true;
      }

      if (fetchResponse.status === 401) {
        console.warn('⚠️ [TokenManager] CSRF token expired (24h), clearing and will fetch new on next request');
        this.csrfToken = null;
        this.lastCsrfRefresh = null;
      }

      return false;
    } catch (error: any) {
      console.error('❌ [TokenManager] CSRF refresh failed:', error);
      return false;
    } finally {
      this.isRefreshingCsrf = false;
    }
  }

  async refreshJwtToken(): Promise<boolean> {
    if (this.isRefreshingJwt) {
      return new Promise((resolve) => {
        this.refreshQueue.push(() => resolve(true));
      });
    }

    this.isRefreshingJwt = true;
    
    try {
      const response = await this.apiClient.post<TokenResponse>(ENDPOINTS.AUTH.REFRESH);
      
      if (response && response.message) {
        this.lastJwtRefresh = new Date();
        this.resolveRefreshQueue();
        return true;
      }
      
      return false;
    } catch (error: any) {
      const status = error?.status || error?.response?.status;
      if (status === 401) {
        console.warn('⚠️ [TokenManager] Refresh token expired (7 days), user needs to login again');
        this.clearTokens();
        if (process.client) {
          const { navigateTo } = await import('nuxt/app');
          await navigateTo('/auth/login');
        }
      }
      return false;
    } finally {
      this.isRefreshingJwt = false;
    }
  }

  async validateJwtToken(): Promise<JwtValidationResponse> {
    try {
      const response = await this.apiClient.get<any>(ENDPOINTS.AUTH.WHOAMI);
      if (response) {
        const user = (response as any).data || (response as any).user || response;
        return { valid: true, user };
      }
      return { valid: false, message: 'Invalid whoami response' };
    } catch (error: any) {
      const status = error?.status || error?.response?.status;
      if (status === 401) {
        return { valid: false, message: 'Unauthorized' };
      }
      if (status === 403) {
        try { 
          console.warn('⚠️ [TokenManager] WHOAMI 403 → attempting CSRF refresh');
          await this.refreshCsrfToken(); 
        } catch {}
        return { valid: false, message: 'Forbidden' };
      }
      console.error('❌ [TokenManager] WHOAMI failed:', error);
      return { valid: false, message: error?.message || 'Validation failed' };
    }
  }

  async revokeJwtToken(): Promise<boolean> {
    try {
      const response = await this.apiClient.post(ENDPOINTS.AUTH.SIGNOUT);
      this.clearTokens();
      return true;
    } catch (error: any) {
      const status = error?.status || error?.response?.status;
      const message = error?.data?.message || error?.message || 'Unknown error';
      
      console.warn(`[TokenManager] Signout endpoint failed (${status}): ${message}`);
      
      this.clearTokens();
      
      return true;
    }
  }

  getCsrfHeader(): Record<string, string> {
    return this.csrfToken ? { 'X-CSRF-Token': this.csrfToken } : {};
  }

  setCsrfTokenFromHeader(token: string | null | undefined): void {
    if (!token) return;
    this.csrfToken = token;
    this.lastCsrfRefresh = new Date();
  }

  clearTokens(): void {
    this.csrfToken = null;
    this.lastJwtRefresh = null;
    this.lastCsrfRefresh = null;
    this.resolveRefreshQueue();
  }

  private resolveRefreshQueue(): void {
    while (this.refreshQueue.length > 0) {
      const resolve = this.refreshQueue.shift();
      if (resolve) resolve();
    }
  }

  destroy(): void {
    if (this.jwtRefreshTimer) {
      clearInterval(this.jwtRefreshTimer);
      this.jwtRefreshTimer = null;
    }
    
    if (this.csrfRefreshTimer) {
      clearTimeout(this.csrfRefreshTimer);
      this.csrfRefreshTimer = null;
    }
  }
}

export const tokenManager = new TokenManager();
