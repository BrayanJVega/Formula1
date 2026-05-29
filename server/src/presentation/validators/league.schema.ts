import { z } from 'zod';

export const createLeagueSchema = z.object({
  name: z.string().min(1, 'League name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().max(500).optional(),
  maxMembers: z.number().int().min(2).max(100).optional(),
  isPrivate: z.boolean().optional(),
});

export const joinLeagueSchema = z.object({
  code: z.string().min(1, 'Code is required').max(20),
});
