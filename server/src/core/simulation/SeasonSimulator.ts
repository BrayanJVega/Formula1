import { RaceSimulator } from './RaceSimulator.js';
import type {
  DriverPerformance, CircuitCharacteristics, WeatherState,
  SeasonSimulationResult, RaceSimulationResult,
} from './types.js';

export class SeasonSimulator {
  private raceSimulator = new RaceSimulator();

  simulate(
    seasonId: string,
    year: number,
    races: { raceId: string; raceName: string; circuit: CircuitCharacteristics; laps: number; initialWeather?: Partial<WeatherState> }[],
    drivers: DriverPerformance[],
  ): SeasonSimulationResult {
    const raceResults: RaceSimulationResult[] = [];
    const pointsMap = new Map<string, number>();
    const winsMap = new Map<string, number>();
    const podiumsMap = new Map<string, number>();
    const teamPointsMap = new Map<string, number>();
    const teamWinsMap = new Map<string, number>();

    for (const race of races) {
      const result = this.raceSimulator.simulate(
        drivers, race.circuit, race.laps, race.raceId, race.raceName, race.initialWeather,
      );
      raceResults.push(result);

      for (const r of result.results) {
        const current = pointsMap.get(r.driverId) ?? 0;
        pointsMap.set(r.driverId, current + r.points);

        if (r.position === 1) {
          winsMap.set(r.driverId, (winsMap.get(r.driverId) ?? 0) + 1);
          teamWinsMap.set(r.teamId, (teamWinsMap.get(r.teamId) ?? 0) + 1);
        }
        if (r.position <= 3) {
          podiumsMap.set(r.driverId, (podiumsMap.get(r.driverId) ?? 0) + 1);
        }

        const teamCurrent = teamPointsMap.get(r.teamId) ?? 0;
        teamPointsMap.set(r.teamId, teamCurrent + r.points);
      }
    }

    const driverStandings = drivers
      .map(d => ({
        driverId: d.driverId,
        driverName: d.driverName,
        teamId: d.teamId,
        points: pointsMap.get(d.driverId) ?? 0,
        wins: winsMap.get(d.driverId) ?? 0,
        podiums: podiumsMap.get(d.driverId) ?? 0,
      }))
      .sort((a, b) => b.points - a.points)
      .map((entry, idx) => ({ ...entry, position: idx + 1 }));

    const teamNames = new Map(drivers.map(d => [d.teamId, d.teamName]));
    const constructorStandings = [...new Set(drivers.map(d => d.teamId))]
      .map(teamId => ({
        teamId,
        teamName: teamNames.get(teamId) ?? '',
        points: teamPointsMap.get(teamId) ?? 0,
        wins: teamWinsMap.get(teamId) ?? 0,
      }))
      .sort((a, b) => b.points - a.points)
      .map((entry, idx) => ({ ...entry, position: idx + 1 }));

    return {
      seasonId,
      year,
      races: raceResults,
      championshipStandings: driverStandings,
      constructorStandings,
    };
  }
}
