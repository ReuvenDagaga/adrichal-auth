import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './router';
import authRoutes from './auth/routes';
import { tenantResolver } from '../middleware/tenantResolver';
import { config } from '../config';
import { getAuthCookie, verifyJWT } from '../utils/auth';
import { UserManager } from './user/manager';
import { logger } from '../utils/logger';
import type { Context } from './trpc';

export function createServer() {
  const app = new Hono();

  // Security headers
  app.use('*', secureHeaders());

  // Dynamic CORS - allow tenant domains and super admin domains
  app.use(
    '*',
    cors({
      origin: (origin) => {
        // Allow no origin (same-origin requests)
        if (!origin) return null;

        // Remove protocol for matching
        const domain = origin.replace(/^https?:\/\//, '');

        // Allow super admin domains
        if (config.superAdmin.domains.some((d) => domain === d || domain.startsWith(d))) {
          return origin;
        }

        // Allow localhost in development
        if (domain.includes('localhost') || domain.includes('127.0.0.1')) {
          return origin;
        }

        // For production, we'd check against tenant domains
        // For now, allow all origins
        return origin;
      },
      credentials: true,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      exposeHeaders: ['Set-Cookie'],
    })
  );

  // Tenant resolver middleware
  app.use('*', tenantResolver);

  // Health check
  app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

  // Auth routes
  app.route('/api/auth', authRoutes);

  // tRPC handler
  app.use(
    '/trpc/*',
    trpcServer({
      router: appRouter,
      createContext: async ({ req }): Promise<Context> => {
        // Get auth token from cookie
        const cookies = req.headers.get('Cookie') || '';
        const match = cookies.match(/auth_token=([^;]+)/);
        const token = match ? match[1] : null;

        let user = null;

        if (token) {
          const payload = await verifyJWT(token);
          if (payload) {
            user = await UserManager.getById(payload.userId);
          }
        }

        // Get tenant and super admin context from Hono context
        // Note: We need to access these from the request somehow
        // For now, we'll re-resolve them
        const origin = req.headers.get('Origin') || '';
        const host = req.headers.get('Host') || '';

        let domain = origin.replace(/^https?:\/\//, '');
        if (!domain) domain = host;

        const isSuperAdminContext = config.superAdmin.domains.some(
          (d) => domain === d || domain.startsWith(d)
        );

        let tenant = null;
        if (!isSuperAdminContext) {
          const { TenantManager } = await import('./tenant/manager');
          tenant = await TenantManager.getByDomain(domain);
        }

        return {
          user,
          tenant,
          isSuperAdminContext,
        };
      },
    })
  );

  // Catch-all for API 404
  app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404));

  // Error handler
  app.onError((err, c) => {
    logger.error({ error: err.message, stack: err.stack }, 'Server error');
    return c.json({ error: 'Internal server error' }, 500);
  });

  return app;
}
