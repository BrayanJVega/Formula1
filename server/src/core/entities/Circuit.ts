export interface CircuitProps {
  id?: string;
  name: string;
  country: string;
  city: string;
  lengthKm: number;
  turns: number;
  drsZones: number;
  lapRecord?: string;
  lapRecordTime?: number;
  lapRecordDriverId?: string;
  lapRecordYear?: number;
  capacity?: number;
  firstGpYear: number;
  circuitMapUrl?: string;
  imageUrl?: string;
  description?: string;
  altitude?: number;
  isStreetCircuit?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Circuit {
  readonly id: string;
  readonly name: string;
  readonly country: string;
  readonly city: string;
  readonly lengthKm: number;
  readonly turns: number;
  readonly drsZones: number;
  readonly lapRecord?: string;
  readonly lapRecordTime?: number;
  readonly lapRecordDriverId?: string;
  readonly lapRecordYear?: number;
  readonly capacity?: number;
  readonly firstGpYear: number;
  readonly circuitMapUrl?: string;
  readonly imageUrl?: string;
  readonly description?: string;
  readonly altitude?: number;
  readonly isStreetCircuit: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: CircuitProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.name = props.name;
    this.country = props.country;
    this.city = props.city;
    this.lengthKm = props.lengthKm;
    this.turns = props.turns;
    this.drsZones = props.drsZones;
    this.lapRecord = props.lapRecord;
    this.lapRecordTime = props.lapRecordTime;
    this.lapRecordDriverId = props.lapRecordDriverId;
    this.lapRecordYear = props.lapRecordYear;
    this.capacity = props.capacity;
    this.firstGpYear = props.firstGpYear;
    this.circuitMapUrl = props.circuitMapUrl;
    this.imageUrl = props.imageUrl;
    this.description = props.description;
    this.altitude = props.altitude;
    this.isStreetCircuit = props.isStreetCircuit ?? false;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
