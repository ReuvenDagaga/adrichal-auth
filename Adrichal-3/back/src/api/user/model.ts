import mongoose from 'mongoose';
import type { UserDocument } from './interface';

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin'],
      default: 'admin',
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tenants',
      index: true,
    },
    externalAuthData: {
      type: mongoose.Schema.Types.Mixed,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = mongoose.model<UserDocument>('users', UserSchema);
