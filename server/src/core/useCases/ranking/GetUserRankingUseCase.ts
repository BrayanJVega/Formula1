import { IRankingRepository, RankingEntry } from '../../repositories/IRankingRepository.js';

interface GetUserRankingInput {
  userId: string;
  seasonId: string;
}

export class GetUserRankingUseCase {
  constructor(
    private readonly rankingRepository: IRankingRepository,
  ) {}

  async execute(input: GetUserRankingInput): Promise<RankingEntry | null> {
    return this.rankingRepository.getUserPosition(input.userId, input.seasonId);
  }
}
