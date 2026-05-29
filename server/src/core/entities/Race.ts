export type RaceStatus = 'upcoming' | 'qualifying_complete' | 'completed' | 'cancelled';

export interface RaceProps {
  id?: string;
  seasonId: string;
  circuitId: string;
  name: string;
  round: number;
  status?: RaceStatus;
  date: Date;
  qualifyingDate: Date;
  raceDate: Date;
  localTimezone: string;
  weatherForecast?: Record<string, unknown>;
  laps: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Race {
  readonly id: string;
  readonly seasonId: string;
  readonly circuitId: string;
  readonly name: string;
  readonly round: number;
  readonly status: RaceStatus;
  readonly date: Date;
  readonly qualifyingDate: Date;
  readonly raceDate: Date;
  readonly localTimezone: string;
  readonly weatherForecast?: Record<string, unknown>;
  readonly laps: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: RaceProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.seasonId = props.seasonId;
    this.circuitId = props.circuitId;
    this.name = props.name;
    this.round = props.round;
    this.status = props.status ?? 'upcoming';
    this.date = props.date;
    this.qualifyingDate = props.qualifyingDate;
    this.raceDate = props.raceDate;
    this.localTimezone = props.localTimezone;
    this.weatherForecast = props.weatherForecast;
    this.laps = props.laps;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
