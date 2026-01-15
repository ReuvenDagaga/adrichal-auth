import { initTRPC, TRPCError } from '@trpc/server';
import type { UserDocument } from './user/interface';
import type { TenantDocument } from './tenant/interface';

export interface Context {
  user: UserDocument | null;
  tenant: TenantDocument | null;
  isSuperAdminContext: boolean;
}

const t = initTRPC.context<Context>().create();

// Auth middleware - user must be logged in
const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Admin middleware - must be admin or super_admin
const adminMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  if (ctx.user.role !== 'super_admin' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Not an admin' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Tenant admin middleware - admin of current tenant or super_admin
const tenantAdminMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  // Super admin can access any tenant
  if (ctx.user.role === 'super_admin') {
    return next({ ctx: { ...ctx, user: ctx.user } });
  }

  // Must be admin
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Not an admin' });
  }

  // Must have a tenant context
  if (!ctx.tenant) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'No tenant context' });
  }

  // Admin must belong to this tenant
  if (ctx.user.tenantId?.toString() !== ctx.tenant._id.toString()) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized for this tenant' });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Super admin middleware
const superAdminMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  if (ctx.user.role !== 'super_admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Super admin access required' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);
export const adminProcedure = t.procedure.use(adminMiddleware);
export const tenantAdminProcedure = t.procedure.use(tenantAdminMiddleware);
export const superAdminProcedure = t.procedure.use(superAdminMiddleware);
