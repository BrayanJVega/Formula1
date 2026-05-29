import { IRaceRepository } from '../../repositories/IRaceRepository.js';
import { Race, RaceStatus } from '../../entities/Race.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';

interface UpdateRaceInput {
  id: string;
  seasonId?: string;
  circuitId?: string;
  name?: string;
  round?: number;
  status?: RaceStatus;
  date?: Date;
  qualifyingDate?: Date;
  raceDate?: Date;
  localTimezone?: string;
  laps?: number;
  weatherForecast?: Record<string, unknown>;
}

export class UpdateRaceUseCase {
  constructor(private readonly raceRepository: IRaceRepository) {}

  async execute(input: UpdateRaceInput): Promise<Race> {
    const existing = await this.raceRepository.findById(input.id);
    if (!existing) {
      throw new NotFoundError(`Race with id ${input.id} not found`);
    }

    if (input.round !== undefined && input.round < 1) {
      throw new ValidationError({ round: ['Round must be a positive number'] });
    }

    if (input.laps !== undefined && input.laps < 1) {
      throw new ValidationError({ laps: ['Laps must be a positive number'] });
    }

    const qualifyingDate = input.qualifyingDate ?? existing.qualifyingDate;
    const raceDate = input.raceDate ?? existing.raceDate;
    if (new Date(qualifyingDate) >= new Date(raceDate)) {
      throw new ValidationError({
        qualifyingDate: ['Qualifying must be before the race'],
      });
    }

    const updated = new Race({
      id: existing.id,
      seasonId: input.seasonId ?? existing.seasonId,
      circuitId: input.circuitId ?? existing.circuitId,
      name: input.name ?? existing.name,
      round: input.round ?? existing.round,
      status: input.status ?? existing.status,
      date: input.date ?? existing.date,
      qualifyingDate,
      raceDate,
      localTimezone: input.localTimezone ?? existing.localTimezone,
      laps: input.laps ?? existing.laps,
      weatherForecast: input.weatherForecast ?? existing.weatherForecast,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    return this.raceRepository.update(updated);
  }
}
