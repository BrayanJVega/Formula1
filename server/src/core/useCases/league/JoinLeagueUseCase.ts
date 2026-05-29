import { ILeagueRepository } from '../../repositories/ILeagueRepository.js';
import { League } from '../../entities/League.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError.js';

export class JoinLeagueUseCase {
  constructor(
    private readonly leagueRepository: ILeagueRepository,
  ) {}

  async execute(code: string, userId: string): Promise<League> {
    const league = await this.leagueRepository.findByCode(code);
    if (!league) {
      throw new NotFoundError('League not found with the provided code');
    }

    const existingMember = await this.leagueRepository.findMember(league.id, userId);
    if (existingMember) {
      throw new ValidationError({ code: ['You are already a member of this league'] });
    }

    const memberCount = await this.leagueRepository.getMemberCount(league.id);
    if (memberCount >= league.maxMembers) {
      throw new ForbiddenError('League is full');
    }

    await this.leagueRepository.addMember(league.id, userId, 'member');

    return league;
  }
}
