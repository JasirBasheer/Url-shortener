import { IUrlService } from '../../services';
import { CreateUrlRequest } from '@/types';
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IUrlController } from '../interface/IUrlController';
import { QueryParser } from '../../utils';

@injectable()
export class UrlController implements IUrlController {
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
      const query = QueryParser.parseFilterQuery(req.query);
      const urls = await this.urlService.getUserUrls(userId, query);
      
      res.status(200).json({
        success: true,
        message: 'User URLs retrieved successfully',
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
      const url = await this.urlService.redirectToUrl(shortCode);
      res.status(200).json({
        success: true,
        message: 'URL fetched successfully',
        data: { url }
      });
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
}
