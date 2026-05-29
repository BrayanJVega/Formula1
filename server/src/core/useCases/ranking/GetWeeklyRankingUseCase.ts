import { IRankingRepository, RankingEntry } from '../../repositories/IRankingRepository.js';

interface GetWeeklyRankingInput {
  page?: number;
  limit?: number;
}

interface GetWeeklyRankingOutput {
  rankings: RankingEntry[];
  total: number;
  page: number;
  limit: number;
}

export class GetWeeklyRankingUseCase {
  constructor(
    private readonly rankingRepository: IRankingRepository,
  ) {}

  async execute(input: GetWeeklyRankingInput): Promise<GetWeeklyRankingOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 50;

    const result = await this.rankingRepository.getWeeklyRanking({ page, limit });

    return {
      rankings: result.rankings,
      total: result.total,
      page,
      limit,
    };
  }
}
