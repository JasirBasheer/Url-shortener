import { Request, Response, NextFunction } from 'express';

export interface IUrlController {
  createShortUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  createPublicUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserUrls(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUrlStats(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTopUrls(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  redirectToUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUrlAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUrlAnalyticsStats(req: Request, res: Response, next: NextFunction): Promise<void>;
  bulkDeleteUrls(req: Request, res: Response, next: NextFunction): Promise<void>;
}
