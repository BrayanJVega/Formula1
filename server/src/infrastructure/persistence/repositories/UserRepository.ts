import { IUserRepository } from '../../../core/repositories/IUserRepository.js';
import { User } from '../../../core/entities/User.js';
import { query, queryOne } from '../../../config/database.js';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    return row ? this.mapToUser(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return row ? this.mapToUser(row) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM users WHERE username = $1',
      [username],
    );
    return row ? this.mapToUser(row) : null;
  }

  async findByResetToken(token: string): Promise<User | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token],
    );
    return row ? this.mapToUser(row) : null;
  }

  async save(user: User): Promise<User> {
    await query(
      `INSERT INTO users (id, email, username, password_hash, role, avatar_url, country, is_verified, refresh_token, reset_token, reset_token_expires, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        user.id, user.email, user.username, user.passwordHash, user.role,
        user.avatarUrl, user.country, user.isVerified, user.refreshToken,
        user.resetToken, user.resetTokenExpires, user.createdAt, user.updatedAt,
      ],
    );
    return user;
  }

  async update(user: User): Promise<User> {
    await query(
      `UPDATE users SET email = $1, username = $2, password_hash = $3, role = $4,
        avatar_url = $5, country = $6, is_verified = $7, refresh_token = $8,
        reset_token = $9, reset_token_expires = $10, updated_at = $11
       WHERE id = $12`,
      [
        user.email, user.username, user.passwordHash, user.role,
        user.avatarUrl, user.country, user.isVerified, user.refreshToken,
        user.resetToken, user.resetTokenExpires, user.updatedAt, user.id,
      ],
    );
    return user;
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM users WHERE id = $1', [id]);
  }

  async findAll(options?: { page?: number; limit?: number }): Promise<{ users: User[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const totalResult = await queryOne<{ count: string }>('SELECT COUNT(*) as count FROM users');
    const total = parseInt(totalResult?.count ?? '0', 10);

    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset],
    );

    return { users: rows.map(this.mapToUser), total };
  }

  private mapToUser(row: Record<string, unknown>): User {
    return new User({
      id: row.id as string,
      email: row.email as string,
      username: row.username as string,
      passwordHash: row.password_hash as string,
      role: row.role as 'user' | 'admin',
      avatarUrl: row.avatar_url as string | undefined,
      country: row.country as string | undefined,
      isVerified: row.is_verified as boolean,
      refreshToken: row.refresh_token as string | undefined,
      resetToken: row.reset_token as string | undefined,
      resetTokenExpires: row.reset_token_expires ? new Date(row.reset_token_expires as string) : undefined,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }
}
