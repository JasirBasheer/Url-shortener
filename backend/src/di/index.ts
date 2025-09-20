import 'reflect-metadata';
import { registerServices } from './service';
import { registerRepositories } from './repository';
import { registerModels } from './model';
import { registerControllers } from './controller';

export const registerDependencies = () => {
  registerModels()
  registerRepositories()
  registerServices()
  registerControllers()
}
