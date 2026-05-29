export interface DriverProps {
  id?: string;
  name: string;
  number: number;
  nationality: string;
  dateOfBirth: Date;
  teamId: string;
  photoUrl?: string;
  biography?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Driver {
  readonly id: string;
  readonly name: string;
  readonly number: number;
  readonly nationality: string;
  readonly dateOfBirth: Date;
  readonly teamId: string;
  readonly photoUrl?: string;
  readonly biography?: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: DriverProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.name = props.name;
    this.number = props.number;
    this.nationality = props.nationality;
    this.dateOfBirth = props.dateOfBirth;
    this.teamId = props.teamId;
    this.photoUrl = props.photoUrl;
    this.biography = props.biography;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
