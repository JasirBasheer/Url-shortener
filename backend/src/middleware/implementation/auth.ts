import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../repositories';
import { IAuthMiddleware } from '../interface/IAuthMiddleware';
import { generateAccessToken, logDebug, logError, logWarn, verifyAccessToken, verifyRefreshToken } from '@/utils';

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
    @inject('IUserRepository') private userRepository: IUserRepository
    ) {}

  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let accessToken = this.getAccessTokenFromRequest(req);
      const refreshToken = req.cookies?.refreshToken;

      if (!accessToken && !refreshToken) {
        logWarn('Authentication failed - no tokens provided', { ip: req.ip });
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
          payload = verifyAccessToken(accessToken);
          user = await this.userRepository.findById(payload.userId);
          
          if (user) {
            req.user = {
              id: user._id,
              email: user.email
            };
            logDebug('Authentication successful with access token', { userId: user._id, ip: req.ip });
            next();
            return;
          }
        }
      } catch (accessTokenError) {
        logDebug('Access token verification failed, attempting refresh', { 
          error: accessTokenError instanceof Error ? accessTokenError.message : 'Unknown error',
          ip: req.ip 
        });
      }

      if (refreshToken) {
        try {
          const refreshPayload = verifyRefreshToken(refreshToken);
          user = await this.userRepository.findById(refreshPayload.userId);
          
          if (user) {
            const newAccessToken = generateAccessToken({
              userId: user._id,
              email: user.email
            });

            res.setHeader('X-New-Access-Token', newAccessToken);

            req.user = {
              id: user._id,
              email: user.email
            };

            logDebug('Authentication successful with token refresh', { userId: user._id, ip: req.ip });
            next();
            return;
          }
        } catch (refreshTokenError) {
          logWarn('Refresh token verification failed', { 
            error: refreshTokenError instanceof Error ? refreshTokenError.message : 'Unknown error',
            ip: req.ip 
          });
        }
      }

      logWarn('Authentication failed - all tokens invalid', { ip: req.ip });
      res.status(401).json({
        success: false,
        message: 'Invalid or expired tokens'
      });
    } catch (error) {
      logError('Authentication middleware error', { 
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
