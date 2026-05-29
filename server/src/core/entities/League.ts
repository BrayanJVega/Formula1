export interface LeagueProps {
  id?: string;
  name: string;
  description?: string;
  code: string;
  ownerId: string;
  maxMembers?: number;
  isPrivate?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class League {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly code: string;
  readonly ownerId: string;
  readonly maxMembers: number;
  readonly isPrivate: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: LeagueProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.name = props.name;
    this.description = props.description;
    this.code = props.code;
    this.ownerId = props.ownerId;
    this.maxMembers = props.maxMembers ?? 50;
    this.isPrivate = props.isPrivate ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
