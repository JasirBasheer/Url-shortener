import type { User } from "@/features/auth/services/authService";
import type { ReactNode } from "react";


export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}


export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (data: SignUpRequest) => Promise<void>;
  signIn: (data: SignInRequest) => Promise<void>;
  signOut: () => Promise<void>;
}


export interface AuthProviderProps {
  children: ReactNode;
}