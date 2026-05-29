import { League } from '../entities/League.js';

export interface LeagueMember {
  id: string;
  userId: string;
  leagueId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
  totalScore: number;
  username: string;
  email: string;
  country?: string;
  avatarUrl?: string;
}

export interface ILeagueRepository {
  findById(id: string): Promise<League | null>;
  findByCode(code: string): Promise<League | null>;
  findByOwner(ownerId: string): Promise<League[]>;
  findByMember(userId: string): Promise<League[]>;
  save(league: League): Promise<League>;
  update(league: League): Promise<League>;
  delete(id: string): Promise<void>;
  generateCode(): Promise<string>;
  addMember(leagueId: string, userId: string, role?: string): Promise<void>;
  removeMember(leagueId: string, userId: string): Promise<void>;
  getMembers(leagueId: string): Promise<LeagueMember[]>;
  findMember(leagueId: string, userId: string): Promise<LeagueMember | null>;
  getMemberCount(leagueId: string): Promise<number>;
}
