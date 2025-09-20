import { SignInDto, SignUpDto } from '@/dto';
import { IUserRepository } from '@/repositories';
import { AuthResponse } from '@/types';
import { ConflictError, generateTokenPair, hashPassword, logInfo, logWarn } from '@/utils';
import { injectable, inject } from 'tsyringe';

@injectable()
export class AuthService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    logInfo('SignUp service started', { email: dto.email });

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      logWarn('SignUp failed - user already exists', { email: dto.email });
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await hashPassword(dto.password);

    const newUser = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const tokens = generateTokenPair({
      userId: newUser._id.toString(),
      email: newUser.email,
    });

    logInfo('SignUp completed successfully', { userId: newUser._id });

    return {
      user: {
        id: newUser._id,
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
    logInfo('SignIn service started', { email: dto.email });
    
   

    const user: IUser | null = await this.userRepository.find(dto.email);
    if (!user) {
      logWarn('SignIn failed - user not found', { email: dto.email });
      throw new AuthenticationException('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await this.passwordService.comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      logWarn('SignIn failed - invalid password', { email: dto.email });
      throw new AuthenticationException('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const tokens = this.jwtService.generateTokenPair({
      userId: user._id,
      email: user.email,
    });

    logInfo('SignIn completed successfully', { userId: user._id });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDTO): Promise<AuthResponse> {
    logInfo('RefreshToken service started');
    
    const validationErrors = dto.validate();
    if (validationErrors.length > 0) {
      logWarn('RefreshToken validation failed', { errors: validationErrors });
      throw new ValidationException(`Validation failed: ${validationErrors.join(', ')}`, 'VALIDATION_ERROR');
    }

    const tokenPayload = this.jwtService.verifyRefreshToken(dto.refreshToken);

    const user = await this.userRepository.findById(tokenPayload.userId);
    if (!user) {
      logWarn('RefreshToken failed - user not found', { userId: tokenPayload.userId });
      throw new AuthenticationException('User not found', 'USER_NOT_FOUND');
    }

    const tokens = this.jwtService.generateTokenPair({
      userId: user._id,
      email: user.email,
    });

    logInfo('RefreshToken completed successfully', { userId: user._id });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  async getCurrentUser(userId: string): Promise<{ id: string; name: string; email: string } | null> {
    logInfo('GetCurrentUser service started', { userId });
    
    const user = await this.userRepository.findById(userId);
    if (!user) {
      logWarn('GetCurrentUser failed - user not found', { userId });
      return null;
    }

    logInfo('GetCurrentUser completed successfully', { userId });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }
}
