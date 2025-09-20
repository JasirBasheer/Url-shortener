import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { TokenPair, TokenPayload } from '@/types';

export function generateAccessToken(payload: Omit<TokenPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    env.JWT.ACCESS_SECRET,
    { expiresIn: env.JWT.ACCESS_EXPIRES_IN }
  );
}


export function generateTokenPair(payload: Omit<TokenPayload, 'type'>): TokenPair {
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

export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT.ACCESS_SECRET) as TokenPayload;
    if (decoded.type !== 'access') throw new Error('Invalid token type');
    return decoded;
  } catch {
    throw new Error('Invalid or expired access token');
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT.REFRESH_SECRET) as TokenPayload;
    if (decoded.type !== 'refresh') throw new Error('Invalid token type');
    return decoded;
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
}
