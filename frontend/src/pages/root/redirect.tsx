import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { httpClient } from '@/features/auth/services/httpClient';

const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const redirectToUrl = async () => {
      if (!shortCode) {
        setError('Invalid short code');
        setStatus('error');
        return;
      }

      try {
        setStatus('redirecting');
        
        // Make a request to get the original URL
        const response = await httpClient.get(`/urls/${shortCode}`, { skipAuth: true });
        
        if (response.ok) {
          // If successful, redirect to the original URL
          const result = await response.json();
          window.location.href = result.data.url;
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'URL not found');
          setStatus('error');
        }
      } catch (err) {
        setError('Failed to redirect. Please try again.');
        setStatus('error');
      }
    };

    redirectToUrl();
  }, [shortCode]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'redirecting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting you to the destination...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectPage;
