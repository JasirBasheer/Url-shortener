import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class HttpClient {
  private async makeRequest(url: string, options: RequestOptions = {}): Promise<Response> {
    const { skipAuth, ...fetchOptions } = options;
    
    const config: RequestInit = {
      ...fetchOptions,
      credentials: 'include',
    };

    if (!skipAuth) {
      const token = authService.getAccessToken();
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(`${API_BASE_URL}${url}`, config);

    // Handle 401 errors by redirecting to sign in
    if (response.status === 401 && !skipAuth) {
      window.location.href = '/auth/sign-in';
      throw new Error('Authentication failed');
    }

    return response;
  }

  async get(url: string, options: RequestOptions = {}): Promise<Response> {
    return this.makeRequest(url, { ...options, method: 'GET' });
  }

  async post(url: string, data?: unknown, options: RequestOptions = {}): Promise<Response> {
    return this.makeRequest(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(url: string, data?: unknown, options: RequestOptions = {}): Promise<Response> {
    return this.makeRequest(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(url: string, options: RequestOptions = {}): Promise<Response> {
    return this.makeRequest(url, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
