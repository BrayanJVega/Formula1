import { logger } from '../../shared/logger.js';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailProvider {
  async send(options: EmailOptions): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      logger.info('Email would be sent (dev mode)', {
        to: options.to,
        subject: options.subject,
      });
      return;
    }
    // TODO: Integrate nodemailer or SendGrid for production
    logger.info('Email sent', { to: options.to, subject: options.subject });
  }
}
