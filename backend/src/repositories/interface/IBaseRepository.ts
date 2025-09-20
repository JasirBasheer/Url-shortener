export interface IBaseRepository<T> {
  create(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(filters: Record<string, unknown>,limit?: number, skip?: number): Promise<T[]>;
  update(id: string, updates: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
  