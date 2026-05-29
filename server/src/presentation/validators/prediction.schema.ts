import { z } from 'zod';
import { PREDICTION_TYPES } from '../../shared/constants.js';

export const createPredictionSchema = z.object({
  raceId: z.string().uuid('Invalid race ID'),
  type: z.enum([PREDICTION_TYPES.QUALIFYING, PREDICTION_TYPES.RACE] as const satisfies [string, ...string[]]),
  polePrediction: z.string().uuid('Invalid driver ID').optional(),
  top3Prediction: z.array(z.string().uuid('Invalid driver ID')).length(3).optional(),
  top10Prediction: z.array(z.string().uuid('Invalid driver ID')).length(10).optional(),
  winnerPrediction: z.string().uuid('Invalid driver ID').optional(),
  podiumPrediction: z.array(z.string().uuid('Invalid driver ID')).length(3).optional(),
  fastestLapPrediction: z.string().uuid('Invalid driver ID').optional(),
  safetyCarPrediction: z.boolean().optional(),
  redFlagPrediction: z.boolean().optional(),
  dnfsPrediction: z.number().int().min(0).optional(),
});

export const updatePredictionSchema = z.object({
  polePrediction: z.string().uuid('Invalid driver ID').nullable().optional(),
  top3Prediction: z.array(z.string().uuid('Invalid driver ID')).length(3).nullable().optional(),
  top10Prediction: z.array(z.string().uuid('Invalid driver ID')).length(10).nullable().optional(),
  winnerPrediction: z.string().uuid('Invalid driver ID').nullable().optional(),
  podiumPrediction: z.array(z.string().uuid('Invalid driver ID')).length(3).nullable().optional(),
  fastestLapPrediction: z.string().uuid('Invalid driver ID').nullable().optional(),
  safetyCarPrediction: z.boolean().nullable().optional(),
  redFlagPrediction: z.boolean().nullable().optional(),
  dnfsPrediction: z.number().int().min(0).nullable().optional(),
});

export const submitPredictionSchema = z.object({
  actualResults: z.object({
    poleId: z.string().uuid().optional(),
    top3Ids: z.array(z.string().uuid()).optional(),
    top10Ids: z.array(z.string().uuid()).optional(),
    winnerId: z.string().uuid().optional(),
    podiumIds: z.array(z.string().uuid()).optional(),
    fastestLapId: z.string().uuid().optional(),
    safetyCar: z.boolean().optional(),
    redFlag: z.boolean().optional(),
    dnfCount: z.number().int().min(0).optional(),
  }),
});

export const predictionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
