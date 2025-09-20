import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import { IJwtService, TokenPair, TokenPayload, CookieOptions } from '../repositories';
import { env } from '@/config/env';

@injectable()
export class JwtServiceImpl implements IJwtService {
  generateTokenPair(payload: Omit<TokenPayload, 'type'>): TokenPair {
    const accessToken = jwt.sign(
      { ...payload, type: 'access' },
      env.JWT.ACCESS_SECRET,
      { expiresIn: env.JWT.ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' },
      env.JWT.REFRESH_SECRET,
      { expiresIn: env.JWT.REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, env.JWT.ACCESS_SECRET) as TokenPayload;
      
      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, env.JWT.REFRESH_SECRET) as TokenPayload;
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  generateResetPasswordToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'reset' },
      env.JWT.RESET_PASSWORD_SECRET,
      { expiresIn: '1h' }
    );
  }

  verifyResetPasswordToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, env.JWT.RESET_PASSWORD_SECRET) as { userId: string; type: string };
      
      if (decoded.type !== 'reset') {
        throw new Error('Invalid token type');
      }

      return { userId: decoded.userId };
    } catch (error) {
      throw new Error('Invalid or expired reset password token');
    }
  }

  generateAccessToken(payload: Omit<TokenPayload, 'type'>): string {
    return jwt.sign(
      { ...payload, type: 'access' },
      env.JWT.ACCESS_SECRET,
      { expiresIn: env.JWT.ACCESS_EXPIRES_IN }
    );
  }

  getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: env.COOKIE.SECURE,
      sameSite: env.COOKIE.SAME_SITE as 'strict' | 'lax' | 'none',
      path: '/',
    };
  }
}
