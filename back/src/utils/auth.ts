import { SignJWT, jwtVerify } from 'jose';
import type { Context } from 'hono';
import { config } from '../config';

export type UserRole = 'super_admin' | 'admin';

export interface InternalJWTPayload {
  userId: string;
  role: UserRole;
  tenantId?: string;
}

const secret = new TextEncoder().encode(config.jwt.secret);
const COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function generateJWT(
  userId: string,
  role: UserRole,
  tenantId?: string
): Promise<string> {
  const payload: InternalJWTPayload = { userId, role };
  if (tenantId) {
    payload.tenantId = tenantId;
  }

  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<InternalJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as InternalJWTPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(c: Context, token: string): void {
  c.header(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${COOKIE_MAX_AGE}`
  );
}

export function clearAuthCookie(c: Context): void {
  c.header(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0`
  );
}

export function getAuthCookie(c: Context): string | null {
  const cookies = c.req.header('Cookie') || '';
  const match = cookies.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

// Decode external JWT without verification (we trust the external service)
export function decodeExternalJWT(token: string): ExternalJWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as ExternalJWTPayload;
  } catch {
    return null;
  }
}

// External JWT structure from your auth microservice
export interface ExternalJWTPayload {
  sub: string; // User ID (googleId)
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
  jti: string;
  email: string;
  name: string;
  picture?: string;
  tokenVersion: number;
  scope?: string;
}
