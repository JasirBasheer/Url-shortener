import { Request, Response, NextFunction } from 'express';

export interface IUrlController {
  createShortUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserUrls(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  redirectToUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
}
