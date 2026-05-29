import { ILeagueRepository } from '../../repositories/ILeagueRepository.js';
import { League } from '../../entities/League.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';

interface CreateLeagueInput {
  name: string;
  description?: string;
  ownerId: string;
  maxMembers?: number;
  isPrivate?: boolean;
}

export class CreateLeagueUseCase {
  constructor(
    private readonly leagueRepository: ILeagueRepository,
  ) {}

  async execute(input: CreateLeagueInput): Promise<League> {
    if (!input.name || input.name.trim().length === 0) {
      throw new ValidationError({ name: ['League name is required'] });
    }

    if (input.name.length > 100) {
      throw new ValidationError({ name: ['League name must be at most 100 characters'] });
    }

    if (input.maxMembers !== undefined && (input.maxMembers < 2 || input.maxMembers > 100)) {
      throw new ValidationError({ maxMembers: ['Max members must be between 2 and 100'] });
    }

    let code = await this.leagueRepository.generateCode();
    let existing = await this.leagueRepository.findByCode(code);
    while (existing) {
      code = await this.leagueRepository.generateCode();
      existing = await this.leagueRepository.findByCode(code);
    }

    const league = new League({
      name: input.name.trim(),
      description: input.description?.trim(),
      code,
      ownerId: input.ownerId,
      maxMembers: input.maxMembers ?? 50,
      isPrivate: input.isPrivate ?? true,
    });

    const saved = await this.leagueRepository.save(league);

    await this.leagueRepository.addMember(saved.id, input.ownerId, 'owner');

    return saved;
  }
}
