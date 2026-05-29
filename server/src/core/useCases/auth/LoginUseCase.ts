import { IUserRepository } from '../../repositories/IUserRepository.js';
import { BcryptProvider } from '../../../infrastructure/auth/BcryptProvider.js';
import { JwtProvider } from '../../../infrastructure/auth/JwtProvider.js';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError.js';
import { LoginDto } from '../../../presentation/dtos/auth.dto.js';
import { User } from '../../entities/User.js';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcryptProvider: BcryptProvider,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await this.bcryptProvider.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtProvider.generateAccessToken(tokenPayload);
    const refreshToken = this.jwtProvider.generateRefreshToken(tokenPayload);

    await this.userRepository.update(new User({ ...user, refreshToken }));

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl,
        country: user.country,
      },
      accessToken,
      refreshToken,
    };
  }
}
