import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IUserRepository, ILoggerService, IAuthMiddleware, IJwtService } from '../../repositories';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

@injectable()
export class AuthMiddleware implements IAuthMiddleware {
  constructor(
    @inject('IJwtService') private jwtService: IJwtService,
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('ILoggerService') private logger: ILoggerService
  ) {}

  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let accessToken = this.getAccessTokenFromRequest(req);
      const refreshToken = req.cookies?.refreshToken;

      if (!accessToken && !refreshToken) {
        this.logger.warn('Authentication failed - no tokens provided', { ip: req.ip });
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      let payload;
      let user;

      try {
        if (accessToken) {
          payload = this.jwtService.verifyAccessToken(accessToken);
          user = await this.userRepository.findById(payload.userId);
          
          if (user) {
            req.user = {
              id: user._id,
              email: user.email
            };
            this.logger.debug('Authentication successful with access token', { userId: user._id, ip: req.ip });
            next();
            return;
          }
        }
      } catch (accessTokenError) {
        this.logger.debug('Access token verification failed, attempting refresh', { 
          error: accessTokenError instanceof Error ? accessTokenError.message : 'Unknown error',
          ip: req.ip 
        });
      }

      if (refreshToken) {
        try {
          const refreshPayload = this.jwtService.verifyRefreshToken(refreshToken);
          user = await this.userRepository.findById(refreshPayload.userId);
          
          if (user) {
            const newAccessToken = this.jwtService.generateAccessToken({
              userId: user._id,
              email: user.email
            });

            res.setHeader('X-New-Access-Token', newAccessToken);

            req.user = {
              id: user._id,
              email: user.email
            };

            this.logger.debug('Authentication successful with token refresh', { userId: user._id, ip: req.ip });
            next();
            return;
          }
        } catch (refreshTokenError) {
          this.logger.warn('Refresh token verification failed', { 
            error: refreshTokenError instanceof Error ? refreshTokenError.message : 'Unknown error',
            ip: req.ip 
          });
        }
      }

      this.logger.warn('Authentication failed - all tokens invalid', { ip: req.ip });
      res.status(401).json({
        success: false,
        message: 'Invalid or expired tokens'
      });
    } catch (error) {
      this.logger.error('Authentication middleware error', { 
        error: error instanceof Error ? error.message : 'Unknown error', 
        ip: req.ip 
      });
      res.status(500).json({
        success: false,
        message: 'Authentication error'
      });
    }
  };

  private getAccessTokenFromRequest(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return req.cookies?.accessToken || null;
  };

}
