import { IUrlDocument } from "../../models";
import { IBaseRepository } from "./IBaseRepository";
import { QueryDto } from "@/dto";
import { PaginatedResponse } from "@/types";

export interface IUrlRepository extends IBaseRepository<IUrlDocument> {
  findByUserId(userId: string, query: QueryDto): Promise<PaginatedResponse<IUrlDocument>>;
  create(url: Partial<IUrlDocument>): Promise<IUrlDocument>;
  findById(id: string): Promise<IUrlDocument | null>;
  update(id: string, updates: Partial<IUrlDocument>): Promise<IUrlDocument | null>;
  delete(id: string): Promise<boolean>;

  findByShortCode(shortCode: string): Promise<IUrlDocument | null>;
  isShortCodeExists(shortCode: string): Promise<boolean>;

  incrementClicks(shortCode: string): Promise<void>;
}
