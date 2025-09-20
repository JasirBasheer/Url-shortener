import { httpClient } from '@/features/auth/services/httpClient';

export interface CreateUrlRequest {
  url: string;
  customShortCode?: string;
  title?: string;
  description?: string;
  expiresAt?: string;
}

export interface UrlResponse {
  id: string;
  url: string;
  shortCode: string;
  userId: string;
  clicks: number;
  title?: string;
  description?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface UrlAnalytics {
  id: string;
  urlId: string;
  shortCode: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  country?: string;
  city?: string;
  clickedAt: string;
}

export interface UrlAnalyticsStats {
  totalClicks: number;
  uniqueVisitors: number;
  topReferrers: Array<{ referrer: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  clicksByDay: Array<{ date: string; clicks: number }>;
}

export interface UrlQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: 'createdAt' | 'clicks' | 'url' | 'shortCode';
  sortOrder?: 'asc' | 'desc';
}

class UrlService {
  async createUrl(data: CreateUrlRequest): Promise<UrlResponse> {
    const response = await httpClient.post('/urls/create', data);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create URL');
    }

    const result = await response.json();
    return result.data;
  }

  async getUserUrls(params: UrlQueryParams = {}): Promise<PaginatedResponse<UrlResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await httpClient.get(`/urls/user/urls?${queryParams.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get URLs');
    }

    const result = await response.json();
    return result.data;
  }

  async updateUrl(urlId: string, data: {
    title?: string;
    description?: string;
    isActive?: boolean;
    expiresAt?: string;
  }): Promise<UrlResponse> {
    const response = await httpClient.put(`/urls/${urlId}`, data);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update URL');
    }

    const result = await response.json();
    return result.data;
  }

  async deleteUrl(urlId: string): Promise<boolean> {
    const response = await httpClient.delete(`/urls/${urlId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete URL');
    }

    const result = await response.json();
    return result.data.deleted;
  }

  async bulkDeleteUrls(urlIds: string[]): Promise<{ deleted: number; failed: string[] }> {
    const response = await httpClient.post('/urls/bulk-delete', { urlIds });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete URLs');
    }

    const result = await response.json();
    return result.data;
  }

  async getUrlStats(shortCode: string): Promise<{ clicks: number }> {
    const response = await httpClient.get(`/urls/stats/${shortCode}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get URL stats');
    }

    const result = await response.json();
    return result.data;
  }

  async getUrlAnalytics(shortCode: string, limit?: number, offset?: number): Promise<{
    analytics: UrlAnalytics[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    if (offset) queryParams.append('offset', offset.toString());

    const response = await httpClient.get(`/urls/analytics/${shortCode}?${queryParams.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get URL analytics');
    }

    const result = await response.json();
    return result.data;
  }

  async getUrlAnalyticsStats(shortCode: string): Promise<UrlAnalyticsStats> {
    const response = await httpClient.get(`/urls/analytics/${shortCode}/stats`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get URL analytics stats');
    }

    const result = await response.json();
    return result.data;
  }

  async getTopUrls(limit: number = 10): Promise<UrlResponse[]> {
    const response = await httpClient.get(`/urls/top?limit=${limit}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get top URLs');
    }

    const result = await response.json();
    return result.data;
  }

  getShortUrl(shortCode: string): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    return `${baseUrl.replace('/api', '')}/${shortCode}`;
  }

  copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((resolve, reject) => {
        if (document.execCommand('copy')) {
          resolve();
        } else {
          reject(new Error('Failed to copy to clipboard'));
        }
        document.body.removeChild(textArea);
      });
    }
  }
}

export const urlService = new UrlService();

