import { router, tenantAdminProcedure } from '../trpc';
import { ImageManager } from './manager';
import {
  listImagesSchema,
  updateImageSchema,
  getImageByUrlSchema,
  deleteImageSchema,
} from './schema';

export const imageRouter = router({
  /**
   * List images with filters and pagination
   */
  list: tenantAdminProcedure.input(listImagesSchema).query(async ({ input, ctx }) => {
    return ImageManager.list({
      tenantId: ctx.tenant?._id,
      folder: input.folder,
      tags: input.tags,
      page: input.page,
      limit: input.limit,
    });
  }),

  /**
   * Update image metadata (alt text, tags)
   */
  update: tenantAdminProcedure.input(updateImageSchema).mutation(async ({ input }) => {
    return ImageManager.update(input.id, {
      altText: input.altText,
      tags: input.tags,
    });
  }),

  /**
   * Get image by URL
   */
  getByUrl: tenantAdminProcedure.input(getImageByUrlSchema).query(async ({ input }) => {
    return ImageManager.getByUrl(input.url);
  }),

  /**
   * Delete image (metadata only - use upload.deleteImage to delete from Cloudinary too)
   */
  delete: tenantAdminProcedure.input(deleteImageSchema).mutation(async ({ input }) => {
    return ImageManager.delete(input.id);
  }),

  /**
   * Get storage stats for current tenant
   */
  stats: tenantAdminProcedure.query(async ({ ctx }) => {
    if (!ctx.tenant) {
      return { count: 0, totalBytes: 0 };
    }

    const [count, totalBytes] = await Promise.all([
      ImageManager.countByTenant(ctx.tenant._id),
      ImageManager.getTotalBytesByTenant(ctx.tenant._id),
    ]);

    return { count, totalBytes };
  }),
});
