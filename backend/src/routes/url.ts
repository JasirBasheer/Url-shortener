import { Router } from 'express';
import { container } from 'tsyringe';
import { validateSchema } from '../middleware/implementation/schemaValidation';
import { createUrlSchema, updateUrlSchema, urlQuerySchema } from '../validators';
import { IUrlController } from '@/controllers';
import { IAuthMiddleware } from '@/middleware/interface/IAuthMiddleware';

export const createUrlRoutes = () => {
  const urlController = container.resolve<IUrlController>('IUrlController');
  const authMiddleware = container.resolve<IAuthMiddleware>('IAuthMiddleware');
  
  const router = Router();
  
  router.get('/:shortCode', urlController.redirectToUrl);
  
  router.post('/create', 
    authMiddleware.authenticate, 
    validateSchema(createUrlSchema), 
    urlController.createShortUrl
  );

  router.get('/user/urls', 
    authMiddleware.authenticate, 
    validateSchema(urlQuerySchema, 'query'), 
    urlController.getUserUrls
  );

  router.put('/:urlId', 
    authMiddleware.authenticate, 
    validateSchema(updateUrlSchema), 
    urlController.updateUrl
  );
  router.delete('/:urlId', authMiddleware.authenticate, urlController.deleteUrl);
  
  return router;
};
