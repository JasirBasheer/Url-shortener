import { QueryDto } from "@/dto";
import { CreateUrlRequest, PaginatedResponse, UrlResponse } from "@/types";

export interface IUrlService {
  createShortUrl(request: CreateUrlRequest): Promise<UrlResponse>;
  getUrlByShortCode(shortCode: string): Promise<UrlResponse>;
  getUserUrls(userId: string,query: QueryDto): Promise<PaginatedResponse<UrlResponse>>;
  redirectToUrl(shortCode: string): Promise<string>;
  deleteUrl(urlId: string, userId: string): Promise<boolean>;
  updateUrl(urlId: string, userId: string, updates: {
    title?: string;
    description?: string;
    isActive?: boolean;
    expiresAt?: Date;
  }): Promise<UrlResponse>;
}
