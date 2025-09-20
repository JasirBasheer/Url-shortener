import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { urlService } from '@/features/url/services/urlService';

export const Landing = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError('');

    try {
      // For public use, we'll create a simple short URL without authentication
      // This would need a public endpoint on the backend
      const response = await fetch('/api/urls/create-public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const result = await response.json();
        setShortUrl(result.data.shortCode);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create short URL');
      }
    } catch (err) {
      setError('Failed to create short URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (shortUrl) {
      try {
        const fullShortUrl = urlService.getShortUrl(shortUrl);
        await urlService.copyToClipboard(fullShortUrl);
        // You could add a toast notification here
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Shorten Your URLs
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create short, memorable links and track their performance
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create Short URL</CardTitle>
              <CardDescription>
                Enter a long URL to create a short, shareable link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Shortening...' : 'Shorten'}
                  </Button>
                </div>
                
                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}
                
                {shortUrl && (
                  <div className="mt-4 p-4 bg-green-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Your short URL:</p>
                        <p className="font-mono text-green-800">
                          {urlService.getShortUrl(shortUrl)}
                        </p>
                      </div>
                      <Button onClick={handleCopyUrl} size="sm" variant="outline">
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fast & Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create short URLs in seconds with our simple interface
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track clicks, referrers, and geographic data for your links
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create memorable custom short codes for your URLs
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Want more features?
            </h2>
            <p className="text-gray-600 mb-6">
              Sign up for a free account to manage your URLs, view detailed analytics, and more.
            </p>
            <div className="space-x-4">
              <Link to="/auth/sign-up">
                <Button>Sign Up Free</Button>
              </Link>
              <Link to="/auth/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

