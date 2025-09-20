import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { SignUpDTO, SignInDTO } from '../../types';
import { SignUpRequest, SignInRequest } from '../../types';
import { 
  IAuthController, 
  IAuthService,
  IJwtService
} from '../../repositories';

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject('IAuthService') private readonly authService: IAuthService,
    @inject('IJwtService') private readonly jwtService: IJwtService
  ) {}

  signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {      
      const signUpRequest: SignUpRequest = req.body;
      const dto = SignUpDTO.fromRequest(signUpRequest);
      
      const result = await this.authService.signUp(dto);
      this.setTokenCookies(res, result.tokens);
            
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user: result.user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signInRequest: SignInRequest = req.body;
      const dto = SignInDTO.fromRequest(signInRequest); 
      
      const result = await this.authService.signIn(dto);
      this.setTokenCookies(res, result.tokens);
      
      res.status(200).json({
        success: true,
        message: 'Sign in successful',
        data: {
          user: result.user
        }
      });
    } catch (error) {
      next(error);
    }
  }


  signOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.clearTokenCookies(res);
      
      res.status(200).json({
        success: true,
        message: 'Sign out successful'
      });
    } catch (error) {
      next(error);
    }
  }

  private setTokenCookies(res: Response, tokens: { accessToken: string; refreshToken: string }): void {
    const cookieOptions = this.jwtService.getCookieOptions();
    
    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      httpOnly: false, 
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearTokenCookies(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}
