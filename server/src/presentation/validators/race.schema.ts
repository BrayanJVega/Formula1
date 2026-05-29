import { z } from 'zod';
import { RACE_STATUS } from '../../shared/constants.js';

export const createRaceSchema = z.object({
  seasonId: z.string().uuid('Invalid season ID'),
  circuitId: z.string().uuid('Invalid circuit ID'),
  name: z.string().min(1, 'Race name is required').max(200),
  round: z.number().int().positive('Round must be a positive integer'),
  date: z.coerce.date(),
  qualifyingDate: z.coerce.date(),
  raceDate: z.coerce.date(),
  localTimezone: z.string().min(1, 'Timezone is required'),
  laps: z.number().int().positive('Laps must be a positive integer'),
  weatherForecast: z.record(z.unknown()).optional(),
});

export const updateRaceSchema = z.object({
  seasonId: z.string().uuid('Invalid season ID').optional(),
  circuitId: z.string().uuid('Invalid circuit ID').optional(),
  name: z.string().min(1, 'Race name is required').max(200).optional(),
  round: z.number().int().positive('Round must be a positive integer').optional(),
  status: z.enum([
    RACE_STATUS.UPCOMING,
    RACE_STATUS.QUALIFYING_COMPLETE,
    RACE_STATUS.COMPLETED,
    RACE_STATUS.CANCELLED,
  ] as const satisfies [string, ...string[]]).optional(),
  date: z.coerce.date().optional(),
  qualifyingDate: z.coerce.date().optional(),
  raceDate: z.coerce.date().optional(),
  localTimezone: z.string().min(1, 'Timezone is required').optional(),
  laps: z.number().int().positive('Laps must be a positive integer').optional(),
  weatherForecast: z.record(z.unknown()).optional(),
});

export const getRacesQuerySchema = z.object({
  seasonId: z.string().uuid('Invalid season ID'),
  status: z.string().optional(),
});
