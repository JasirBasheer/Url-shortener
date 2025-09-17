import type { NextFunction, Request, Response } from 'express';

export interface IUserAuthController {
  signIn(req: Request, res: Response, next: NextFunction): Promise<void>;
  signUp(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}
