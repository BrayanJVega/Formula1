import { IRaceRepository } from '../../repositories/IRaceRepository.js';
import { Race } from '../../entities/Race.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';

interface CreateRaceInput {
  seasonId: string;
  circuitId: string;
  name: string;
  round: number;
  date: Date;
  qualifyingDate: Date;
  raceDate: Date;
  localTimezone: string;
  laps: number;
  weatherForecast?: Record<string, unknown>;
}

export class CreateRaceUseCase {
  constructor(private readonly raceRepository: IRaceRepository) {}

  async execute(input: CreateRaceInput): Promise<Race> {
    if (input.round < 1) {
      throw new ValidationError({ round: ['Round must be a positive number'] });
    }

    if (input.laps < 1) {
      throw new ValidationError({ laps: ['Laps must be a positive number'] });
    }

    if (new Date(input.qualifyingDate) >= new Date(input.raceDate)) {
      throw new ValidationError({
        qualifyingDate: ['Qualifying must be before the race'],
      });
    }

    const race = new Race(input);
    return this.raceRepository.save(race);
  }
}
