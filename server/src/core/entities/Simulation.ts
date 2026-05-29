export type SimulationType = 'race' | 'season' | 'what_if';

export interface SimulationResultProps {
  id?: string;
  userId?: string;
  raceId?: string;
  type: SimulationType;
  parameters: Record<string, unknown>;
  result: Record<string, unknown>;
  createdAt?: Date;
}

export class SimulationResult {
  readonly id: string;
  readonly userId?: string;
  readonly raceId?: string;
  readonly type: SimulationType;
  readonly parameters: Record<string, unknown>;
  readonly result: Record<string, unknown>;
  readonly createdAt: Date;

  constructor(props: SimulationResultProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.userId = props.userId;
    this.raceId = props.raceId;
    this.type = props.type;
    this.parameters = props.parameters;
    this.result = props.result;
    this.createdAt = props.createdAt ?? new Date();
  }
}
