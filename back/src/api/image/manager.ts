import mongoose from 'mongoose';
import { ImageModel } from './model';
import type {
  ImageDocument,
  CreateImageData,
  UpdateImageData,
  ListImagesOptions,
} from './interface';

export class ImageManager {
  /**
   * Get image by ID
   */
  static async getById(id: string): Promise<ImageDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return ImageModel.findById(id).lean();
  }

  /**
   * Get image by public ID
   */
  static async getByPublicId(publicId: string): Promise<ImageDocument | null> {
    return ImageModel.findOne({ publicId }).lean();
  }

  /**
   * Get image by URL
   */
  static async getByUrl(url: string): Promise<ImageDocument | null> {
    return ImageModel.findOne({ url }).lean();
  }

  /**
   * Create image metadata
   */
  static async create(data: CreateImageData): Promise<ImageDocument> {
    const image = new ImageModel({
      tenantId: data.tenantId,
      publicId: data.publicId,
      url: data.url,
      folder: data.folder,
      altText: data.altText || '',
      tags: data.tags || [],
      width: data.width,
      height: data.height,
      bytes: data.bytes,
      format: data.format,
    });

    await image.save();
    return image.toObject();
  }

  /**
   * List images with filters and pagination
   */
  static async list(
    options: ListImagesOptions
  ): Promise<{ items: ImageDocument[]; total: number }> {
    const { tenantId, folder, tags, page = 1, limit = 50 } = options;

    const query: Record<string, unknown> = {};
    if (tenantId) query.tenantId = tenantId;
    if (folder) query.folder = folder;
    if (tags && tags.length > 0) query.tags = { $all: tags };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ImageModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ImageModel.countDocuments(query),
    ]);

    return { items, total };
  }

  /**
   * Update image metadata
   */
  static async update(
    id: string,
    data: UpdateImageData
  ): Promise<ImageDocument | null> {
    const updateData: Record<string, unknown> = {};
    if (data.altText !== undefined) updateData.altText = data.altText;
    if (data.tags !== undefined) updateData.tags = data.tags;

    return ImageModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  /**
   * Delete image by ID
   */
  static async delete(id: string): Promise<boolean> {
    const result = await ImageModel.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Delete image by public ID
   */
  static async deleteByPublicId(publicId: string): Promise<boolean> {
    const result = await ImageModel.findOneAndDelete({ publicId });
    return !!result;
  }

  /**
   * Count images by tenant
   */
  static async countByTenant(tenantId: mongoose.Types.ObjectId): Promise<number> {
    return ImageModel.countDocuments({ tenantId });
  }

  /**
   * Get total bytes by tenant
   */
  static async getTotalBytesByTenant(
    tenantId: mongoose.Types.ObjectId
  ): Promise<number> {
    const result = await ImageModel.aggregate([
      { $match: { tenantId } },
      { $group: { _id: null, totalBytes: { $sum: '$bytes' } } },
    ]);
    return result[0]?.totalBytes || 0;
  }
}
