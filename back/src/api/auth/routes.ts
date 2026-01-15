import { Hono } from 'hono';
import { UserManager } from '../user/manager';
import { TenantManager } from '../tenant/manager';
import {
  generateJWT,
  setAuthCookie,
  clearAuthCookie,
  getAuthCookie,
  verifyJWT,
  verifyExternalJWT,
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

  // Build our callback URL (this is where auth-server will redirect back to)
  const redirectUri = `${config.backendUrl}/api/auth/callback`;

  // Build auth URL with required parameters
  const authUrl = new URL(`${config.authMicroservice.url}/auth/google`);
  authUrl.searchParams.set('client_id', config.authMicroservice.clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', domain); // Pass tenant domain in state

  logger.info({ authUrl: authUrl.toString(), tenantDomain: domain }, 'Redirecting to external auth');

  return c.redirect(authUrl.toString());
});

/**
 * Callback from external microservice
 */
auth.get('/callback', async (c) => {
  const authCode = c.req.query('code');
  // auth-server returns state parameter, fallback to tenant_domain for backwards compatibility
  const tenantDomain = c.req.query('state') || c.req.query('tenant_domain') || '';

  // Determine redirect base URL - use frontendUrl for local dev, tenant domain for production
  const redirectBase = config.frontendUrl;

  logger.info({ tenantDomain, redirectBase, frontendUrl: config.frontendUrl }, 'Callback redirect info');

  if (!authCode) {
    logger.warn('No auth code received from external auth');
    return c.redirect(`${redirectBase}/admin/login?error=no_code`);
  }

  try {
    // Exchange auth code for tokens
    const tokenResponse = await fetch(`${config.authMicroservice.url}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: `${config.backendUrl}/api/auth/callback`,
        client_id: config.authMicroservice.clientId,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      logger.error({ error: errorData }, 'Token exchange failed');
      return c.redirect(`${redirectBase}/admin/login?error=token_exchange_failed`);
    }

    const tokens = await tokenResponse.json() as { access_token: string; id_token?: string };
    const externalToken = tokens.id_token || tokens.access_token;

    // Verify the JWT from external service using JWKS
    const payload = await verifyExternalJWT(externalToken);

    if (!payload) {
      logger.warn('Failed to verify external JWT');
      return c.redirect(`${redirectBase}/admin/login?error=invalid_token`);
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
        externalAuthData: payload as unknown as Record<string, unknown>,
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
