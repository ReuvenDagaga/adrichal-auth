import { Hono } from 'hono';
import { UserManager } from '../user/manager';
import { TenantManager } from '../tenant/manager';
import {
  generateJWT,
  setAuthCookie,
  clearAuthCookie,
  getAuthCookie,
  verifyJWT,
  decodeExternalJWT,
} from '../../utils/auth';
import { config } from '../../config';
import { logger } from '../../utils/logger';

const auth = new Hono();

/**
 * Initiate Google auth - redirect to external microservice
 */
auth.get('/google', async (c) => {
  const tenantDomain = c.req.query('tenant_domain') || '';
  const tenant = c.get('tenant');
  const domain = tenantDomain || tenant?.primaryDomain || '';

  // Build our callback URL
  const callbackUrl = encodeURIComponent(
    `${config.backendUrl}/api/auth/callback?tenant_domain=${domain}`
  );

  // Redirect to external auth microservice
  const authUrl = `${config.authMicroservice.url}/auth/google?callback=${callbackUrl}`;

  logger.info({ authUrl, tenantDomain: domain }, 'Redirecting to external auth');

  return c.redirect(authUrl);
});

/**
 * Callback from external microservice
 */
auth.get('/callback', async (c) => {
  const externalToken = c.req.query('token');
  const tenantDomain = c.req.query('tenant_domain') || '';

  // Determine redirect base URL
  const redirectBase = tenantDomain
    ? `https://${tenantDomain}`
    : config.frontendUrl;

  if (!externalToken) {
    logger.warn('No token received from external auth');
    return c.redirect(`${redirectBase}/admin/login?error=no_token`);
  }

  try {
    // Decode the JWT from external service
    const payload = decodeExternalJWT(externalToken);

    if (!payload) {
      logger.warn('Failed to decode external JWT');
      return c.redirect(`${redirectBase}/admin/login?error=invalid_token`);
    }

    // Check if token is expired
    if (payload.exp * 1000 < Date.now()) {
      logger.warn('External token expired');
      return c.redirect(`${redirectBase}/admin/login?error=token_expired`);
    }

    logger.info({ email: payload.email, sub: payload.sub }, 'Processing auth callback');

    // Get tenant by domain
    const tenant = tenantDomain ? await TenantManager.getByDomain(tenantDomain) : null;

    // Check if user is allowed for this tenant
    if (tenant && tenant.settings.allowedAdminEmails.length > 0) {
      if (!tenant.settings.allowedAdminEmails.includes(payload.email)) {
        logger.warn(
          { email: payload.email, tenant: tenant.slug },
          'Email not in allowed list'
        );
        return c.redirect(`${redirectBase}/admin/unauthorized`);
      }
    }

    // Find or create user
    const user = await UserManager.findOrCreate(
      {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        externalAuthData: payload,
      },
      tenant?._id.toString()
    );

    logger.info({ userId: user._id, role: user.role }, 'User authenticated');

    // Generate internal JWT
    const jwt = await generateJWT(
      user._id.toString(),
      user.role,
      user.tenantId?.toString()
    );

    // Set HTTP-only cookie
    setAuthCookie(c, jwt);

    // Redirect based on role
    if (user.role === 'super_admin' || user.role === 'admin') {
      return c.redirect(`${redirectBase}/admin`);
    }

    return c.redirect(`${redirectBase}/admin/unauthorized`);
  } catch (error) {
    logger.error({ error }, 'Auth callback error');
    return c.redirect(`${redirectBase}/admin/login?error=auth_error`);
  }
});

/**
 * Get current authenticated user
 */
auth.get('/me', async (c) => {
  const token = getAuthCookie(c);

  if (!token) {
    return c.json({ user: null });
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    return c.json({ user: null });
  }

  const user = await UserManager.getById(payload.userId);

  return c.json({ user });
});

/**
 * Logout - clear auth cookie
 */
auth.post('/logout', (c) => {
  clearAuthCookie(c);
  return c.json({ success: true });
});

/**
 * Check auth status
 */
auth.get('/status', async (c) => {
  const token = getAuthCookie(c);

  if (!token) {
    return c.json({ authenticated: false });
  }

  const payload = await verifyJWT(token);

  return c.json({
    authenticated: !!payload,
    role: payload?.role,
  });
});

export default auth;
