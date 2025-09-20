import { IUrlRepository, IUserRepository, UrlRepository, UserRepository } from '@/repositories';
import 'reflect-metadata';
import { container } from 'tsyringe';

export const registerRepositories = () => {
  container.register<IUserRepository>('IUserRepository', UserRepository);
  container.register<IUrlRepository>('IUrlRepository', UrlRepository);
}
