import { IRankingRepository, RankingEntry } from '../../repositories/IRankingRepository.js';

interface GetCountryRankingInput {
  countryCode: string;
  seasonId: string;
}

export class GetCountryRankingUseCase {
  constructor(
    private readonly rankingRepository: IRankingRepository,
  ) {}

  async execute(input: GetCountryRankingInput): Promise<RankingEntry[]> {
    return this.rankingRepository.getCountryRanking(input.countryCode, input.seasonId);
  }
}
