import 'reflect-metadata';
import { container } from 'tsyringe';
import { AuthController, IAuthController, IUrlController, UrlController } from '../controllers';
import { IAuthMiddleware } from '../middleware/interface/IAuthMiddleware';
import { AuthMiddleware } from '../middleware';

export const registerControllers = () => {
  container.register<IAuthController>('IAuthController', AuthController);
  container.register<IUrlController>('IUrlController', UrlController);
  container.register<IAuthMiddleware>('IAuthMiddleware', AuthMiddleware);
}
