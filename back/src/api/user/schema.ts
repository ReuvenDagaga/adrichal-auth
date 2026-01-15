import { z } from 'zod';

export const userRoleSchema = z.enum(['super_admin', 'admin']);

export const createUserSchema = z.object({
  googleId: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  picture: z.string().optional(),
  role: userRoleSchema.optional(),
  tenantId: z.string().optional(),
  externalAuthData: z.record(z.unknown()).optional(),
});

export const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: userRoleSchema,
});

export const deleteUserSchema = z.object({
  userId: z.string().min(1),
});

export const listByTenantSchema = z.object({
  tenantId: z.string().optional(),
});
