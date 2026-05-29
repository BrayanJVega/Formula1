import { ILeagueRepository } from '../../repositories/ILeagueRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError.js';

export class LeaveLeagueUseCase {
  constructor(
    private readonly leagueRepository: ILeagueRepository,
  ) {}

  async execute(leagueId: string, userId: string): Promise<void> {
    const league = await this.leagueRepository.findById(leagueId);
    if (!league) {
      throw new NotFoundError(`League with id ${leagueId} not found`);
    }

    if (league.ownerId === userId) {
      throw new ForbiddenError('League owner cannot leave. Transfer ownership or delete the league instead.');
    }

    const member = await this.leagueRepository.findMember(leagueId, userId);
    if (!member) {
      throw new NotFoundError('You are not a member of this league');
    }

    await this.leagueRepository.removeMember(leagueId, userId);
  }
}
