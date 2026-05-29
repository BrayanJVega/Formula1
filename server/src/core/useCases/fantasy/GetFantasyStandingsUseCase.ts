import { FantasyRepository } from '../../../infrastructure/persistence/repositories/FantasyRepository.js';

export interface StandingsEntry {
  position: number;
  teamId: string;
  teamName: string;
  userId: string;
  totalScore: number;
  budget: number;
  totalValue: number;
  transfersCount: number;
}

export class GetFantasyStandingsUseCase {
  constructor(private readonly fantasyRepository: FantasyRepository) {}

  async execute(seasonId: string): Promise<StandingsEntry[]> {
    const teams = await this.fantasyRepository.getAllTeamsBySeason(seasonId);
    const entries: StandingsEntry[] = [];

    for (const team of teams) {
      const picks = await this.fantasyRepository.getActivePicks(team.id);
      const transfers = await this.fantasyRepository.getTransfers(team.id);

      const totalValue = picks.reduce((sum, p) => sum + p.cost, 0);

      entries.push({
        position: 0,
        teamId: team.id,
        teamName: team.name,
        userId: team.userId,
        totalScore: team.totalScore,
        budget: team.budget,
        totalValue,
        transfersCount: transfers.length,
      });
    }

    entries.sort((a, b) => b.totalScore - a.totalScore);
    entries.forEach((e, i) => { e.position = i + 1; });

    return entries;
  }
}
