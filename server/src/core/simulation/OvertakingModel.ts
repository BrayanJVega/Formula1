import { F1_CONSTANTS } from './constants.js';
import type { DriverLapState, CircuitCharacteristics, WeatherCondition, DriverPerformance } from './types.js';

interface OvertakeAttempt {
  attackerIndex: number;
  defenderIndex: number;
  success: boolean;
}

export class OvertakingModel {
  simulateOvertakes(
    driverStates: DriverLapState[],
    performanceMap: Map<string, DriverPerformance>,
    circuit: CircuitCharacteristics,
    weather: WeatherCondition,
    _lapNumber: number,
  ): DriverLapState[] {
    const sorted = [...driverStates].filter(d => !d.dnf).sort((a, b) => a.position - b.position);
    const attempts: OvertakeAttempt[] = [];

    for (let i = 0; i < sorted.length - 1; i++) {
      const attacker = sorted[i + 1];
      const defender = sorted[i];
      const gap = defender.gapToFront;

      if (gap > 2.5) continue;

      const perfA = performanceMap.get(attacker.driverId);
      const perfD = performanceMap.get(defender.driverId);
      if (!perfA || !perfD) continue;

      const prob = this.calculateOvertakeProbability(
        attacker, defender, perfA, perfD, circuit, weather,
      );

      if (Math.random() < prob) {
        attempts.push({ attackerIndex: i + 1, defenderIndex: i, success: true });
      }
    }

    const newStates = [...driverStates];
    for (const attempt of attempts) {
      const attPos = newStates.findIndex(d => d.driverId === sorted[attempt.attackerIndex].driverId);
      const defPos = newStates.findIndex(d => d.driverId === sorted[attempt.defenderIndex].driverId);

      if (attPos === -1 || defPos === -1) continue;

      const tempPos = newStates[attPos].position;
      newStates[attPos].position = newStates[defPos].position;
      newStates[defPos].position = tempPos;
    }

    return newStates;
  }

  private calculateOvertakeProbability(
    attacker: DriverLapState,
    defender: DriverLapState,
    perfA: DriverPerformance,
    perfD: DriverPerformance,
    circuit: CircuitCharacteristics,
    weather: WeatherCondition,
  ): number {
    const speedDiff = (perfA.raceSkill - perfD.raceSkill) / 100;
    const drsBonus = attacker.drsEnabled ? 0.15 : 0;
    const aggressionFactor = perfA.aggression / 100 * 0.2;
    const circuitFactor = 1 - circuit.overtakingDifficulty / 100;
    const weatherFactor = weather === 'dry' ? 1 : weather === 'light_rain' ? 0.8 : 0.5;
    const tyreDiff = (defender.tyre.wear - attacker.tyre.wear) / 100 * 0.1;

    return Math.max(0, Math.min(0.8,
      F1_CONSTANTS.OVERTAKE_PROBABILITY_BASE + speedDiff * 0.3 + drsBonus + aggressionFactor + circuitFactor * 0.1 + tyreDiff * weatherFactor
    ));
  }

  updateDrs(
    driverStates: DriverLapState[],
    lapNumber: number,
    safetyCarActive: boolean,
  ): DriverLapState[] {
    return driverStates.map(d => {
      if (d.dnf) return d;
      const drsEnabled = !safetyCarActive && lapNumber >= F1_CONSTANTS.DRS_ACTIVATION_LAPS;
      return { ...d, drsEnabled };
    });
  }
}
