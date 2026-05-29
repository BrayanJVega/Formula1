export interface TeamProps {
  id?: string;
  name: string;
  fullName: string;
  nationality: string;
  base: string;
  teamPrincipal: string;
  chassis: string;
  powerUnit: string;
  logoUrl?: string;
  photoUrl?: string;
  biography?: string;
  isActive?: boolean;
  foundedYear: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Team {
  readonly id: string;
  readonly name: string;
  readonly fullName: string;
  readonly nationality: string;
  readonly base: string;
  readonly teamPrincipal: string;
  readonly chassis: string;
  readonly powerUnit: string;
  readonly logoUrl?: string;
  readonly photoUrl?: string;
  readonly biography?: string;
  readonly isActive: boolean;
  readonly foundedYear: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: TeamProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.name = props.name;
    this.fullName = props.fullName;
    this.nationality = props.nationality;
    this.base = props.base;
    this.teamPrincipal = props.teamPrincipal;
    this.chassis = props.chassis;
    this.powerUnit = props.powerUnit;
    this.logoUrl = props.logoUrl;
    this.photoUrl = props.photoUrl;
    this.biography = props.biography;
    this.isActive = props.isActive ?? true;
    this.foundedYear = props.foundedYear;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
