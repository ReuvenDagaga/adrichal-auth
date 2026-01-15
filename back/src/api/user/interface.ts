import type { Types } from 'mongoose';

export type UserRole = 'super_admin' | 'admin';

export interface User {
  googleId: string;
  email: string;
  name: string;
  picture: string;
  role: UserRole;
  tenantId?: Types.ObjectId;
  externalAuthData?: Record<string, unknown>;
  lastLoginAt: Date;
}

export interface UserDocument extends User {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  role?: UserRole;
  tenantId?: string;
  externalAuthData?: Record<string, unknown>;
}
