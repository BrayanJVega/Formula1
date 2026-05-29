import { ILeagueRepository, LeagueMember } from '../../repositories/ILeagueRepository.js';
import { League } from '../../entities/League.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

interface GetLeagueOutput {
  league: League;
  members: MemberInfo[];
}

interface MemberInfo {
  id: string;
  userId: string;
  username: string;
  email: string;
  country?: string;
  avatarUrl?: string;
  role: string;
  joinedAt: string;
  totalScore: number;
}

export class GetLeagueUseCase {
  constructor(
    private readonly leagueRepository: ILeagueRepository,
  ) {}

  async execute(id: string): Promise<GetLeagueOutput> {
    const league = await this.leagueRepository.findById(id);
    if (!league) {
      throw new NotFoundError(`League with id ${id} not found`);
    }

    const memberRows = await this.leagueRepository.getMembers(id);

    const members: MemberInfo[] = memberRows.map((row: LeagueMember) => ({
      id: row.id,
      userId: row.userId,
      username: row.username,
      email: row.email,
      country: row.country,
      avatarUrl: row.avatarUrl,
      role: row.role,
      joinedAt: row.joinedAt.toISOString(),
      totalScore: row.totalScore,
    }));

    return { league, members };
  }
}
