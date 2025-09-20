import { UrlService, CreateUrlRequest, UrlResponse, PaginatedResponse } from '../services/UrlService';

export interface IUrlService {
  createShortUrl(request: CreateUrlRequest): Promise<UrlResponse>;
  getUrlByShortCode(shortCode: string): Promise<UrlResponse>;
  getUserUrls(userId: string, limit?: number, offset?: number): Promise<PaginatedResponse<UrlResponse>>;
  redirectToUrl(shortCode: string, analyticsData?: {
    ipAddress: string;
    userAgent: string;
    referrer?: string;
    country?: string;
    city?: string;
  }): Promise<string>;
  getUrlStats(shortCode: string): Promise<{ clicks: number }>;
  getTopUrls(limit?: number): Promise<UrlResponse[]>;
  deleteUrl(urlId: string, userId: string): Promise<boolean>;
  getUrlAnalytics(shortCode: string, limit?: number, offset?: number): Promise<{
    analytics: any[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }>;
  getUrlAnalyticsStats(shortCode: string): Promise<{
    totalClicks: number;
    uniqueVisitors: number;
    topReferrers: Array<{ referrer: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
    clicksByDay: Array<{ date: string; clicks: number }>;
  }>;
  updateUrl(urlId: string, userId: string, updates: {
    title?: string;
    description?: string;
    isActive?: boolean;
    expiresAt?: Date;
  }): Promise<UrlResponse>;
  bulkDeleteUrls(urlIds: string[], userId: string): Promise<{ deleted: number; failed: string[] }>;
}
