import { IUrlRepository } from '@/repositories';
import { CreateUrlRequest, PaginatedResponse, UrlResponse } from '@/types';
import { logInfo, logWarn, NotFoundError, ValidationError } from '@/utils';
import { injectable, inject } from 'tsyringe';

@injectable()
export class UrlService {
  constructor(
    @inject('IUrlRepository') private urlRepository: IUrlRepository,
  ) {}

  async createShortUrl(request: CreateUrlRequest): Promise<UrlResponse> {
    logInfo('CreateShortUrl service started', { userId: request.userId });
    
    // Validate URL
    if (!this.isValidUrl(request.url)) {
      throw new ValidationError('Invalid URL format');
    }

    // Generate short code
    const shortCode = request.customShortCode || this.generateShortCode();
    
    // Check if short code already exists
    if (await this.urlRepository.isShortCodeExists(shortCode)) {
      if (request.customShortCode) {
        throw new ValidationError('Custom short code already exists');
      }
      // If auto-generated code exists, generate a new one
      const newShortCode = this.generateShortCode();
      return this.createShortUrl({ ...request, customShortCode: newShortCode });
    }

    const newUrl = await this.urlRepository.create({
      url: request.url,
      shortCode,
      userId: request.userId,
      clicks: 0,
      expiresAt: request.expiresAt,
      isActive: true,
    });

    logInfo('CreateShortUrl completed successfully', { 
      urlId: newUrl._id, 
      shortCode: newUrl.shortCode 
    });

    return {
      id: newUrl._id,
      url: newUrl.url,
      shortCode: newUrl.shortCode,
      userId: newUrl.userId,
      clicks: newUrl.clicks,
      expiresAt: newUrl.expiresAt,
      isActive: newUrl.isActive,
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt,
    };
  }

  async getUrlByShortCode(shortCode: string): Promise<UrlResponse> {
    logInfo('GetUrlByShortCode service started', { shortCode });
    
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) {
      logWarn('GetUrlByShortCode failed - URL not found', { shortCode });
      throw new NotFoundError('URL not found');
    }

    logInfo('GetUrlByShortCode completed successfully', { shortCode });

    return {
      id: url._id,
      url: url.url,
      shortCode: url.shortCode,
      userId: url.userId,
      clicks: url.clicks,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }

