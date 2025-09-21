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
        name: string;
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
      let accessToken = req.cookies?.accessToken;
      const refreshToken = req.cookies?.refreshToken;

      if (!accessToken && !refreshToken) {
        logWarn('no tokens provided');
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
              name: user.name,
              email: user.email
            };
            next();
            return;
          }
        }
      } catch {
        
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

            res.cookie("accessToken", newAccessToken, {
              httpOnly: false,
              secure: false,
              sameSite: "lax",
              path: "/",
              maxAge: 15 * 60 * 1000,
            });

            req.user = {
              id: user._id,
              name: user.name,
              email: user.email
            };

            logDebug('auth successful with token refresh');
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

 
}
