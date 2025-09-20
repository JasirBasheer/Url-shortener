import React from 'react';
import { useUrlAnalyticsStats, useUrlAnalytics } from '../hooks/useUrls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UrlResponse } from '@/types';

interface UrlAnalyticsProps {
  url: UrlResponse;
}

export const UrlAnalytics: React.FC<UrlAnalyticsProps> = ({ url }) => {
  const { data: stats, isLoading: statsLoading } = useUrlAnalyticsStats(url.shortCode);
  const { data: analytics, isLoading: analyticsLoading } = useUrlAnalytics(url.shortCode, 10, 0);

  if (statsLoading || analyticsLoading) {
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

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClicks || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.uniqueVisitors || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalClicks && stats?.uniqueVisitors 
                ? (stats.totalClicks / stats.uniqueVisitors).toFixed(1)
                : '0.0'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Referrers */}
      {stats?.topReferrers && stats.topReferrers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Where your clicks are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topReferrers.slice(0, 5).map((referrer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">
                    {referrer.referrer || 'Direct'}
                  </span>
                  <span className="text-sm font-medium">{referrer.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Countries */}
      {stats?.topCountries && stats.topCountries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Geographic distribution of your clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topCountries.slice(0, 5).map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{country.country}</span>
                  <span className="text-sm font-medium">{country.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Clicks */}
      {analytics?.analytics && analytics.analytics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Clicks</CardTitle>
            <CardDescription>Latest activity on your URL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.analytics.slice(0, 5).map((click, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {click.country || 'Unknown'}
                      </span>
                      {click.city && (
                        <span className="text-gray-500">({click.city})</span>
                      )}
                    </div>
                    <div className="text-gray-500 truncate">
                      {click.userAgent}
                    </div>
                  </div>
                  <div className="text-gray-500">
                    {new Date(click.clickedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* URL Details */}
      <Card>
        <CardHeader>
          <CardTitle>URL Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Short Code:</span>
              <span className="font-mono">{url.shortCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span>{new Date(url.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={url.isActive ? 'text-green-600' : 'text-red-600'}>
                {url.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {url.expiresAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span>{new Date(url.expiresAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