  async getUserUrls(userId: string, limit: number = 10, offset: number = 0): Promise<PaginatedResponse<UrlResponse>> {
    logInfo('GetUserUrls service started', { userId, limit, offset });
    
    const [urls, total] = await Promise.all([
      this.urlRepository.findByUserId(userId, limit, offset),
      this.urlRepository.countByUserId(userId)
    ]);
    
    logInfo('GetUserUrls completed successfully', { 
      userId, 
      count: urls.length,
      total 
    });

    return {
      data: urls.map(url => ({
        id: url._id,
        url: url.url,
        shortCode: url.shortCode,
        userId: url.userId,
        clicks: url.clicks,
        title: url.title,
        description: url.description,
        expiresAt: url.expiresAt,
        isActive: url.isActive,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  async redirectToUrl(shortCode: string, analyticsData?: {
    ipAddress: string;
    userAgent: string;
    referrer?: string;
    country?: string;
    city?: string;
  }): Promise<string> {
    logInfo('RedirectToUrl service started', { shortCode });
    
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) {
      logWarn('RedirectToUrl failed - URL not found', { shortCode });
      throw new NotFoundError('URL not found');
    }

    if (!url.isActive) {
      logWarn('RedirectToUrl failed - URL is inactive', { shortCode });
      throw new NotFoundError('URL is inactive', 'URL_INACTIVE');
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      logWarn('RedirectToUrl failed - URL has expired', { shortCode });
      throw new NotFoundError('URL has expired', 'URL_EXPIRED');
    }

    // Track analytics if data is provided
    if (analyticsData) {
      await this.urlRepository.trackClick(shortCode, analyticsData);
    } else {
      // Just increment click count
      await this.urlRepository.incrementClicks(shortCode);
    }

    logInfo('RedirectToUrl completed successfully', { 
      shortCode, 
      originalUrl: url.url 
    });

    return url.url;
  }

  async getUrlStats(shortCode: string): Promise<{ clicks: number }> {
    logInfo('GetUrlStats service started', { shortCode });
    
    const clicks = await this.urlRepository.getClickCount(shortCode);
    
    logInfo('GetUrlStats completed successfully', { shortCode, clicks });

    return { clicks };
  }

  async getTopUrls(limit: number = 10): Promise<UrlResponse[]> {
    logInfo('GetTopUrls service started', { limit });
    
    const urls = await this.urlRepository.getTopUrls(limit);
    
    logInfo('GetTopUrls completed successfully', { count: urls.length });

    return urls.map(url => ({
      id: url._id,
      url: url.url,
      shortCode: url.shortCode,
      userId: url.userId,
      clicks: url.clicks,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    }));
  }

  async deleteUrl(urlId: string, userId: string): Promise<boolean> {
    logInfo('DeleteUrl service started', { urlId, userId });
    
    // First check if the URL exists and belongs to the user
    const url = await this.urlRepository.findById(urlId);
    if (!url) {
      logWarn('DeleteUrl failed - URL not found', { urlId });
      throw new NotFoundError('URL not found');
    }

    if (url.userId !== userId) {
      logWarn('DeleteUrl failed - unauthorized access', { urlId, userId });
      throw new ValidationError('Unauthorized to delete this URL');
    }

    const deleted = await this.urlRepository.delete(urlId);
    
    logInfo('DeleteUrl completed successfully', { urlId, deleted });

    return deleted;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async getUrlAnalytics(shortCode: string, limit?: number, offset?: number): Promise<{
    analytics: any[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    logInfo('GetUrlAnalytics service started', { shortCode, limit, offset });
    
    const [analytics, total] = await Promise.all([
      this.urlRepository.getAnalytics(shortCode, limit, offset),
      this.urlRepository.getAnalytics(shortCode, 0, 0).then(() => 
        this.urlRepository.getAnalytics(shortCode, 0, 0).then(analytics => analytics.length)
      )
    ]);
    
    logInfo('GetUrlAnalytics completed successfully', { 
      shortCode, 
      count: analytics.length 
    });

    return {
      analytics,
      pagination: {
        total,
        limit: limit || 10,
        offset: offset || 0,
        hasMore: (offset || 0) + (limit || 10) < total
      }
    };
  }

  async getUrlAnalyticsStats(shortCode: string): Promise<{
    totalClicks: number;
    uniqueVisitors: number;
    topReferrers: Array<{ referrer: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
    clicksByDay: Array<{ date: string; clicks: number }>;
  }> {
    logInfo('GetUrlAnalyticsStats service started', { shortCode });
    
    const stats = await this.urlRepository.getAnalyticsStats(shortCode);
    
    logInfo('GetUrlAnalyticsStats completed successfully', { shortCode });

    return stats;
  }

  async updateUrl(urlId: string, userId: string, updates: {
    title?: string;
    description?: string;
    isActive?: boolean;
    expiresAt?: Date;
  }): Promise<UrlResponse> {
    logInfo('UpdateUrl service started', { urlId, userId });
    
    // First check if the URL exists and belongs to the user
    const url = await this.urlRepository.findById(urlId);
    if (!url) {
      logWarn('UpdateUrl failed - URL not found', { urlId });
      throw new NotFoundError('URL not found');
    }

    if (url.userId !== userId) {
      logWarn('UpdateUrl failed - unauthorized access', { urlId, userId });
      throw new ValidationError('Unauthorized to update this URL');
    }

    const updatedUrl = await this.urlRepository.update(urlId, updates);
    if (!updatedUrl) {
      throw new NotFoundError('URL not found');
    }
    
    logInfo('UpdateUrl completed successfully', { urlId });

    return {
      id: updatedUrl._id,
      url: updatedUrl.url,
      shortCode: updatedUrl.shortCode,
      userId: updatedUrl.userId,
      clicks: updatedUrl.clicks,
      title: updatedUrl.title,
      description: updatedUrl.description,
      expiresAt: updatedUrl.expiresAt,
      isActive: updatedUrl.isActive,
      createdAt: updatedUrl.createdAt,
      updatedAt: updatedUrl.updatedAt,
    };
  }

  async bulkDeleteUrls(urlIds: string[], userId: string): Promise<{ deleted: number; failed: string[] }> {
    logInfo('BulkDeleteUrls service started', { urlIds, userId });
    
    const results = await Promise.allSettled(
      urlIds.map(urlId => this.deleteUrl(urlId, userId))
    );

    const deleted = results.filter(result => result.status === 'fulfilled' && result.value).length;
    const failed = results
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ index }) => urlIds[index]);

    logInfo('BulkDeleteUrls completed', { deleted, failed: failed.length });

    return { deleted, failed };
  }

  private generateShortCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
