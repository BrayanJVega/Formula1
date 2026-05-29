import dotenv from 'dotenv';
dotenv.config();

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

export const env = {
  PORT: parseInt(getEnv('PORT', '3001'), 10),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  DB: {
    HOST: getEnv('DB_HOST', 'localhost'),
    PORT: parseInt(getEnv('DB_PORT', '5432'), 10),
    NAME: getEnv('DB_NAME', 'f1_predictor'),
    USER: getEnv('DB_USER', 'f1_app'),
    PASSWORD: getEnv('DB_PASSWORD', 'f1_secret_password'),
  },
  JWT: {
    SECRET: getEnv('JWT_SECRET', 'dev-jwt-secret'),
    REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
    EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '15m'),
    REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },
  CLIENT_URL: getEnv('CLIENT_URL', 'http://localhost:5173'),
};
