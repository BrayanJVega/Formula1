import { z } from 'zod';

const driverPerformanceSchema = z.object({
  driverId: z.string(),
  driverName: z.string(),
  teamId: z.string(),
  teamName: z.string(),
  skill: z.number().min(0).max(100),
  qualiSkill: z.number().min(0).max(100),
  raceSkill: z.number().min(0).max(100),
  consistency: z.number().min(0).max(100),
  experience: z.number().min(0).max(100),
  aggression: z.number().min(0).max(100),
  tyreManagement: z.number().min(0).max(100),
  wetSkill: z.number().min(0).max(100),
  form: z.number().min(0).max(100),
});

const circuitCharacteristicsSchema = z.object({
  circuitId: z.string(),
  circuitName: z.string(),
  lengthKm: z.number(),
  turns: z.number(),
  drsZones: z.number(),
  avgSpeed: z.number(),
  overtakingDifficulty: z.number().min(0).max(100),
  tyreDegradation: z.number().min(0).max(100),
  brakingDifficulty: z.number().min(0).max(100),
  cornerComplexity: z.number().min(0).max(100),
});

const weatherStateSchema = z.object({
  condition: z.enum(['dry', 'light_rain', 'heavy_rain', 'wet']).optional(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  windSpeed: z.number().optional(),
  trackTemperature: z.number().optional(),
  rainIntensity: z.number().optional(),
  changeProbability: z.number().optional(),
});

const qualifyingResultSchema = z.object({
  driverId: z.string(),
  driverName: z.string(),
  teamId: z.string(),
  teamName: z.string(),
  position: z.number(),
  q1Time: z.number().optional(),
  q2Time: z.number().optional(),
  q3Time: z.number().optional(),
  eliminatedIn: z.enum(['q1', 'q2', 'q3']),
});

export const runRaceSchema = z.object({
  raceId: z.string(),
  raceName: z.string(),
  drivers: z.array(driverPerformanceSchema).min(2),
  circuit: circuitCharacteristicsSchema,
  laps: z.number().int().positive(),
  initialWeather: weatherStateSchema.optional(),
  gridOrder: z.array(qualifyingResultSchema).optional(),
});

const seasonRaceInputSchema = z.object({
  raceId: z.string(),
  raceName: z.string(),
  circuit: circuitCharacteristicsSchema,
  laps: z.number().int().positive(),
  initialWeather: weatherStateSchema.optional(),
});

export const runSeasonSchema = z.object({
  seasonId: z.string(),
  year: z.number().int(),
  races: z.array(seasonRaceInputSchema).min(1),
  drivers: z.array(driverPerformanceSchema).min(2),
});

export const runWhatIfSchema = z.object({
  raceId: z.string(),
  raceName: z.string(),
  drivers: z.array(driverPerformanceSchema).min(2),
  circuit: circuitCharacteristicsSchema,
  laps: z.number().int().positive(),
  scenario: z.object({
    type: z.enum(['injury', 'buff', 'nerf', 'transfer', 'weather']),
    targetDriverId: z.string().optional(),
    targetTeamId: z.string().optional(),
    parameters: z.record(z.number()),
  }),
  initialWeather: weatherStateSchema.optional(),
  gridOrder: z.array(qualifyingResultSchema).optional(),
});
