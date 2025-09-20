import { Router } from 'express';
import { validateRequest } from '../middleware/implementation/schemaValidation';

import { 
  signUpSchema, 
  signInSchema, 
} from '../validators';
import { container } from 'tsyringe';
import { IAuthMiddleware } from '@/middleware/interface/IAuthMiddleware';
import { IAuthController } from '@/controllers/interface/IAuthController';


export const createAuthRoutes = () => {
  const authController = container.resolve<IAuthController>('IAuthController');
  const authMiddleware = container.resolve<IAuthMiddleware>('IAuthMiddleware');
  
  const router = Router();
  
  router.post('/signup', validateRequest(signUpSchema), authController.signUp);
  router.post('/signin', validateRequest(signInSchema), authController.signIn);
  router.post('/signout', authController.signOut);
  
  router.get('/me', authMiddleware.authenticate, (req, res) => {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  });
  
  return router;
}
