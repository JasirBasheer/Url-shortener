import React, { useState } from 'react';
import { useCreateUrl } from '../hooks/useUrls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateUrlFormProps {
  onSuccess?: (url: any) => void;
}

export const CreateUrlForm: React.FC<CreateUrlFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    url: '',
    customShortCode: '',
    title: '',
    description: '',
    expiresAt: '',
  });

  const createUrlMutation = useCreateUrl();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await createUrlMutation.mutateAsync({
        url: formData.url,
        customShortCode: formData.customShortCode || undefined,
        title: formData.title || undefined,
        description: formData.description || undefined,
        expiresAt: formData.expiresAt || undefined,
      });

      // Reset form
      setFormData({
        url: '',
        customShortCode: '',
        title: '',
        description: '',
        expiresAt: '',
      });

      onSuccess?.(result);
    } catch (error) {
      console.error('Failed to create URL:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Short URL</CardTitle>
        <CardDescription>
          Create a shortened URL that's easy to share and track
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">Original URL *</Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://example.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="customShortCode">Custom Short Code (optional)</Label>
            <Input
              id="customShortCode"
              name="customShortCode"
              type="text"
              value={formData.customShortCode}
              onChange={handleInputChange}
              placeholder="my-custom-code"
              pattern="[a-zA-Z0-9_-]+"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Only letters, numbers, hyphens, and underscores allowed
            </p>
          </div>

          <div>
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="My awesome link"
              maxLength={200}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of this link"
              maxLength={500}
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="expiresAt">Expiration Date (optional)</Label>
            <Input
              id="expiresAt"
              name="expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={createUrlMutation.isPending}
            className="w-full"
          >
            {createUrlMutation.isPending ? 'Creating...' : 'Create Short URL'}
          </Button>

          {createUrlMutation.isError && (
            <div className="text-red-600 text-sm">
              {createUrlMutation.error?.message || 'Failed to create URL'}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
