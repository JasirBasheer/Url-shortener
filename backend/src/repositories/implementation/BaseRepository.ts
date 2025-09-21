import { Model, Document } from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepository";
import { logError, logInfo } from "../../utils";

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(
    protected model: Model<T & Document>,
  ) {}

  async create(item: Partial<T>): Promise<T> {
    try {
      const newDocument = new this.model(item);
      const savedDocument = await newDocument.save();
      return savedDocument.toObject();
    } catch (error) {
      logError(`Failed to create ${this.model.modelName}`, {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new Error(`Failed to create ${this.model.modelName}`);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const document = await this.model.findById(id).exec();
      return document ? document.toObject() : null;
    } catch (error) {
      logError(`Failed to find ${this.model.modelName} by ID`, {
        error: error instanceof Error ? error.message : "Unknown error",
        id,
      });
      throw new Error(`Failed to find ${this.model.modelName} by ID`);
    }
  }

  async findAll(
    filters: Record<string, unknown> = {},
    limit?: number,
    skip?: number,
    sort?: Record<string, 1 | -1>
  ): Promise<T[]> {
    try {
      let query = this.model.find(filters);

      if (skip) query = query.skip(skip);
      if (limit) query = query.limit(limit);
      if (sort) query = query.sort(sort);

      const documents = await query.exec();
      return documents.map((doc) => doc.toObject());
    } catch (error) {
      logError(`Failed to find all ${this.model.modelName}`, {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new Error(`Failed to find all ${this.model.modelName}`);
    }
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    try {
      const document = await this.model
        .findByIdAndUpdate(
          id,
          { ...updates, updatedAt: new Date() },
          { new: true, runValidators: true }
        )
        .exec();

      return document ? document.toObject() : null;
    } catch (error) {
      logError(`Failed to update ${this.model.modelName}`, {
        error: error instanceof Error ? error.message : "Unknown error",
        id,
      });
      throw new Error(`Failed to update ${this.model.modelName}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      const deleted = result !== null;
      if (deleted) {
        logInfo(`${this.model.modelName} deleted successfully`, {
          id,
        });
      }
      return deleted;
    } catch (error) {
      logError(`Failed to delete ${this.model.modelName}`, {
        error: error instanceof Error ? error.message : "Unknown error",
        id,
      });
      throw new Error(`Failed to delete ${this.model.modelName}`);
    }
  }
}
