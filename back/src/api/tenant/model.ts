import mongoose from 'mongoose';
import type { TenantDocument } from './interface';

const TenantSchema = new mongoose.Schema<TenantDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    domains: {
      type: [String],
      required: true,
      index: true,
    },
    primaryDomain: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    brandColor: {
      type: String,
      default: '#d4af37',
    },
    contactEmail: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      allowedAdminEmails: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TenantModel = mongoose.model<TenantDocument>('tenants', TenantSchema);
