import { IRankingRepository, RankingEntry } from '../../repositories/IRankingRepository.js';

interface GetGlobalRankingInput {
  seasonId: string;
  page?: number;
  limit?: number;
}

interface GetGlobalRankingOutput {
  rankings: RankingEntry[];
  total: number;
  page: number;
  limit: number;
}

export class GetGlobalRankingUseCase {
  constructor(
    private readonly rankingRepository: IRankingRepository,
  ) {}

  async execute(input: GetGlobalRankingInput): Promise<GetGlobalRankingOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 50;

    const result = await this.rankingRepository.getGlobalRanking(input.seasonId, { page, limit });

    return {
      rankings: result.rankings,
      total: result.total,
      page,
      limit,
    };
  }
}
