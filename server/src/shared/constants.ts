export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const BCRYPT_SALT_ROUNDS = 12;
export const PASSWORD_MIN_LENGTH = 8;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const PREDICTION_TYPES = {
  QUALIFYING: 'qualifying',
  RACE: 'race',
} as const;

export const RACE_STATUS = {
  UPCOMING: 'upcoming',
  QUALIFYING_COMPLETE: 'qualifying_complete',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const SCORING_DEFAULT = {
  POLE: 10,
  WINNER: 25,
  PODIUM_EXACT: 50,
  TOP10_EXACT: 100,
  FASTEST_LAP: 15,
  SAFETY_CAR: 10,
  RED_FLAG: 10,
  DNF_RANGE: 15,
  WINNER_TOP3: 10,
  PODIUM_ANY: 5,
  TOP10_ANY: 3,
} as const;
