import { IUrl, IUrlDocument } from '@/models';
import { Model } from 'mongoose';
import { injectable, inject } from 'tsyringe';
import { IUrlRepository } from '../interface/IUrlRepository';
import { BaseRepository } from './BaseRepository';
import { logError, logInfo } from '@/utils';

@injectable()
export class UrlRepository extends BaseRepository<IUrl> implements IUrlRepository {

  constructor(
    @inject('UrlModel') urlModel: Model<IUrlDocument>,
  ) {
    super(urlModel);
  }

  async create(url: Partial<IUrl>): Promise<IUrl> {
    try {
      const newUrl = new this.model(url);
      const savedUrl = await newUrl.save();
      return savedUrl
    } catch (error) {
      logError('Failed to create URL', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        shortCode: url.shortCode 
      });
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error('Short code already exists');
      }
      throw new Error('Failed to create URL');
    }
  }

  async findByShortCode(shortCode: string): Promise<IUrl | null> {
    try {
      return await this.model.findOne({ shortCode }).exec();
    } catch (error) {
      logError('Failed to find URL by short code', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        shortCode 
      });
      throw new Error('Failed to find URL by short code');
    }
  }

  async findByUserId(userId: string,search: string, limit?: number, offset?: number): Promise<IUrl[]> {
    try {
  const filters: Record<string, any> = {};
  
  if (search) {
    filters.$or = [
      { url: { $regex: search, $options: 'i' } },
      { shortCode: { $regex: search, $options: 'i' } }
    ];
  }

  return this.findAll(filters, limit, offset, { createdAt: -1 });

    } catch (error) {
      logError('Failed to find URLs by user ID', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        userId 
      });
      throw new Error('Failed to find URLs by user ID');
    }
  }

  async isShortCodeExists(shortCode: string): Promise<boolean> {
    try {
      const count = await this.model.countDocuments({ shortCode }).exec();
      return count > 0;
    } catch (error) {
      logError('Failed to check if short code exists', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        shortCode 
      });
      throw new Error('Failed to check if short code exists');
    }
  }

  async incrementClicks(shortCode: string): Promise<void> {
    try {
      await this.model.findOneAndUpdate(
        { shortCode },
        { $inc: { clicks: 1 } },
        { new: true }
      ).exec();
      logInfo('URL clicks incremented', { shortCode });
    } catch (error) {
      logError('Failed to increment URL clicks', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        shortCode 
      });
      throw new Error('Failed to increment URL clicks');
    }
  }
  

}
