import { z } from 'zod';

export const createFantasyTeamSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  seasonId: z.string().uuid('Invalid season ID'),
});

export const updateFantasyTeamSchema = z.object({
  name: z.string().min(1).max(100),
});

export const addPickSchema = z.object({
  driverId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  type: z.enum(['driver', 'constructor']),
  cost: z.number().positive('Cost must be positive'),
});

export const transferDriverSchema = z.object({
  pickId: z.string().uuid('Invalid pick ID'),
  newDriverId: z.string().uuid('Invalid driver ID'),
  newDriverCost: z.number().positive('Cost must be positive'),
  raceId: z.string().uuid().optional(),
});
