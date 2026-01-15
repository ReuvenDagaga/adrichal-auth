import { z } from 'zod';

export const tenantSettingsSchema = z.object({
  allowedAdminEmails: z.array(z.string().email()).optional(),
});

export const createTenantSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  domains: z.array(z.string().min(1)),
  primaryDomain: z.string().min(1),
  contactEmail: z.string().email(),
  logoUrl: z.string().optional(),
  brandColor: z.string().optional(),
  settings: tenantSettingsSchema.optional(),
});

export const updateTenantSchema = z.object({
  id: z.string().min(1),
  data: z.object({
    name: z.string().min(1).optional(),
    domains: z.array(z.string().min(1)).optional(),
    primaryDomain: z.string().min(1).optional(),
    contactEmail: z.string().email().optional(),
    logoUrl: z.string().optional(),
    brandColor: z.string().optional(),
    isActive: z.boolean().optional(),
    settings: tenantSettingsSchema.optional(),
  }),
});

export const getTenantByIdSchema = z.object({
  id: z.string().min(1),
});

export const deleteTenantSchema = z.object({
  id: z.string().min(1),
});
