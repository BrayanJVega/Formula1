import { User } from '../../entities/User.js';
import { IUserRepository } from '../../repositories/IUserRepository.js';
import { BcryptProvider } from '../../../infrastructure/auth/BcryptProvider.js';
import { JwtProvider } from '../../../infrastructure/auth/JwtProvider.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';
import { RegisterDto } from '../../../presentation/dtos/auth.dto.js';

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcryptProvider: BcryptProvider,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async execute(dto: RegisterDto) {
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ValidationError({ email: ['Email is already registered'] });
    }

    const existingUsername = await this.userRepository.findByUsername(dto.username);
    if (existingUsername) {
      throw new ValidationError({ username: ['Username is already taken'] });
    }

    const passwordHash = await this.bcryptProvider.hash(dto.password);
    const user = new User({
      email: dto.email,
      username: dto.username,
      passwordHash,
    });

    await this.userRepository.save(user);

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
