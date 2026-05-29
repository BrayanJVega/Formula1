import bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '../../shared/constants.js';

export class BcryptProvider {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
