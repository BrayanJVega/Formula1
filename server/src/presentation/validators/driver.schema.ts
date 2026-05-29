import { z } from 'zod';

export const createDriverSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  number: z.number().int().positive('Number must be positive'),
  nationality: z.string().min(1, 'Nationality is required').max(100),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  teamId: z.string().uuid('Invalid team ID'),
  photoUrl: z.string().url('Invalid photo URL').optional(),
  biography: z.string().max(2000).optional(),
});

export const updateDriverSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  number: z.number().int().positive('Number must be positive').optional(),
  nationality: z.string().min(1).max(100).optional(),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
  teamId: z.string().uuid('Invalid team ID').optional(),
  photoUrl: z.string().url('Invalid photo URL').optional(),
  biography: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
});
