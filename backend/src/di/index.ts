import 'reflect-metadata';
import { container } from 'tsyringe';
import { 
  IUserRepository, 
  IUrlRepository,
  IJwtService, 
  ILoggerService, 
  IPasswordService,
  IAuthController, 
  IUrlController,
  IAuthMiddleware,
  IAuthService,
  IUrlService
} from '../repositories';
import { UserRepository, UrlRepository } from '../repositories';
import { JwtServiceImpl, LoggerService, PasswordService, AuthService, UrlService } from '../services';
import { AuthController, UrlController } from '../controllers';
import { AuthMiddleware } from '../middleware';
import { UserModel, UrlModel, UrlAnalyticsModel } from '../models';

export const registerDependencies = () => {
  container.registerInstance('UserModel', UserModel);
  container.registerInstance('UrlModel', UrlModel);
  container.registerInstance('UrlAnalyticsModel', UrlAnalyticsModel);
  
  container.register<IUserRepository>('IUserRepository', UserRepository);
  container.register<IUrlRepository>('IUrlRepository', UrlRepository);
  
  container.register<IJwtService>('IJwtService', JwtServiceImpl);
  container.register<ILoggerService>('ILoggerService', LoggerService);
  container.register<IPasswordService>('IPasswordService', PasswordService);
  container.register<IAuthService>('IAuthService', AuthService);
  container.register<IUrlService>('IUrlService', UrlService);
  
  container.register<IAuthController>('IAuthController', AuthController);
  container.register<IUrlController>('IUrlController', UrlController);
  container.register<IAuthMiddleware>('IAuthMiddleware', AuthMiddleware);
}
