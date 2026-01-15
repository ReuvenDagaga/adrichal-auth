import { router, publicProcedure, superAdminProcedure } from '../trpc';
import { TenantManager } from './manager';
import {
  createTenantSchema,
  updateTenantSchema,
  getTenantByIdSchema,
  deleteTenantSchema,
} from './schema';
import { TRPCError } from '@trpc/server';

export const tenantRouter = router({
  /**
   * Get current tenant context
   */
  getCurrent: publicProcedure.query(async ({ ctx }) => {
    return {
      tenant: ctx.tenant,
      isSuperAdminContext: ctx.isSuperAdminContext,
    };
  }),

  /**
   * List all tenants (super admin only)
   */
  list: superAdminProcedure.query(async () => {
    return TenantManager.list();
  }),

  /**
   * Get tenant by ID (super admin only)
   */
  getById: superAdminProcedure.input(getTenantByIdSchema).query(async ({ input }) => {
    return TenantManager.getById(input.id);
  }),

  /**
   * Create tenant (super admin only)
   */
  create: superAdminProcedure.input(createTenantSchema).mutation(async ({ input }) => {
    // Check slug availability
    const slugAvailable = await TenantManager.isSlugAvailable(input.slug);
    if (!slugAvailable) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Slug already in use' });
    }

    // Check domain availability
    for (const domain of input.domains) {
      const domainAvailable = await TenantManager.isDomainAvailable(domain);
      if (!domainAvailable) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `Domain ${domain} already in use`,
        });
      }
    }

    return TenantManager.create(input);
  }),

  /**
   * Update tenant (super admin only)
   */
  update: superAdminProcedure.input(updateTenantSchema).mutation(async ({ input }) => {
    // Check domain availability if domains are being updated
    if (input.data.domains) {
      for (const domain of input.data.domains) {
        const domainAvailable = await TenantManager.isDomainAvailable(domain, input.id);
        if (!domainAvailable) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: `Domain ${domain} already in use`,
          });
        }
      }
    }

    return TenantManager.update(input.id, input.data);
  }),

  /**
   * Delete tenant (super admin only)
   */
  delete: superAdminProcedure.input(deleteTenantSchema).mutation(async ({ input }) => {
    return TenantManager.delete(input.id);
  }),
});
