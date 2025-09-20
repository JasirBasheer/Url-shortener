import { Request, Response, NextFunction } from 'express';

export interface IAuthController {
  signUp(req: Request, res: Response, next: NextFunction): Promise<void>;
  signIn(req: Request, res: Response, next: NextFunction): Promise<void>;
  signOut(req: Request, res: Response, next: NextFunction): Promise<void>;
}
