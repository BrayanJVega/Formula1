import { IUserRepository } from '../../repositories/IUserRepository.js';
import { JwtProvider } from '../../../infrastructure/auth/JwtProvider.js';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError.js';
import { User } from '../../entities/User.js';

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async execute(refreshToken: string) {
    let payload;
    try {
      payload = this.jwtProvider.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const newAccessToken = this.jwtProvider.generateAccessToken(tokenPayload);
    const newRefreshToken = this.jwtProvider.generateRefreshToken(tokenPayload);

    await this.userRepository.update(new User({ ...user, refreshToken: newRefreshToken }));

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
