import { RaceStatus } from '../../entities/Race.js';

export interface CircuitInfo {
  id: string;
  name: string;
  country: string;
  city: string;
  lengthKm: number;
  turns: number;
  drsZones: number;
}

export interface RaceWithCircuit {
  id: string;
  seasonId: string;
  circuitId: string;
  name: string;
  round: number;
  status: RaceStatus;
  date: Date;
  qualifyingDate: Date;
  raceDate: Date;
  localTimezone: string;
  weatherForecast?: Record<string, unknown>;
  laps: number;
  createdAt: Date;
  updatedAt: Date;
  circuit: CircuitInfo;
}
