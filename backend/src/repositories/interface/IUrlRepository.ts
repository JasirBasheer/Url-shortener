import { IUrl } from "@/models";
import { IBaseRepository } from "./IBaseRepository";

export interface IUrlRepository extends IBaseRepository<IUrl> {
  // findAll(filters: Record<string, unknown>, limit?: number, offset?: number): Promise<IUrl[]>;
  create(url: Partial<IUrl>): Promise<IUrl>;
  findById(id: string): Promise<IUrl | null>;
  update(id: string, updates: Partial<IUrl>): Promise<IUrl | null>;
  delete(id: string): Promise<boolean>;

  findByShortCode(shortCode: string): Promise<IUrl | null>;
  isShortCodeExists(shortCode: string): Promise<boolean>;

  incrementClicks(shortCode: string): Promise<void>;
}
