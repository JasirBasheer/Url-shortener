import { z } from "zod";

export const createUrlSchema = z.object({
  url: z.string()
    .url({ message: "Please provide a valid URL" }),

  customShortCode: z.string()
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Custom short code can only contain letters, numbers, hyphens, and underscores" })
    .min(3, { message: "Custom short code must be at least 3 characters long" })
    .max(20, { message: "Custom short code must not exceed 20 characters" })
    .optional(),
});

export const updateUrlSchema = z.object({
  url: z.string()
    .url({ message: "Please provide a valid URL" })
    .optional(),

  customShortCode: z.string()
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Custom short code can only contain letters, numbers, hyphens, and underscores" })
    .min(3, { message: "Custom short code must be at least 3 characters long" })
    .max(20, { message: "Custom short code must not exceed 20 characters" })
    .optional(),
});

export const urlQuerySchema = z.object({
  limit: z.number()
    .int({ message: "Limit must be an integer" })
    .min(1, { message: "Limit must be at least 1" })
    .max(100, { message: "Limit must not exceed 100" })
    .default(10),

  offset: z.number()
    .int({ message: "Offset must be an integer" })
    .min(0, { message: "Offset must be at least 0" })
    .default(0),

  search: z.string()
    .trim()
    .max(100, { message: "Search term must not exceed 100 characters" })
    .optional(),

  sortBy: z.enum(['createdAt', 'clicks', 'url', 'shortCode'])
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc'])
    .default('desc'),
});

export type CreateUrlDto = z.infer<typeof createUrlSchema>;
export type UpdateUrlDto = z.infer<typeof updateUrlSchema>;
export type UrlQueryDto = z.infer<typeof urlQuerySchema>;
