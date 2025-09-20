import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IUrlService } from '../../repositories';
import { CreateUrlRequest } from '../services/UrlService';
import { validateSchema } from '../../middleware/implementation/schemaValidation';
import { createUrlSchema, updateUrlSchema, urlQuerySchema } from '../../validators';

@injectable()
export class UrlController {
  constructor(
    @inject('IUrlService') private readonly urlService: IUrlService
  ) {}

  createShortUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { url, customShortCode, title, description, expiresAt } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const request: CreateUrlRequest = {
        url,
        userId,
        customShortCode,
        title,
        description,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      };

      const result = await this.urlService.createShortUrl(request);
      
      res.status(201).json({
        success: true,
        message: 'Short URL created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getUserUrls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const urls = await this.urlService.getUserUrls(userId, limit, offset);
      
      res.status(200).json({
        success: true,
        message: 'User URLs retrieved successfully',
        data: urls
      });
    } catch (error) {
      next(error);
    }
  };

  getUrlStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { shortCode } = req.params;
      
      const stats = await this.urlService.getUrlStats(shortCode);
      
      res.status(200).json({
        success: true,
        message: 'URL stats retrieved successfully',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  getTopUrls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const urls = await this.urlService.getTopUrls(limit);
      
      res.status(200).json({
        success: true,
        message: 'Top URLs retrieved successfully',
        data: urls
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { urlId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const deleted = await this.urlService.deleteUrl(urlId, userId);
      
      res.status(200).json({
        success: true,
        message: 'URL deleted successfully',
        data: { deleted }
      });
    } catch (error) {
      next(error);
    }
  };

  redirectToUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { shortCode } = req.params;
      
      const analyticsData = {
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        referrer: req.get('Referer') || undefined,
        country: req.get('CF-IPCountry') || undefined, // Cloudflare country header
        city: req.get('CF-IPCity') || undefined, // Cloudflare city header
      };
      
      const originalUrl = await this.urlService.redirectToUrl(shortCode, analyticsData);
      
      res.redirect(originalUrl);
    } catch (error) {
      next(error);
    }
  };

  updateUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { urlId } = req.params;
      const userId = req.user?.id;
      const { title, description, isActive, expiresAt } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const result = await this.urlService.updateUrl(urlId, userId, {
        title,
        description,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      });
      
      res.status(200).json({
        success: true,
        message: 'URL updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getUrlAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { shortCode } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const result = await this.urlService.getUrlAnalytics(shortCode, limit, offset);
      
      res.status(200).json({
        success: true,
        message: 'URL analytics retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getUrlAnalyticsStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { shortCode } = req.params;
      
      const result = await this.urlService.getUrlAnalyticsStats(shortCode);
      
      res.status(200).json({
        success: true,
        message: 'URL analytics stats retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  bulkDeleteUrls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { urlIds } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!Array.isArray(urlIds) || urlIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'URL IDs array is required'
        });
        return;
      }

      const result = await this.urlService.bulkDeleteUrls(urlIds, userId);
      
      res.status(200).json({
        success: true,
        message: 'Bulk delete completed',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  createPublicUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { url, customShortCode } = req.body;

      // For public URLs, we'll use a system user ID or create anonymous URLs
      const systemUserId = 'system'; // You might want to create a system user in your database

      const request: CreateUrlRequest = {
        url,
        userId: systemUserId,
        customShortCode,
      };

      const result = await this.urlService.createShortUrl(request);
      
      res.status(201).json({
        success: true,
        message: 'Short URL created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
