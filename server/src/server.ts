import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { connectDatabase } from './config/database.js';
import { apiLimiter } from './config/rateLimit.js';
import { errorHandler } from './presentation/middleware/errorHandler.middleware.js';
import { sanitize } from './presentation/middleware/sanitize.middleware.js';
import routes from './presentation/routes/index.js';
import { logger } from './shared/logger.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(sanitize);

app.use('/api', apiLimiter);
app.use('/api', routes);

app.use(errorHandler);

async function start() {
  try {
    await connectDatabase();
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: (error as Error).message });
    process.exit(1);
  }
}

start();

export default app;
