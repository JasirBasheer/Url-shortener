import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Landing = () => {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Since there's no public URL creation endpoint, redirect to sign in
    window.location.href = '/auth/sign-in';
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
                  <Button type="submit">
                    Sign In
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 text-center">
                  Sign in to create and manage your short URLs
                </p>
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
              <Link to="/auth/sign-in">
                <Button>Sign In</Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

