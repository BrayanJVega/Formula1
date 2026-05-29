export type UserRole = 'user' | 'admin';

export interface UserProps {
  id?: string;
  email: string;
  username: string;
  passwordHash: string;
  role?: UserRole;
  avatarUrl?: string;
  country?: string;
  isVerified?: boolean;
  refreshToken?: string;
  resetToken?: string;
  resetTokenExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly passwordHash: string;
  readonly role: UserRole;
  readonly avatarUrl?: string;
  readonly country?: string;
  readonly isVerified: boolean;
  readonly refreshToken?: string;
  readonly resetToken?: string;
  readonly resetTokenExpires?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.email = props.email;
    this.username = props.username;
    this.passwordHash = props.passwordHash;
    this.role = props.role ?? 'user';
    this.avatarUrl = props.avatarUrl;
    this.country = props.country;
    this.isVerified = props.isVerified ?? false;
    this.refreshToken = props.refreshToken;
    this.resetToken = props.resetToken;
    this.resetTokenExpires = props.resetTokenExpires;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}
