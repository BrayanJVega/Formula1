import { ILeagueRepository, LeagueMember } from '../../repositories/ILeagueRepository.js';
import { League } from '../../entities/League.js';

interface MyLeagueOutput {
  league: League;
  memberCount: number;
  yourRole: string;
  yourScore: number;
  yourPosition: number;
}

export class GetMyLeaguesUseCase {
  constructor(
    private readonly leagueRepository: ILeagueRepository,
  ) {}

  async execute(userId: string): Promise<MyLeagueOutput[]> {
    const leagues = await this.leagueRepository.findByMember(userId);

    const results: MyLeagueOutput[] = [];

    for (const league of leagues) {
      const members = await this.leagueRepository.getMembers(league.id);
      const currentMember = members.find((m: LeagueMember) => m.userId === userId);

      const sorted = [...members].sort((a: LeagueMember, b: LeagueMember) => b.totalScore - a.totalScore);
      const position = sorted.findIndex((m: LeagueMember) => m.userId === userId) + 1;

      results.push({
        league,
        memberCount: members.length,
        yourRole: currentMember?.role ?? 'member',
        yourScore: currentMember ? currentMember.totalScore : 0,
        yourPosition: position,
      });
    }

    return results;
  }
}
