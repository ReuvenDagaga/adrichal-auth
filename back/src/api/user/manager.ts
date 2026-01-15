import mongoose from 'mongoose';
import { UserModel } from './model';
import type { UserDocument, UserRole, CreateUserData } from './interface';
import { config } from '../../config';

export class UserManager {
  /**
   * Find user by ID
   */
  static async getById(id: string): Promise<UserDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return UserModel.findById(id).lean();
  }

  /**
   * Find user by Google ID
   */
  static async getByGoogleId(googleId: string): Promise<UserDocument | null> {
    return UserModel.findOne({ googleId }).lean();
  }

  /**
   * Find user by email
   */
  static async getByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).lean();
  }

  /**
   * Find or create user from external auth data
   */
  static async findOrCreate(
    data: CreateUserData,
    tenantId?: string
  ): Promise<UserDocument> {
    let user = await UserModel.findOne({ googleId: data.googleId });

    if (user) {
      // Update last login and external auth data
      user.lastLoginAt = new Date();
      if (data.externalAuthData) {
        user.externalAuthData = data.externalAuthData;
      }
      await user.save();
      return user.toObject();
    }

    // Determine role for new user
    let role: UserRole = 'admin';
    if (config.superAdmin.emails.includes(data.email)) {
      role = 'super_admin';
    }

    // Create new user
    user = new UserModel({
      googleId: data.googleId,
      email: data.email,
      name: data.name,
      picture: data.picture || '',
      role: data.role || role,
      tenantId: tenantId ? new mongoose.Types.ObjectId(tenantId) : undefined,
      externalAuthData: data.externalAuthData,
      lastLoginAt: new Date(),
    });

    await user.save();
    return user.toObject();
  }

  /**
   * List all users (super admin only)
   */
  static async list(): Promise<UserDocument[]> {
    return UserModel.find().sort({ createdAt: -1 }).lean();
  }

  /**
   * List users by tenant
   */
  static async listByTenant(tenantId: string): Promise<UserDocument[]> {
    return UserModel.find({
      tenantId: new mongoose.Types.ObjectId(tenantId),
    })
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * Update user role
   */
  static async updateRole(userId: string, role: UserRole): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(userId, { role }, { new: true }).lean();
  }

  /**
   * Delete user
   */
  static async delete(userId: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(userId);
    return !!result;
  }

  /**
   * Assign user to tenant
   */
  static async assignToTenant(
    userId: string,
    tenantId: string
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { tenantId: new mongoose.Types.ObjectId(tenantId) },
      { new: true }
    ).lean();
  }
}
