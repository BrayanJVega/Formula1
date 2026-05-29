import { Team } from '../entities/Team.js';

export interface ITeamRepository {
  findById(id: string): Promise<Team | null>;
  findAll(options?: { isActive?: boolean }): Promise<Team[]>;
  save(team: Team): Promise<Team>;
  update(team: Team): Promise<Team>;
  delete(id: string): Promise<void>;
}
