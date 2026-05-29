import { IRankingRepository, RankingEntry } from '../../repositories/IRankingRepository.js';
import { ILeagueRepository } from '../../repositories/ILeagueRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class GetLeagueRankingUseCase {
  constructor(
    private readonly rankingRepository: IRankingRepository,
    private readonly leagueRepository: ILeagueRepository,
  ) {}

  async execute(leagueId: string): Promise<RankingEntry[]> {
    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new NotFoundError(`League with id ${leagueId} not found`);
    }

    return this.rankingRepository.getLeagueRanking(leagueId);
  }
}
