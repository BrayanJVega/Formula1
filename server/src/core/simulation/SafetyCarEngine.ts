import { F1_CONSTANTS } from './constants.js';
import type { DriverLapState, SafetyCarPeriod, Incident } from './types.js';

export class SafetyCarEngine {
  private active = false;
  private currentPeriod: SafetyCarPeriod | null = null;
  private periods: SafetyCarPeriod[] = [];
  private lapsSinceRestart = 0;

  isActive(): boolean {
    return this.active;
  }

  getCurrentPeriod(): SafetyCarPeriod | null {
    return this.currentPeriod;
  }

  getPeriods(): SafetyCarPeriod[] {
    return [...this.periods];
  }

  evaluateDeployment(
    incident: Incident,
    lap: number,
    totalLaps: number,
  ): boolean {
    if (this.active) return false;
    if (!incident.safetyCarDeployed) return false;
    if (totalLaps - lap < F1_CONSTANTS.SAFETY_CAR_MIN_LAPS + 1) return false;

    this.active = true;
    this.currentPeriod = {
      startLap: lap,
      endLap: 0,
      reason: incident.description,
    };
    this.lapsSinceRestart = 0;
    return true;
  }

  applySafetyCarEffects(
    driverStates: DriverLapState[],
    lap: number,
  ): DriverLapState[] {
    if (!this.active || !this.currentPeriod) return driverStates;

    this.lapsSinceRestart++;

    const sorted = [...driverStates].filter(d => !d.dnf).sort((a, b) => a.position - b.position);

    for (let i = 1; i < sorted.length; i++) {
      sorted[i].gapToFront = 0.3 + Math.random() * 0.2;
    }

    for (let i = 0; i < sorted.length; i++) {
      sorted[i].drsEnabled = false;
    }

    if (this.lapsSinceRestart >= F1_CONSTANTS.SAFETY_CAR_MIN_LAPS) {
      this.endPeriod(lap);
    }

    return driverStates;
  }

  shouldSlowField(): boolean {
    return this.active;
  }

  private endPeriod(lap: number): void {
    if (this.currentPeriod) {
      this.currentPeriod.endLap = lap;
      this.periods.push(this.currentPeriod);
    }
    this.active = false;
    this.currentPeriod = null;
    this.lapsSinceRestart = 0;
  }

  reset(): void {
    this.active = false;
    this.currentPeriod = null;
    this.periods = [];
    this.lapsSinceRestart = 0;
  }
}
