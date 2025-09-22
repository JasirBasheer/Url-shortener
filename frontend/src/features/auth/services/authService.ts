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

  setAccessToken(token: string): void {
    this.accessToken = token;
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
      // Clear the access token cookie on the frontend as well
      Cookies.remove('accessToken');
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
    // Check for access token cookie
    const accessToken = Cookies.get('accessToken');
    return !!accessToken;
  }
}

export const authService = new AuthService();
