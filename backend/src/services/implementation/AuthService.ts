import { SignInDto, SignUpDto } from '@/dto';
import { IUserDocument } from '../../models';
import { IUserRepository } from '../../repositories';
import { AuthResponse } from '@/types';
import { AuthenticationError, comparePassword, ConflictError, generateTokens, hashPassword, logInfo, logWarn } from '../../utils';
import { injectable, inject } from 'tsyringe';
import { IAuthService } from '../interface/IAuthService';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async signUp(dto: SignUpDto): Promise<AuthResponse> {

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      logWarn('user already exists', { email: dto.email });
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await hashPassword(dto.password);

    const newUser = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const tokens = generateTokens({
      userId: newUser._id.toString(),
      email: newUser.email,
    });

    return {
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {

    const user: IUserDocument | null = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      logWarn('SignIn failed - user not found', { email: dto.email });
      throw new AuthenticationError('Invalid email or password');
    }
    const isPasswordValid = await comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      logWarn('SignIn failed - invalid password', { email: dto.email });
      throw new AuthenticationError('Invalid email or password');
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }


  async getUser(userId: string): Promise<{ id: string; name: string; email: string } | null> {
    
    const user = await this.userRepository.findById(userId);
    if (!user) {
      logWarn('user not found', { userId });
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}
