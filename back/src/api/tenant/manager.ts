import mongoose from 'mongoose';
import { TenantModel } from './model';
import type { TenantDocument, CreateTenantData, UpdateTenantData } from './interface';

export class TenantManager {
  /**
   * Get tenant by ID
   */
  static async getById(id: string): Promise<TenantDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return TenantModel.findById(id).lean();
  }

  /**
   * Get tenant by slug
   */
  static async getBySlug(slug: string): Promise<TenantDocument | null> {
    return TenantModel.findOne({ slug }).lean();
  }

  /**
   * Get tenant by domain
   */
  static async getByDomain(domain: string): Promise<TenantDocument | null> {
    // Remove port if present for matching
    const cleanDomain = domain.split(':')[0];
    return TenantModel.findOne({
      domains: { $in: [domain, cleanDomain] },
      isActive: true,
    }).lean();
  }

  /**
   * List all tenants
   */
  static async list(): Promise<TenantDocument[]> {
    return TenantModel.find().sort({ createdAt: -1 }).lean();
  }

  /**
   * List active tenants
   */
  static async listActive(): Promise<TenantDocument[]> {
    return TenantModel.find({ isActive: true }).sort({ name: 1 }).lean();
  }

  /**
   * Create tenant
   */
  static async create(data: CreateTenantData): Promise<TenantDocument> {
    const tenant = new TenantModel({
      name: data.name,
      slug: data.slug,
      domains: data.domains,
      primaryDomain: data.primaryDomain,
      contactEmail: data.contactEmail,
      logoUrl: data.logoUrl || '',
      brandColor: data.brandColor || '#d4af37',
      isActive: true,
      settings: {
        allowedAdminEmails: data.settings?.allowedAdminEmails || [],
      },
    });

    await tenant.save();
    return tenant.toObject();
  }

  /**
   * Update tenant
   */
  static async update(
    id: string,
    data: UpdateTenantData
  ): Promise<TenantDocument | null> {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.domains !== undefined) updateData.domains = data.domains;
    if (data.primaryDomain !== undefined) updateData.primaryDomain = data.primaryDomain;
    if (data.contactEmail !== undefined) updateData.contactEmail = data.contactEmail;
    if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl;
    if (data.brandColor !== undefined) updateData.brandColor = data.brandColor;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.settings !== undefined) {
      if (data.settings.allowedAdminEmails !== undefined) {
        updateData['settings.allowedAdminEmails'] = data.settings.allowedAdminEmails;
      }
    }

    return TenantModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  /**
   * Delete tenant
   */
  static async delete(id: string): Promise<boolean> {
    const result = await TenantModel.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Check if domain is available (not used by another tenant)
   */
  static async isDomainAvailable(
    domain: string,
    excludeTenantId?: string
  ): Promise<boolean> {
    const query: Record<string, unknown> = { domains: domain };
    if (excludeTenantId) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeTenantId) };
    }
    const existing = await TenantModel.findOne(query);
    return !existing;
  }

  /**
   * Check if slug is available
   */
  static async isSlugAvailable(
    slug: string,
    excludeTenantId?: string
  ): Promise<boolean> {
    const query: Record<string, unknown> = { slug };
    if (excludeTenantId) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeTenantId) };
    }
    const existing = await TenantModel.findOne(query);
    return !existing;
  }
}
