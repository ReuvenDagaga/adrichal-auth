import type { Types } from 'mongoose';

export interface TenantSettings {
  allowedAdminEmails: string[];
}

export interface Tenant {
  name: string;
  slug: string;
  domains: string[];
  primaryDomain: string;
  logoUrl: string;
  brandColor: string;
  contactEmail: string;
  isActive: boolean;
  settings: TenantSettings;
}

export interface TenantDocument extends Tenant {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantData {
  name: string;
  slug: string;
  domains: string[];
  primaryDomain: string;
  contactEmail: string;
  logoUrl?: string;
  brandColor?: string;
  settings?: Partial<TenantSettings>;
}

export interface UpdateTenantData {
  name?: string;
  domains?: string[];
  primaryDomain?: string;
  contactEmail?: string;
  logoUrl?: string;
  brandColor?: string;
  isActive?: boolean;
  settings?: Partial<TenantSettings>;
}
