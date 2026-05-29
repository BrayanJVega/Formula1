import crypto from 'crypto';
import { IUserRepository } from '../../repositories/IUserRepository.js';
import { EmailProvider } from '../../../infrastructure/auth/EmailProvider.js';
import { User } from '../../entities/User.js';

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailProvider: EmailProvider,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepository.update(
      new User({ ...user, resetToken, resetTokenExpires }),
    );

    await this.emailProvider.send({
      to: user.email,
      subject: 'Password Reset - F1 Predictor',
      html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
      `,
    });
  }
}
