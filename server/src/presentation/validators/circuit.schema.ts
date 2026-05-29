import { z } from 'zod';

export const createCircuitSchema = z.object({
  name: z.string().min(1, 'Circuit name is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  lengthKm: z.number().positive('Length must be positive'),
  turns: z.number().int().positive('Number of turns must be positive'),
  drsZones: z.number().int().nonnegative('DRS zones must be non-negative'),
  lapRecord: z.string().optional(),
  lapRecordTime: z.number().positive('Lap record time must be positive').optional(),
  lapRecordDriverId: z.string().uuid('Invalid driver ID').optional(),
  lapRecordYear: z.number().int().optional(),
  capacity: z.number().int().positive('Capacity must be positive').optional(),
  firstGpYear: z.number().int().positive('First GP year is required'),
  circuitMapUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  altitude: z.number().optional(),
  isStreetCircuit: z.boolean().optional(),
});

export const updateCircuitSchema = createCircuitSchema.partial();

export const circuitIdSchema = z.object({
  id: z.string().uuid('Invalid circuit ID'),
});
