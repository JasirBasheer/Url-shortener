import { SignInDto, SignUpDto } from "@/dto";
import { AuthResponse } from "@/types/auth";

export interface IAuthService {
  signUp(dto: SignUpDto): Promise<AuthResponse>;
  signIn(dto: SignInDto): Promise<AuthResponse>;
  getUser(userId: string): Promise<{ id: string; name: string; email: string } | null>;
}
