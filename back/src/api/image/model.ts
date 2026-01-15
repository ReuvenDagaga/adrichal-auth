import mongoose from 'mongoose';
import type { ImageDocument } from './interface';

const ImageSchema = new mongoose.Schema<ImageDocument>(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tenants',
      index: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      enum: ['projects', 'blog', 'general', 'gallery'],
      required: true,
      index: true,
    },
    altText: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    bytes: {
      type: Number,
    },
    format: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for tenant + folder queries
ImageSchema.index({ tenantId: 1, folder: 1 });

export const ImageModel = mongoose.model<ImageDocument>('images', ImageSchema);
