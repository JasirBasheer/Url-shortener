import React, { useState } from 'react';
import { useUrls, useDeleteUrl, useBulkDeleteUrls } from '../hooks/useUrls';
import { urlService } from '../services/urlService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UrlResponse } from '@/types';

interface UrlListProps {
  onUrlClick?: (url: UrlResponse) => void;
}

export const UrlList: React.FC<UrlListProps> = ({ onUrlClick }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'clicks' | 'url' | 'shortCode'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 10;

  const { data: urlsData, isLoading, error } = useUrls({
    limit,
    offset: currentPage * limit,
    search: search || undefined,
    sortBy,
    sortOrder,
  });

  const deleteUrlMutation = useDeleteUrl();
  const bulkDeleteMutation = useBulkDeleteUrls();

  const handleDeleteUrl = async (urlId: string) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        await deleteUrlMutation.mutateAsync(urlId);
      } catch (error) {
        console.error('Failed to delete URL:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUrls.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedUrls.length} URLs?`)) {
      try {
        await bulkDeleteMutation.mutateAsync(selectedUrls);
        setSelectedUrls([]);
      } catch (error) {
        console.error('Failed to delete URLs:', error);
      }
    }
  };

  const handleCopyUrl = async (shortCode: string) => {
    try {
      const shortUrl = urlService.getShortUrl(shortCode);
      await urlService.copyToClipboard(shortUrl);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleSelectUrl = (urlId: string) => {
    setSelectedUrls(prev => 
      prev.includes(urlId) 
        ? prev.filter(id => id !== urlId)
        : [...prev, urlId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUrls.length === urlsData?.data.length) {
      setSelectedUrls([]);
    } else {
      setSelectedUrls(urlsData?.data.map(url => url.id) || []);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-600">
            Failed to load URLs: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your URLs</CardTitle>
        <CardDescription>
          Manage your shortened URLs and view their performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search URLs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="createdAt">Date Created</option>
              <option value="clicks">Clicks</option>
              <option value="url">URL</option>
              <option value="shortCode">Short Code</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUrls.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedUrls.length} URL(s) selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
              >
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        {/* URL List */}
        <div className="space-y-4">
          {urlsData?.data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No URLs found. Create your first short URL above!
            </div>
          ) : (
            urlsData?.data.map((url) => (
              <div
                key={url.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedUrls.includes(url.id)}
                      onChange={() => handleSelectUrl(url.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {url.title || url.url}
                        </h3>
                        {!url.isActive && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                            Inactive
                          </span>
                        )}
                        {url.expiresAt && new Date(url.expiresAt) < new Date() && (
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                            Expired
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <div className="truncate">
                          <strong>Original:</strong> {url.url}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span>
                            <strong>Short:</strong> {urlService.getShortUrl(url.shortCode)}
                          </span>
                          <span>
                            <strong>Clicks:</strong> {url.clicks}
                          </span>
                        </div>
                        {url.description && (
                          <div className="mt-1 text-gray-500">
                            {url.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyUrl(url.shortCode)}
                    >
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUrlClick?.(url)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteUrl(url.id)}
                      disabled={deleteUrlMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {urlsData && urlsData.pagination.total > limit && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {currentPage * limit + 1} to{' '}
              {Math.min((currentPage + 1) * limit, urlsData.pagination.total)} of{' '}
              {urlsData.pagination.total} URLs
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!urlsData.pagination.hasMore}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

