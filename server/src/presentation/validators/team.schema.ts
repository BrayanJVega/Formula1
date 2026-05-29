import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100),
  fullName: z.string().min(1, 'Full team name is required').max(255),
  nationality: z.string().min(1, 'Nationality is required').max(100),
  base: z.string().min(1, 'Base location is required').max(255),
  teamPrincipal: z.string().min(1, 'Team principal is required').max(255),
  chassis: z.string().min(1, 'Chassis is required').max(255),
  powerUnit: z.string().min(1, 'Power unit is required').max(255),
  foundedYear: z
    .number()
    .int('Founded year must be an integer')
    .min(1900, 'Founded year must be 1900 or later')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future'),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  photoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  biography: z.string().optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100).optional(),
  fullName: z.string().min(1, 'Full team name is required').max(255).optional(),
  nationality: z.string().min(1, 'Nationality is required').max(100).optional(),
  base: z.string().min(1, 'Base location is required').max(255).optional(),
  teamPrincipal: z.string().min(1, 'Team principal is required').max(255).optional(),
  chassis: z.string().min(1, 'Chassis is required').max(255).optional(),
  powerUnit: z.string().min(1, 'Power unit is required').max(255).optional(),
  foundedYear: z
    .number()
    .int('Founded year must be an integer')
    .min(1900, 'Founded year must be 1900 or later')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future')
    .optional(),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  photoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  biography: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateTeamDto = z.infer<typeof createTeamSchema>;
export type UpdateTeamDto = z.infer<typeof updateTeamSchema>;
