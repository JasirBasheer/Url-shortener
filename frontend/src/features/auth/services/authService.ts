import type { AuthResponse, SignInRequest, SignUpRequest, User } from '@/types';
import { api, extractError } from '@/utils';
import Cookies from 'js-cookie';

class AuthService {
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = Cookies.get('accessToken') || null;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/signup', data);
      return {
        user: response.data.user,
      };
    } catch (error: unknown) {
    throw new Error(extractError(error, 'Sign up failed'));
    }
  }

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/signin', data);
      return {
        user: response.data.data.user,
      };
    } catch (error: unknown) {
      throw new Error(extractError(error, 'Sign in failed'));
    }
  }

  async signOut(): Promise<void> {
    try {
      await api.post('/auth/signout');
      this.accessToken = null; 
    } catch (error: unknown) {
      throw new Error(extractError(error, 'Sign out failed'));
    }
  }

  async getUser(): Promise<User> {
    try {
      const response = await api.get('/auth/me');
      return response.data.data.user;
    } catch (error: unknown) {
      throw new Error(extractError(error, 'Failed to get user'));
    }
  }

  isAuthenticated(): boolean {
    return !!Cookies.get('accessToken');
  }
}

export const authService = new AuthService();
