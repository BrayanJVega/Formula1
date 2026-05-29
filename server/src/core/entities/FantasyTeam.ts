export interface FantasyTeamProps {
  id?: string;
  userId: string;
  seasonId: string;
  name: string;
  budget?: number;
  totalScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FantasyTeam {
  readonly id: string;
  readonly userId: string;
  readonly seasonId: string;
  readonly name: string;
  readonly budget: number;
  readonly totalScore: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: FantasyTeamProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.userId = props.userId;
    this.seasonId = props.seasonId;
    this.name = props.name;
    this.budget = props.budget ?? 100;
    this.totalScore = props.totalScore ?? 0;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
