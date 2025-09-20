
export interface CreateUrlRequest {
  url: string;
  userId: string;
  customShortCode?: string;
  title?: string;
  description?: string;
  expiresAt?: Date;
}

export interface UrlResponse {
  id: string;
  url: string;
  shortCode: string;
  userId: string;
  clicks: number;
  title?: string;
  description?: string;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
