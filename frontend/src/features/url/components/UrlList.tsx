import React, { useEffect, useState, useCallback } from "react";
import { urlService } from "../services/urlService";
import type { UrlResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Trash2, ExternalLink } from "lucide-react";

export const UrlList: React.FC = () => {
  const [urls, setUrls] = useState<UrlResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const limit = 5;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await urlService.getUserUrls({
        limit,
        page,
        query: debouncedQuery,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      console.log(res);
      setUrls(res.data);
      setTotal(res.pagination.total || 0);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQuery]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) return;
    try {
      await urlService.deleteUrl(id);
      setUrls((prev) => {
        const updated = prev.filter((url) => url.id !== id);
        if (updated.length === 0 && page > 1) {
          setPage((p) => p - 1);
        }

        return updated;
      });
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  const handleCopy = async (shortCode: string) => {
    const shortUrl = urlService.getShortUrl(shortCode);
    await navigator.clipboard.writeText(shortUrl);
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) return <p>Loading URLs...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your URLs</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          type="text"
          placeholder="Search URLs..."
          className="border p-2 rounded w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {urls.length === 0 ? (
          <p>No URLs found.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {urls.map((url) => (
                <li
                  key={url.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <div>
                    <p className="truncate max-w-xs">{url.url}</p>
                    <p className="text-sm text-gray-500">{url.shortCode}</p>
                    <p className="text-sm text-gray-500">total clicks: {url.clicks}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(url.shortCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(url.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(url.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mt-4">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Prev
              </Button>
              <p>
                Page {page} of {totalPages || 1}
              </p>
              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
