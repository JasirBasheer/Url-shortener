import { injectable, inject } from 'tsyringe';
import { IUserRepository, IJwtService, ILoggerService, IPasswordService } from '../repositories';
import { SignUpDTO, SignInDTO, RefreshTokenDTO } from '../types';
import { AuthResponse } from '../types';
import { ValidationException, AuthenticationException, ConflictException } from '../exceptions';
import { IUser } from '../models';

@injectable()
export class AuthService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IJwtService') private jwtService: IJwtService,
    @inject('ILoggerService') private logger: ILoggerService,
    @inject('IPasswordService') private passwordService: IPasswordService
  ) {}

  async signUp(dto: SignUpDTO): Promise<AuthResponse> {
    this.logger.info('SignUp service started', { email: dto.email });
    
    const validationErrors = dto.validate();
    if (validationErrors.length > 0) {
      this.logger.warn('SignUp validation failed', { errors: validationErrors });
      throw new ValidationException(`Validation failed: ${validationErrors.join(', ')}`, 'VALIDATION_ERROR');
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      this.logger.warn('SignUp failed - user already exists', { email: dto.email });
      throw new ConflictException('User with this email already exists', 'USER_EXISTS');
    }

    const hashedPassword = await this.passwordService.hashPassword(dto.password);

    const newUser = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const tokens = this.jwtService.generateTokenPair({
      userId: newUser._id,
      email: newUser.email,
    });

    this.logger.info('SignUp completed successfully', { userId: newUser._id });

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

  async signIn(dto: SignInDTO): Promise<AuthResponse> {
    this.logger.info('SignIn service started', { email: dto.email });
    
    const validationErrors = dto.validate();
    if (validationErrors.length > 0) {
      this.logger.warn('SignIn validation failed', { errors: validationErrors });
      throw new ValidationException(`Validation failed: ${validationErrors.join(', ')}`, 'VALIDATION_ERROR');
    }

    const user: IUser | null = await this.userRepository.findByEmailWithPassword(dto.email);
    if (!user) {
      this.logger.warn('SignIn failed - user not found', { email: dto.email });
      throw new AuthenticationException('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await this.passwordService.comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      this.logger.warn('SignIn failed - invalid password', { email: dto.email });
      throw new AuthenticationException('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const tokens = this.jwtService.generateTokenPair({
      userId: user._id,
      email: user.email,
    });

    this.logger.info('SignIn completed successfully', { userId: user._id });

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
    this.logger.info('RefreshToken service started');
    
    const validationErrors = dto.validate();
    if (validationErrors.length > 0) {
      this.logger.warn('RefreshToken validation failed', { errors: validationErrors });
      throw new ValidationException(`Validation failed: ${validationErrors.join(', ')}`, 'VALIDATION_ERROR');
    }

    const tokenPayload = this.jwtService.verifyRefreshToken(dto.refreshToken);

    const user = await this.userRepository.findById(tokenPayload.userId);
    if (!user) {
      this.logger.warn('RefreshToken failed - user not found', { userId: tokenPayload.userId });
      throw new AuthenticationException('User not found', 'USER_NOT_FOUND');
    }

    const tokens = this.jwtService.generateTokenPair({
      userId: user._id,
      email: user.email,
    });

    this.logger.info('RefreshToken completed successfully', { userId: user._id });

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
    this.logger.info('GetCurrentUser service started', { userId });
    
    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.warn('GetCurrentUser failed - user not found', { userId });
      return null;
    }

    this.logger.info('GetCurrentUser completed successfully', { userId });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }
}
