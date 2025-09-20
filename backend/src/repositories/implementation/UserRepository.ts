import { Model } from 'mongoose';
import { injectable, inject } from 'tsyringe';
import { BaseRepository } from './BaseRepository';
import { IUserRepository } from '../interface/IUserRepository';
import { IUserDocument } from '@/models';
import { logError } from '@/utils';

@injectable()
export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
  constructor(
    @inject('UserModel') userModel: Model<IUserDocument>,
  ) {
    super(userModel)
  }

  async create(user: Partial<IUserDocument>): Promise<IUserDocument> {
    try {
      const newUser = new this.model(user);
      const savedUser = await newUser.save();
      return savedUser.toObject();
    } catch (error) {
      logError('Failed to create user', { error: error instanceof Error ? error.message : 'Unknown error' });
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error('User with this email already exists');
      }
      throw new Error('Failed to create user');
    }
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    try {
      const user = await this.model.findOne({ email: email.toLowerCase() }).select('-password').exec();
      return user ? user.toObject() : null;
    } catch (error) {
      logError('Failed to find user by email', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        email 
      });
      throw new Error('Failed to find user by email');
    }
  }

  async findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    try {
      const user = await this.model.findOne({ email: email.toLowerCase() }).exec();
      return user ? user.toObject() : null;
    } catch (error) {
      logError('Failed to find user by email with password', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        email 
      });
      throw new Error('Failed to find user by email with password');
    }
  }

  async isExists(email: string): Promise<boolean> {
    try {
      const count = await this.model.countDocuments({ email: email.toLowerCase() }).exec();
      return count > 0;
    } catch (error) {
      logError('Failed to check if user exists by email', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        email 
      });
      throw new Error('Failed to check if user exists by email');
    }
  }
}
