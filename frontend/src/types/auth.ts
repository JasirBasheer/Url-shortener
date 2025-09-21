import type { ReactNode } from "react";
import type { User } from "./user";


export interface AuthResponse {
  user: User;
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