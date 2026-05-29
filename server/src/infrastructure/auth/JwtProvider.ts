import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtProvider {
  generateAccessToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: jwtConfig.expiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, jwtConfig.secret, options);
  }

  generateRefreshToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: jwtConfig.refreshExpiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, jwtConfig.refreshSecret, options);
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, jwtConfig.secret) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, jwtConfig.refreshSecret) as TokenPayload;
  }
}
