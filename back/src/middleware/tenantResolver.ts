import type { MiddlewareHandler } from 'hono';
import { TenantManager } from '../api/tenant/manager';
import { config } from '../config';
import type { TenantDocument } from '../api/tenant/interface';

declare module 'hono' {
  interface ContextVariableMap {
    tenant: TenantDocument | null;
    isSuperAdminContext: boolean;
  }
}

/**
 * Middleware to resolve tenant from request domain
 */
export const tenantResolver: MiddlewareHandler = async (c, next) => {
  // Get domain from Origin or Host header
  const origin = c.req.header('Origin') || '';
  const host = c.req.header('Host') || '';

  // Extract domain from origin (remove protocol)
  let domain = origin.replace(/^https?:\/\//, '');
  if (!domain) {
    domain = host;
  }

  // Check if this is a super admin domain
  const isSuperAdminDomain = config.superAdmin.domains.some(
    (d) => domain === d || domain.startsWith(d)
  );

  if (isSuperAdminDomain) {
    c.set('tenant', null);
    c.set('isSuperAdminContext', true);
    return next();
  }

  // Try to find tenant by domain
  const tenant = await TenantManager.getByDomain(domain);

  c.set('tenant', tenant);
  c.set('isSuperAdminContext', false);

  return next();
};
