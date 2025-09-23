import type { PaginatedResponse } from "@/types/shared";
import { api } from "@/utils";

export interface CreateUrlRequest {
  url: string;
}

export interface UrlResponse {
  id: string;
  url: string;
  shortCode: string;
  userId: string;
  clicks: number;
  expiresAt?: string;
  isActive: boolean;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UrlQueryParams {
  limit?: number;
  page?: number;
  query?: string;
  sortBy?: "createdAt" | "clicks" | "url" | "shortCode";
  sortOrder?: "asc" | "desc";
}

class UrlService {
  async createUrl(data: CreateUrlRequest): Promise<UrlResponse> {
    const response = await api.post<{ data: UrlResponse }>("/urls/create", data);
    return response.data.data;
  }

async getUserUrls(params: UrlQueryParams = {}): Promise<PaginatedResponse<UrlResponse>> {
  const queryParams = new URLSearchParams();

  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.query) queryParams.append("query", params.query);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

  const response = await api.get<{ data: PaginatedResponse<UrlResponse> }>(
    `/urls/user/urls?${queryParams.toString()}`
  );

  return response.data.data; 
}


  async updateUrl(urlId: string, data: Partial<Omit<UrlResponse, "id">>): Promise<UrlResponse> {
    const response = await api.put<{ data: UrlResponse }>(`/urls/${urlId}`, data);
    return response.data.data;
  }

  async deleteUrl(urlId: string): Promise<boolean> {
    const response = await api.delete<{ data: { deleted: boolean } }>(`/urls/${urlId}`);
    return response.data.data.deleted;
  }

  getShortUrl(shortCode: string): string {
    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    return `${baseUrl}/${shortCode}`;
  }

  async copyToClipboard(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
  }
}

export const urlService = new UrlService();
