import { RaceSimulator } from './RaceSimulator.js';
import type {
  DriverPerformance, CircuitCharacteristics, WeatherState,
  RaceSimulationResult, WhatIfScenario, QualifyingResult,
} from './types.js';

export class WhatIfSimulator {
  private raceSimulator = new RaceSimulator();

  simulate(
    baseResult: RaceSimulationResult,
    drivers: DriverPerformance[],
    circuit: CircuitCharacteristics,
    laps: number,
    raceId: string,
    raceName: string,
    initialWeather?: Partial<WeatherState>,
    gridOrder?: QualifyingResult[],
  ): { base: RaceSimulationResult; modified: RaceSimulationResult; scenario: WhatIfScenario } {
    const modifiedDrivers = drivers.map(d => ({ ...d }));

    return {
      base: baseResult,
      modified: this.raceSimulator.simulate(modifiedDrivers, circuit, laps, raceId, raceName, initialWeather, gridOrder),
      scenario: { type: 'buff', parameters: {} },
    };
  }

  applyScenario(
    drivers: DriverPerformance[],
    scenario: WhatIfScenario,
  ): DriverPerformance[] {
    return drivers.map(d => {
      const driver = { ...d };

      if (scenario.type === 'injury' && scenario.targetDriverId === driver.driverId) {
        const reduction = (scenario.parameters.reduction ?? 30) / 100;
        driver.skill = Math.round(driver.skill * (1 - reduction));
        driver.raceSkill = Math.round(driver.raceSkill * (1 - reduction));
        driver.form = Math.round(driver.form * (1 - reduction));
      }

      if (scenario.type === 'buff' && scenario.targetDriverId === driver.driverId) {
        const increase = (scenario.parameters.increase ?? 15) / 100;
        driver.skill = Math.min(100, Math.round(driver.skill * (1 + increase)));
        driver.raceSkill = Math.min(100, Math.round(driver.raceSkill * (1 + increase)));
        driver.qualiSkill = Math.min(100, Math.round(driver.qualiSkill * (1 + increase)));
        driver.form = Math.min(100, driver.form + (scenario.parameters.formBoost ?? 10));
      }

      if (scenario.type === 'nerf' && scenario.targetDriverId === driver.driverId) {
        const reduction = (scenario.parameters.reduction ?? 20) / 100;
        driver.skill = Math.max(1, Math.round(driver.skill * (1 - reduction)));
        driver.raceSkill = Math.max(1, Math.round(driver.raceSkill * (1 - reduction)));
        driver.form = Math.max(1, driver.form - (scenario.parameters.formReduction ?? 15));
      }

      if (scenario.type === 'transfer' && scenario.targetDriverId === driver.driverId && scenario.targetTeamId) {
        driver.teamId = scenario.targetTeamId;
      }

      return driver;
    });
  }
}
