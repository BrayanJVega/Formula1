import { F1_CONSTANTS } from './constants.js';
import type { DriverPerformance, CircuitCharacteristics, WeatherCondition, QualifyingResult } from './types.js';

export class QualifyingSimulator {
  simulate(
    drivers: DriverPerformance[],
    circuit: CircuitCharacteristics,
    weather: WeatherCondition,
  ): QualifyingResult[] {
    const allResults = drivers.map(d => ({
      ...this.simulateLap(d, circuit, weather, 1),
      q1Time: undefined as number | undefined,
    }));

    const q1Drivers = allResults.sort((a, b) => (a.q1Time ?? 999) - (b.q1Time ?? 999));
    const q1Advancers = q1Drivers.slice(0, 15);
    const q1Eliminated = q1Drivers.slice(15).map(r => ({ ...r, eliminatedIn: 'q1' as const }));

    const q2Results = q1Advancers.map(d => {
      const perf = drivers.find(p => p.driverId === d.driverId)!;
      const time = this.calculateLapTime(perf, circuit, weather, 2);
      return { ...d, q2Time: time };
    });
    const q2Sorted = q2Results.sort((a, b) => (a.q2Time ?? 999) - (b.q2Time ?? 999));
    const q2Advancers = q2Sorted.slice(0, 10);
    const q2Eliminated = q2Sorted.slice(10).map(r => ({ ...r, eliminatedIn: 'q2' as const }));

    const q3Results = q2Advancers.map(d => {
      const perf = drivers.find(p => p.driverId === d.driverId)!;
      const time = this.calculateLapTime(perf, circuit, weather, 3);
      return { ...d, q3Time: time };
    });
    const q3Sorted = q3Results.sort((a, b) => (a.q3Time ?? 999) - (b.q3Time ?? 999));
    const q3Completed = q3Sorted.map(r => ({ ...r, eliminatedIn: 'q3' as const }));

    const allFinal = [...q1Eliminated, ...q2Eliminated, ...q3Completed];
    const positionSorted = allFinal.sort((a, b) => {
      const aTime = a.q3Time ?? a.q2Time ?? a.q1Time ?? 999;
      const bTime = b.q3Time ?? b.q2Time ?? b.q1Time ?? 999;
      return aTime - bTime;
    });

    return positionSorted.map((r, i) => ({
      driverId: r.driverId,
      driverName: r.driverName,
      teamId: r.teamId,
      teamName: r.teamName,
      position: i + 1,
      q1Time: r.q1Time,
      q2Time: r.q2Time,
      q3Time: r.q3Time,
      eliminatedIn: r.eliminatedIn,
    }));
  }

  private simulateLap(
    driver: DriverPerformance,
    circuit: CircuitCharacteristics,
    weather: WeatherCondition,
    session: number,
  ): { driverId: string; driverName: string; teamId: string; teamName: string; q1Time?: number; q2Time?: number; q3Time?: number; eliminatedIn?: string } {
    const time = this.calculateLapTime(driver, circuit, weather, session);
    return {
      driverId: driver.driverId,
      driverName: driver.driverName,
      teamId: driver.teamId,
      teamName: driver.teamName,
      q1Time: time,
    };
  }

  private calculateLapTime(
    driver: DriverPerformance,
    circuit: CircuitCharacteristics,
    weather: WeatherCondition,
    session: number,
  ): number {
    const baseLap = F1_CONSTANTS.BASE_LAP_TIME;
    const skillFactor = 1 - (driver.qualiSkill / 100) * 0.08;
    const circuitFactor = (circuit.lengthKm / 5.5) * 0.15;
    const trackEvolution = 1 - (session - 1) * 0.005;
    const weatherFactor = weather === 'dry' ? 1 : weather === 'light_rain' ? 1.03 : 1.08;
    const randomness = (Math.random() - 0.5) * 0.15;
    const formFactor = 1 - (driver.form / 100) * 0.02;

    const finalTime = baseLap * skillFactor * weatherFactor * trackEvolution * formFactor + circuitFactor + randomness;

    return Math.round(finalTime * 1000) / 1000;
  }
}
