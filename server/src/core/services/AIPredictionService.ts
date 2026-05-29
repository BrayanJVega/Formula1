import { query, queryOne } from '../../config/database.js';

export interface DriverFormData {
  driverId: string;
  driverName: string;
  teamId: string;
  teamName: string;
  last5RacePoints: number;
  circuitHistoryPoints: number;
  qualifyingPosition?: number;
  carRating: number;
}

export interface AIPrediction {
  predictedWinner: { driverId: string; driverName: string; probability: number };
  predictedPodium: { driverId: string; driverName: string; probability: number }[];
  predictedTop10: { driverId: string; driverName: string; probability: number }[];
  predictedFastestLap: { driverId: string; driverName: string; probability: number };
  predictedPolePosition: { driverId: string; driverName: string; probability: number };
  safetyCarProbability: number;
  predictedDnfCount: number;
  raceId: string;
  generatedAt: Date;
}

export interface WinProbability {
  driverId: string;
  driverName: string;
  teamName: string;
  probability: number;
  rank: number;
}

export class AIPredictionService {
  async predictRaceWinner(raceId: string): Promise<{ driverId: string; driverName: string; probability: number }[]> {
    const drivers = await this.getDriverFormData(raceId);
    const probabilities = this.calculateWinProbabilities(drivers);
    return probabilities.slice(0, 5);
  }

  async predictPodium(raceId: string): Promise<{ driverId: string; driverName: string; probability: number }[]> {
    const drivers = await this.getDriverFormData(raceId);
    const probabilities = this.calculateWinProbabilities(drivers);
    return probabilities.slice(0, 3);
  }

  async predictTop10(raceId: string): Promise<{ driverId: string; driverName: string; probability: number }[]> {
    const drivers = await this.getDriverFormData(raceId);
    const probabilities = this.calculateWinProbabilities(drivers);
    return probabilities.slice(0, 10);
  }

  async predictFastestLap(raceId: string): Promise<{ driverId: string; driverName: string; probability: number }> {
    const drivers = await this.getDriverFormData(raceId);

    let best: { driverId: string; driverName: string; probability: number } | null = null;
    let bestScore = -Infinity;

    for (const d of drivers) {
      const score =
        d.last5RacePoints * 0.3 +
        d.circuitHistoryPoints * 0.15 +
        d.carRating * 35 +
        (d.qualifyingPosition ? Math.max(0, 20 - d.qualifyingPosition) * 1.5 : 10);

      if (score > bestScore) {
        bestScore = score;
        best = {
          driverId: d.driverId,
          driverName: d.driverName,
          probability: Math.min(Math.round(score * 100) / 100, 95),
        };
      }
    }

    return best ?? { driverId: '', driverName: 'Unknown', probability: 0 };
  }

  async predictPolePosition(raceId: string): Promise<{ driverId: string; driverName: string; probability: number }> {
    const drivers = await this.getDriverFormData(raceId);

    let best: { driverId: string; driverName: string; probability: number } | null = null;
    let bestScore = -Infinity;

    for (const d of drivers) {
      const qualifyingForm = d.qualifyingPosition ? Math.max(0, 20 - d.qualifyingPosition) * 3 : 10;
      const score =
        d.last5RacePoints * 0.25 +
        d.circuitHistoryPoints * 0.2 +
        d.carRating * 30 +
        qualifyingForm;

      if (score > bestScore) {
        bestScore = score;
        best = {
          driverId: d.driverId,
          driverName: d.driverName,
          probability: Math.min(Math.round(score * 100) / 100, 90),
        };
      }
    }

    return best ?? { driverId: '', driverName: 'Unknown', probability: 0 };
  }

