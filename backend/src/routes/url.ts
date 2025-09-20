import { Router } from 'express';
import { IUrlController, IAuthMiddleware } from '../repositories';
import { container } from 'tsyringe';
import { validateSchema } from '../middleware/implementation/schemaValidation';
import { createUrlSchema, updateUrlSchema, urlQuerySchema } from '../validators';

export const createUrlRoutes = () => {
  const urlController = container.resolve<IUrlController>('IUrlController');
  const authMiddleware = container.resolve<IAuthMiddleware>('IAuthMiddleware');
  
  const router = Router();
  
  router.get('/:shortCode', urlController.redirectToUrl);
  router.get('/stats/:shortCode', urlController.getUrlStats);
  router.get('/top', urlController.getTopUrls);
  router.post('/create-public', validateSchema(createUrlSchema), urlController.createPublicUrl);
  
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
  router.post('/bulk-delete', authMiddleware.authenticate, urlController.bulkDeleteUrls);
  
  return router;
};
