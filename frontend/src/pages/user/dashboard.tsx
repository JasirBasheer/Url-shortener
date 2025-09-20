import React, { useState } from 'react';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUrlForm, UrlList, UrlAnalytics } from "@/features/url";
import type { UrlResponse } from "@/types";

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const [selectedUrl, setSelectedUrl] = useState<UrlResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'analytics'>('create');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleUrlCreated = (url: UrlResponse) => {
    setSelectedUrl(url);
    setActiveTab('list');
  };

  const handleUrlClick = (url: UrlResponse) => {
    setSelectedUrl(url);
    setActiveTab('analytics');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create URL
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My URLs
            </button>
            {selectedUrl && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'create' && (
            <CreateUrlForm onSuccess={handleUrlCreated} />
          )}

          {activeTab === 'list' && (
            <UrlList onUrlClick={handleUrlClick} />
          )}

          {activeTab === 'analytics' && selectedUrl && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Analytics for: {selectedUrl.title || selectedUrl.url}
                </h2>
                <p className="text-sm text-gray-600">
                  Short URL: {selectedUrl.shortCode}
                </p>
              </div>
              <UrlAnalytics url={selectedUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