  async predictSafetyCarProbability(raceId: string): Promise<number> {
    const circuit = await queryOne<Record<string, unknown>>(
      `SELECT c.* FROM circuits c
       JOIN races r ON r.circuit_id = c.id
       WHERE r.id = $1`,
      [raceId],
    );
    if (!circuit) return 50;

    const turns = circuit.turns as number;
    const isStreet = circuit.is_street_circuit as boolean;
    const lengthKm = circuit.length_km as number;

    let probability = 40;
    if (isStreet) probability += 20;
    if (turns > 15) probability += 10;
    else if (turns > 10) probability += 5;
    if (lengthKm < 4.5) probability += 5;

    const historicalSc = await queryOne<{ avg_sc: string }>(
      `SELECT COALESCE(AVG(CASE WHEN r.safety_car THEN 1 ELSE 0 END) * 100, 40) as avg_sc
       FROM race_results rr
       JOIN races r ON r.id = rr.race_id
       WHERE r.circuit_id = (SELECT circuit_id FROM races WHERE id = $1)
       AND r.status = 'completed'`,
      [raceId],
    );

    if (historicalSc) {
      const histAvg = parseFloat(historicalSc.avg_sc);
      probability = Math.round((probability + histAvg) / 2);
    }

    return Math.min(Math.max(probability, 5), 95);
  }

  async predictDnfCount(raceId: string): Promise<number> {
    const historicalDnf = await queryOne<{ avg_dnf: string }>(
      `SELECT COALESCE(AVG(rr.dnf_count), 3) as avg_dnf
       FROM races r
       JOIN (
         SELECT race_id, COUNT(*) as dnf_count
         FROM race_results
         WHERE status = 'dnf'
         GROUP BY race_id
       ) rr ON rr.race_id = r.id
       WHERE r.circuit_id = (SELECT circuit_id FROM races WHERE id = $1)
       AND r.status = 'completed'`,
      [raceId],
    );

    if (historicalDnf) {
      return Math.round(parseFloat(historicalDnf.avg_dnf));
    }

    const circuit = await queryOne<Record<string, unknown>>(
      `SELECT c.* FROM circuits c
       JOIN races r ON r.circuit_id = c.id
       WHERE r.id = $1`,
      [raceId],
    );

    if (!circuit) return 3;

    const turns = circuit.turns as number;
    const isStreet = circuit.is_street_circuit as boolean;
    let dnfEstimate = 3;

    if (isStreet) dnfEstimate += 1;
    if (turns > 15) dnfEstimate += 1;

    return Math.min(dnfEstimate, 8);
  }

  async getWinProbabilities(raceId: string): Promise<WinProbability[]> {
    const drivers = await this.getDriverFormData(raceId);
    const probabilities = this.calculateWinProbabilities(drivers);
    return probabilities.map((p, i) => ({
      driverId: p.driverId,
      driverName: p.driverName,
      teamName: drivers.find((d) => d.driverId === p.driverId)?.teamName ?? '',
      probability: p.probability,
      rank: i + 1,
    }));
  }

  async getFullPredictions(raceId: string): Promise<AIPrediction> {
    const [winnerProbs, podium, top10, fastestLap, pole, scProb, dnfCount] = await Promise.all([
      this.predictRaceWinner(raceId),
      this.predictPodium(raceId),
      this.predictTop10(raceId),
      this.predictFastestLap(raceId),
      this.predictPolePosition(raceId),
      this.predictSafetyCarProbability(raceId),
      this.predictDnfCount(raceId),
    ]);

    return {
      predictedWinner: winnerProbs[0] ?? { driverId: '', driverName: 'Unknown', probability: 0 },
      predictedPodium: podium,
      predictedTop10: top10,
      predictedFastestLap: fastestLap,
      predictedPolePosition: pole,
      safetyCarProbability: scProb,
      predictedDnfCount: dnfCount,
      raceId,
      generatedAt: new Date(),
    };
  }

  private async getDriverFormData(raceId: string): Promise<DriverFormData[]> {
    const race = await queryOne<Record<string, unknown>>(
      'SELECT r.*, c.is_street_circuit, c.turns FROM races r JOIN circuits c ON c.id = r.circuit_id WHERE r.id = $1',
      [raceId],
    );
    if (!race) return [];

    const drivers = await query<Record<string, unknown>>(
      `SELECT d.id as driver_id, d.name as driver_name, t.id as team_id, t.name as team_name
       FROM drivers d
       JOIN teams t ON t.id = d.team_id
       WHERE d.is_active = true
       ORDER BY random()`,
    );

    const formData: DriverFormData[] = [];

    for (const driver of drivers) {
      const last5Points = await this.getLast5RacePoints(driver.driver_id as string);
      const circuitHistory = await this.getCircuitHistory(
        driver.driver_id as string,
        race.circuit_id as string,
      );
      const qualifyingPos = await this.getQualifyingPosition(driver.driver_id as string, raceId);
      const carRating = await this.getTeamCarRating(driver.team_id as string);

      formData.push({
        driverId: driver.driver_id as string,
        driverName: driver.driver_name as string,
        teamId: driver.team_id as string,
        teamName: driver.team_name as string,
        last5RacePoints: last5Points,
        circuitHistoryPoints: circuitHistory,
        qualifyingPosition: qualifyingPos,
        carRating,
      });
    }

    return formData;
  }

