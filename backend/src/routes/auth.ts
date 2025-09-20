import { Router } from 'express';
import { validateSchema } from '../middleware/implementation/schemaValidation';
import { authLimiter } from '../utils/rate-limiter';
import { IAuthController, IAuthMiddleware } from '../repositories';
import { 
  signUpSchema, 
  signInSchema, 
} from '../validators';
import { container } from 'tsyringe';



export const createAuthRoutes = () => {
  const authController = container.resolve<IAuthController>('IAuthController');
  const authMiddleware = container.resolve<IAuthMiddleware>('IAuthMiddleware');
  
  const router = Router();
  
  router.post('/signup', authLimiter, validateSchema(signUpSchema), authController.signUp);
  router.post('/signin', authLimiter, validateSchema(signInSchema), authController.signIn);
  router.post('/signout', authLimiter, authController.signOut);
  
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
