import { FantasyTeam } from '../entities/FantasyTeam.js';

export interface IFantasyRepository {
  findById(id: string): Promise<FantasyTeam | null>;
  findByUserAndSeason(userId: string, seasonId: string): Promise<FantasyTeam | null>;
  save(team: FantasyTeam): Promise<FantasyTeam>;
  update(team: FantasyTeam): Promise<FantasyTeam>;
  delete(id: string): Promise<void>;
}
