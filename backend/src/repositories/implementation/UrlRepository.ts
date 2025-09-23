import { IUrl, IUrlDocument } from "../../models";
import { Model } from "mongoose";
import { injectable, inject } from "tsyringe";
import { IUrlRepository } from "../interface/IUrlRepository";
import { BaseRepository } from "./BaseRepository";
import { logError, logInfo, QueryParser } from "../../utils";
import { QueryDto } from "@/dto";
import { PaginatedResponse } from "@/types";

@injectable()
export class UrlRepository
  extends BaseRepository<IUrlDocument>
  implements IUrlRepository
{
  constructor(@inject("UrlModel") urlModel: Model<IUrlDocument>) {
    super(urlModel);
  }

  async create(url: Partial<IUrlDocument>): Promise<IUrlDocument> {
    try {
      const newUrl = new this.model(url);
      const savedUrl = await newUrl.save();
      return savedUrl;
    } catch (error) {
      logError("Failed to create URL", {
        error: error instanceof Error ? error.message : "Unknown error",
        shortCode: url.shortCode,
      });
      if (error instanceof Error && error.message.includes("duplicate key")) {
        throw new Error("Short code already exists");
      }
      throw new Error("Failed to create URL");
    }
  }

  async findByShortCode(shortCode: string): Promise<IUrlDocument | null> {
    try {
      return await this.model.findOne({ shortCode }).exec();
    } catch (error) {
      logError("Failed to find URL by short code", {
        error: error instanceof Error ? error.message : "Unknown error",
        shortCode,
      });
      throw new Error("Failed to find URL by short code");
    }
  }

  async findByUserId(
    userId: string,
    query: QueryDto
  ): Promise<PaginatedResponse<IUrlDocument>> {
    try {
      const { page, limit, sortBy, sortOrder } = query;
      const filter = QueryParser.buildFilter({
        searchText: query.query,
        searchFields: ["url","shortCode"],
        additionalFilters: { userId },
      });

      const sort: Record<string, 1 | -1> = {
        [sortBy]: sortOrder === "desc" ? -1 : 1,
      };
      const total = await this.model.countDocuments(filter);
      const pages = Math.ceil(total / limit);

      const mongoQuery = this.model
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      const data = await mongoQuery.exec();
      return {
        data,
        pagination: {
          page,
          total,
          limit,
          pages,
        },
      };
    } catch (error) {
      logError("Failed to find URLs by user ID", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId,
      });
      throw new Error("Failed to find URLs by user ID");
    }
  }

  async isShortCodeExists(shortCode: string): Promise<boolean> {
    try {
      const count = await this.model.countDocuments({ shortCode }).exec();
      return count > 0;
    } catch (error) {
      logError("Failed to check if short code exists", {
        error: error instanceof Error ? error.message : "Unknown error",
        shortCode,
      });
      throw new Error("Failed to check if short code exists");
    }
  }

  async incrementClicks(shortCode: string): Promise<void> {
    try {
      await this.model
        .findOneAndUpdate({ shortCode }, { $inc: { clicks: 1 } }, { new: true })
        .exec();
      logInfo("URL clicks incremented", { shortCode });
    } catch (error) {
      logError("Failed to increment URL clicks", {
        error: error instanceof Error ? error.message : "Unknown error",
        shortCode,
      });
      throw new Error("Failed to increment URL clicks");
    }
  }
}
