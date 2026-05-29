import { SeasonSimulator } from '../../simulation/SeasonSimulator.js';
import { SimulationResult } from '../../entities/Simulation.js';
import type { DriverPerformance, CircuitCharacteristics, WeatherState } from '../../simulation/types.js';

interface SeasonRaceInput {
  raceId: string;
  raceName: string;
  circuit: CircuitCharacteristics;
  laps: number;
  initialWeather?: Partial<WeatherState>;
}

interface RunSeasonInput {
  seasonId: string;
  year: number;
  races: SeasonRaceInput[];
  drivers: DriverPerformance[];
}

export class RunSeasonSimulationUseCase {
  private simulator = new SeasonSimulator();

  async execute(input: RunSeasonInput): Promise<{ simulation: SimulationResult; result: Record<string, unknown> }> {
    const result = this.simulator.simulate(input.seasonId, input.year, input.races, input.drivers);

    const simRecord: Record<string, unknown> = JSON.parse(JSON.stringify(result));

    const simulation = new SimulationResult({
      type: 'season',
      parameters: {
        seasonId: input.seasonId,
        year: input.year,
        raceCount: input.races.length,
        driverCount: input.drivers.length,
      },
      result: simRecord,
    });

    return { simulation, result: simRecord };
  }
}
