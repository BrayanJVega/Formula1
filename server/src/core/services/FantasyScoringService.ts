export interface RaceResult {
  driverId: string;
  finishPosition: number;
  gridPosition: number;
  fastestLap: boolean;
  isPole: boolean;
  overtakes: number;
  status: string;
}

export interface FantasyScoringResult {
  driverId: string;
  racePositionPoints: number;
  qualifyingBonus: number;
  overtakePoints: number;
  fastestLapPoints: number;
  positionsGainedPoints: number;
  totalPoints: number;
}

const RACE_POSITION_POINTS: Record<number, number> = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1,
};

const POLE_BONUS = 10;
const FASTEST_LAP_POINTS = 5;
const OVERTAKE_POINTS_PER = 1;
const POSITIONS_GAINED_POINTS_PER = 2;

export class FantasyScoringService {
  calculateDriverScore(result: RaceResult): FantasyScoringResult {
    const racePositionPoints = RACE_POSITION_POINTS[result.finishPosition] ?? 0;

    const qualifyingBonus = result.isPole ? POLE_BONUS : 0;

    const overtakePoints = result.overtakes > 0
      ? result.overtakes * OVERTAKE_POINTS_PER
      : 0;

    const fastestLapPoints = result.fastestLap ? FASTEST_LAP_POINTS : 0;

    const positionsGained = result.gridPosition - result.finishPosition;
    const positionsGainedPoints = positionsGained > 0
      ? positionsGained * POSITIONS_GAINED_POINTS_PER
      : 0;

    const totalPoints = racePositionPoints + qualifyingBonus + overtakePoints
      + fastestLapPoints + positionsGainedPoints;

    return {
      driverId: result.driverId,
      racePositionPoints,
      qualifyingBonus,
      overtakePoints,
      fastestLapPoints,
      positionsGainedPoints,
      totalPoints,
    };
  }
}
