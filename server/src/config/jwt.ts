import { env } from './env.js';

export const jwtConfig = {
  secret: env.JWT.SECRET,
  refreshSecret: env.JWT.REFRESH_SECRET,
  expiresIn: env.JWT.EXPIRES_IN,
  refreshExpiresIn: env.JWT.REFRESH_EXPIRES_IN,
};
