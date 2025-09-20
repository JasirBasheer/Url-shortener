import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { urlService } from '../services/urlService';
import type { 
  CreateUrlRequest, 
  UrlResponse, 
  UrlQueryParams, 
  PaginatedResponse,
  UrlAnalytics,
  UrlAnalyticsStats
} from '@/types';

export const useUrls = (params: UrlQueryParams = {}) => {
  return useQuery({
    queryKey: ['urls', params],
    queryFn: () => urlService.getUserUrls(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUrlRequest) => urlService.createUrl(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });
};

export const useUpdateUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ urlId, data }: { urlId: string; data: any }) => 
      urlService.updateUrl(urlId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });
};

export const useDeleteUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (urlId: string) => urlService.deleteUrl(urlId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });
};

export const useBulkDeleteUrls = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (urlIds: string[]) => urlService.bulkDeleteUrls(urlIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });
};

export const useUrlStats = (shortCode: string) => {
  return useQuery({
    queryKey: ['url-stats', shortCode],
    queryFn: () => urlService.getUrlStats(shortCode),
    enabled: !!shortCode,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUrlAnalytics = (shortCode: string, limit?: number, offset?: number) => {
  return useQuery({
    queryKey: ['url-analytics', shortCode, limit, offset],
    queryFn: () => urlService.getUrlAnalytics(shortCode, limit, offset),
    enabled: !!shortCode,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUrlAnalyticsStats = (shortCode: string) => {
  return useQuery({
    queryKey: ['url-analytics-stats', shortCode],
    queryFn: () => urlService.getUrlAnalyticsStats(shortCode),
    enabled: !!shortCode,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTopUrls = (limit: number = 10) => {
  return useQuery({
    queryKey: ['top-urls', limit],
    queryFn: () => urlService.getTopUrls(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

