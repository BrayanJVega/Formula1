import { RaceSimulator } from '../../simulation/RaceSimulator.js';
import { WhatIfSimulator } from '../../simulation/WhatIfSimulator.js';
import { SimulationResult } from '../../entities/Simulation.js';
import type { DriverPerformance, CircuitCharacteristics, WeatherState, QualifyingResult, WhatIfScenario, RaceSimulationResult } from '../../simulation/types.js';

interface RunWhatIfInput {
  raceId: string;
  raceName: string;
  drivers: DriverPerformance[];
  circuit: CircuitCharacteristics;
  laps: number;
  scenario: WhatIfScenario;
  baseResult?: RaceSimulationResult;
  initialWeather?: Partial<WeatherState>;
  gridOrder?: QualifyingResult[];
}

export class RunWhatIfSimulationUseCase {
  private raceSimulator = new RaceSimulator();
  private whatIfSimulator = new WhatIfSimulator();

  async execute(input: RunWhatIfInput): Promise<{ simulation: SimulationResult; result: Record<string, unknown> }> {
    const baseResult = input.baseResult ?? this.raceSimulator.simulate(
      input.drivers,
      input.circuit,
      input.laps,
      input.raceId,
      input.raceName,
      input.initialWeather,
      input.gridOrder,
    );

    const modifiedDrivers = this.whatIfSimulator.applyScenario(input.drivers, input.scenario);

    const modifiedResult = this.raceSimulator.simulate(
      modifiedDrivers,
      input.circuit,
      input.laps,
      input.raceId,
      `${input.raceName} (What-If)`,
      input.initialWeather,
      input.gridOrder,
    );

    const simRecord: Record<string, unknown> = JSON.parse(JSON.stringify({
      base: baseResult,
      modified: modifiedResult,
      scenario: input.scenario,
    }));

    const simulation = new SimulationResult({
      raceId: input.raceId,
      type: 'what_if',
      parameters: {
        scenario: input.scenario,
        driverCount: input.drivers.length,
        circuit: input.circuit.circuitId,
      },
      result: simRecord,
    });

    return { simulation, result: simRecord };
  }
}
