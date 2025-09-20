import type { AuthResponse, SignInRequest, SignUpRequest, User } from '@/types';
import { httpClient } from './httpClient';
import Cookies from "js-cookie";


class AuthService {
  private accessToken: string | null = null;

  constructor() { 
    this.accessToken = Cookies.get("accessToken") || null;
  }


  private setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await httpClient.post('/auth/signup', data, { skipAuth: true });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Sign up failed');
    }

    const result = await response.json();
    this.setAccessToken(result.data.accessToken);
    return result.data;
  }

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    const response = await httpClient.post('/auth/signin', data, { skipAuth: true });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Sign in failed');
    }

    const result = await response.json();
    this.setAccessToken(result.data.accessToken);
    return result.data;
  }

  async signOut(): Promise<void> {
    const response = await httpClient.post('/auth/signout');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Sign out failed');
    }

    this.accessToken = null;
  }


  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get('/auth/me');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user');
    }

    const result = await response.json();
    return result.data.user;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const authService = new AuthService();
