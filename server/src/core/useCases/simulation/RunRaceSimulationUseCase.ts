import { RaceSimulator } from '../../simulation/RaceSimulator.js';
import { SimulationResult } from '../../entities/Simulation.js';
import type { DriverPerformance, CircuitCharacteristics, WeatherState, QualifyingResult } from '../../simulation/types.js';

interface RunRaceInput {
  raceId: string;
  raceName: string;
  drivers: DriverPerformance[];
  circuit: CircuitCharacteristics;
  laps: number;
  initialWeather?: Partial<WeatherState>;
  gridOrder?: QualifyingResult[];
}

export class RunRaceSimulationUseCase {
  private simulator = new RaceSimulator();

  async execute(input: RunRaceInput): Promise<{ simulation: SimulationResult; result: Record<string, unknown> }> {
    const result = this.simulator.simulate(
      input.drivers,
      input.circuit,
      input.laps,
      input.raceId,
      input.raceName,
      input.initialWeather,
      input.gridOrder,
    );

    const simRecord: Record<string, unknown> = JSON.parse(JSON.stringify(result));

    const simulation = new SimulationResult({
      raceId: input.raceId,
      type: 'race',
      parameters: {
        drivers: input.drivers.map(d => d.driverId),
        circuit: input.circuit.circuitId,
        laps: input.laps,
      },
      result: simRecord,
    });

    return { simulation, result: simRecord };
  }
}
