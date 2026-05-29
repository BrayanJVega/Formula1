export type AchievementCategory = 'prediction' | 'fantasy' | 'streak' | 'social' | 'special';

export interface AchievementProps {
  id?: string;
  key: string;
  name: string;
  description: string;
  iconUrl?: string;
  category: AchievementCategory;
  pointsReward: number;
  criteria: Record<string, unknown>;
  createdAt?: Date;
}

export class Achievement {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly iconUrl?: string;
  readonly category: AchievementCategory;
  readonly pointsReward: number;
  readonly criteria: Record<string, unknown>;
  readonly createdAt: Date;

  constructor(props: AchievementProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.key = props.key;
    this.name = props.name;
    this.description = props.description;
    this.iconUrl = props.iconUrl;
    this.category = props.category;
    this.pointsReward = props.pointsReward;
    this.criteria = props.criteria;
    this.createdAt = props.createdAt ?? new Date();
  }
}
