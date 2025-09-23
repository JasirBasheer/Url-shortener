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
import { urlService } from "../services";
import { extractError } from "@/utils";

interface CreateUrlFormProps {
  setActiveTab: (tab: string) => void;
}

export const CreateUrlForm: React.FC<CreateUrlFormProps> = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({ url: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await urlService.createUrl({ url: formData.url });
      setFormData({ url: "" });
      setActiveTab('list')
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
          Create a shortened URL.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://jasirbasheer.dev"
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
