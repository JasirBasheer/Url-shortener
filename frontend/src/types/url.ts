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

