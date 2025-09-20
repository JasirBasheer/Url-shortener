import { AuthResponse } from "@/types/auth";


export interface IAuthService {
  signUp(dto: SignUpDTO): Promise<AuthResponse>;
  signIn(dto: SignInDTO): Promise<AuthResponse>;
  refreshToken(dto: RefreshTokenDTO): Promise<AuthResponse>;
  getCurrentUser(userId: string): Promise<{ id: string; name: string; email: string } | null>;
}
