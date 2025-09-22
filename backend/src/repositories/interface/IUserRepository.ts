import { IUserDocument } from "../../models";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUserDocument>{
  create(user: Partial<IUserDocument>): Promise<IUserDocument>;
  findById(id: string): Promise<IUserDocument | null>;
  update(id: string, updates: Partial<IUserDocument>): Promise<IUserDocument | null>;
  delete(id: string): Promise<boolean>;
  
  findByEmail(email: string): Promise<IUserDocument | null>;
  isExists(email: string): Promise<boolean>;
  }