  private async getLast5RacePoints(driverId: string): Promise<number> {
    const rows = await query<Record<string, unknown>>(
      `SELECT rr.points FROM race_results rr
       JOIN races r ON r.id = rr.race_id
       WHERE rr.driver_id = $1 AND r.status = 'completed'
       ORDER BY r.race_date DESC
       LIMIT 5`,
      [driverId],
    );

    if (rows.length === 0) return 0;
    return rows.reduce((sum, r) => sum + parseFloat(r.points as string), 0) / rows.length;
  }

  private async getCircuitHistory(driverId: string, circuitId: string): Promise<number> {
    const rows = await query<Record<string, unknown>>(
      `SELECT rr.points, rr.finish_position FROM race_results rr
       JOIN races r ON r.id = rr.race_id
       WHERE rr.driver_id = $1 AND r.circuit_id = $2 AND r.status = 'completed'
       ORDER BY r.race_date DESC
       LIMIT 3`,
      [driverId, circuitId],
    );

    if (rows.length === 0) return 0;
    let score = 0;
    for (const row of rows) {
      const pos = row.finish_position as number;
      if (pos && pos <= 10) {
        score += (11 - pos) * 2;
      }
      score += parseFloat(row.points as string) * 0.5;
    }
    return score / rows.length;
  }

  private async getQualifyingPosition(driverId: string, raceId: string): Promise<number | undefined> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT position FROM qualifying_results WHERE driver_id = $1 AND race_id = $2',
      [driverId, raceId],
    );
    return row ? (row.position as number) : undefined;
  }

  private async getTeamCarRating(teamId: string): Promise<number> {
    const stats = await queryOne<Record<string, unknown>>(
      'SELECT season_points FROM team_stats WHERE team_id = $1',
      [teamId],
    );
    if (!stats) return 5;

    const points = parseFloat(stats.season_points as string);
    return Math.min(Math.max(points / 50, 1), 10);
  }

  private calculateWinProbabilities(drivers: DriverFormData[]): { driverId: string; driverName: string; probability: number }[] {
    const scores = drivers.map((d) => {
      const formScore = (d.last5RacePoints / 25) * 40;
      const circuitScore = (d.circuitHistoryPoints / 20) * 25;
      const teamScore = (d.carRating / 10) * 20;
      const qualyScore = d.qualifyingPosition
        ? Math.max(0, (20 - d.qualifyingPosition) / 20) * 15
        : 7.5;

      const totalScore = formScore + circuitScore + teamScore + qualyScore;
      return { ...d, score: totalScore };
    });

    const totalScoreSum = scores.reduce((sum, d) => sum + Math.max(d.score, 0), 0);
    if (totalScoreSum <= 0) {
      return scores.map((d) => ({ driverId: d.driverId, driverName: d.driverName, probability: 0 }));
    }

    const withProbabilities = scores.map((d) => ({
      driverId: d.driverId,
      driverName: d.driverName,
      score: d.score,
      probability: Math.round((Math.max(d.score, 0) / totalScoreSum) * 10000) / 100,
    }));

    withProbabilities.sort((a, b) => b.probability - a.probability);

    const top = withProbabilities.slice(0, 15);
    const rest = withProbabilities.slice(15);
      const restProb = rest.reduce((sum, r) => sum + r.probability, 0);

    if (rest.length > 0) {
      const lastTop = top[top.length - 1];
      if (lastTop) {
        lastTop.probability = Math.round((lastTop.probability + restProb) * 100) / 100;
      }
    }

    return top.map(({ driverId, driverName, probability }) => ({
      driverId,
      driverName,
      probability,
    }));
  }
}
