import {
  router,
  publicProcedure,
  superAdminProcedure,
  tenantAdminProcedure,
} from '../trpc';
import { UserManager } from './manager';
import { updateRoleSchema, deleteUserSchema, listByTenantSchema } from './schema';

export const userRouter = router({
  /**
   * Get current authenticated user
   */
  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  /**
   * List all users (super admin only)
   */
  list: superAdminProcedure.query(async () => {
    return UserManager.list();
  }),

  /**
   * List users by tenant
   */
  listByTenant: tenantAdminProcedure
    .input(listByTenantSchema)
    .query(async ({ input, ctx }) => {
      const tenantId = input.tenantId || ctx.tenant?._id.toString();
      if (!tenantId) return [];
      return UserManager.listByTenant(tenantId);
    }),

  /**
   * Update user role (super admin only)
   */
  updateRole: superAdminProcedure
    .input(updateRoleSchema)
    .mutation(async ({ input }) => {
      return UserManager.updateRole(input.userId, input.role);
    }),

  /**
   * Delete user (super admin only)
   */
  delete: superAdminProcedure.input(deleteUserSchema).mutation(async ({ input }) => {
    return UserManager.delete(input.userId);
  }),
});
