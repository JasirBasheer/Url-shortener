import 'reflect-metadata';
import { container } from 'tsyringe';
import { AuthService, IAuthService, IUrlService, UrlService } from '@/services';

export const registerServices = () => {
  container.register<IAuthService>('IAuthService', AuthService);
  container.register<IUrlService>('IUrlService', UrlService);
}
