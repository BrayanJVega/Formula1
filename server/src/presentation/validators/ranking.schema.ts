import { z } from 'zod';

export const globalRankingQuerySchema = z.object({
  seasonId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const weeklyRankingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const countryRankingParamsSchema = z.object({
  countryCode: z.string().min(2).max(5),
});

export const userRankingQuerySchema = z.object({
  seasonId: z.string().uuid().optional(),
});
