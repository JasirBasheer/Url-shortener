import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UrlResponse } from "@/types";
import { urlService } from "../services";
import { extractError } from "@/utils";

interface CreateUrlFormProps {
  onSuccess?: (url: UrlResponse) => void;
}

export const CreateUrlForm: React.FC<CreateUrlFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ url: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await urlService.createUrl({ url: formData.url });
      setFormData({ url: "" });
      onSuccess?.(result);
    } catch (err: unknown) {
      setError(extractError(err,"Failed to create URL"))
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create Short URL"}
          </Button>

          {error && (
            <div className="text-red-600 text-sm mt-2">{error}</div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
