import { IUrlRepository } from "@/repositories";
import { CreateUrlRequest, PaginatedResponse, UrlResponse } from "@/types";
import { logInfo, logWarn, NotFoundError, ValidationError } from "@/utils";
import { injectable, inject } from "tsyringe";
import { IUrlService } from "../interface/IUrlService";

@injectable()
export class UrlService implements IUrlService {
  constructor(
    @inject("IUrlRepository") private urlRepository: IUrlRepository
  ) {}

  async createShortUrl(request: CreateUrlRequest): Promise<UrlResponse> {
    logInfo("CreateShortUrl service started", { userId: request.userId });

    if (!this.isValidUrl(request.url)) {
      throw new ValidationError("Invalid URL format");
    }
    const shortCode = this.generateShortCode();
    if (await this.urlRepository.isShortCodeExists(shortCode)) {
      const newShortCode = this.generateShortCode();
      return this.createShortUrl({ ...request, customShortCode: newShortCode });
    }

    const newUrl = await this.urlRepository.create({
      url: request.url,
      shortCode,
      userId: request.userId,
      clicks: 0,
      expiresAt: request.expiresAt,
      isActive: true,
    });

    return {
      id: newUrl._id.toString(),
      url: newUrl.url,
      shortCode: newUrl.shortCode,
      userId: newUrl.userId,
      clicks: newUrl.clicks,
      expiresAt: newUrl.expiresAt,
      isActive: newUrl.isActive,
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt,
    };
  }

  async getUserUrls(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<PaginatedResponse<UrlResponse>> {
    const data = await this.urlRepository.findByUserId(
      userId,
      "",
      limit,
      offset
    );

    return {
      data: data.map((url) => ({
        id: url._id.toString(),
        url: url.url,
        shortCode: url.shortCode,
        userId: url.userId,
        clicks: url.clicks,
        expiresAt: url.expiresAt,
        isActive: url.isActive,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      })),
      pagination: {
        total: data.length,
        current: offset + 1,
      },
    };
  }

  async getUrlByShortCode(shortCode: string): Promise<UrlResponse> {
    logInfo("GetUrlByShortCode service started", { shortCode });

    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) {
      logWarn("GetUrlByShortCode failed - URL not found", { shortCode });
      throw new NotFoundError("URL not found");
    }

    return {
      id: url._id.toString(),
      url: url.url,
      shortCode: url.shortCode,
      userId: url.userId,
      clicks: url.clicks,
      expiresAt: url.expiresAt,
      isActive: url.isActive,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }

  async redirectToUrl(shortCode: string): Promise<string> {
    logInfo("RedirectToUrl service started", { shortCode });

    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) {
      logWarn("RedirectToUrl failed - URL not found", { shortCode });
      throw new NotFoundError("URL not found");
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      logWarn("RedirectToUrl failed - URL has expired", { shortCode });
      throw new NotFoundError("URL has expired");
    }

    await this.urlRepository.incrementClicks(shortCode);

    logInfo("RedirectToUrl completed successfully", {
      shortCode,
      originalUrl: url.url,
    });

    return url.url;
  }

  async deleteUrl(urlId: string, userId: string): Promise<boolean> {
    logInfo("DeleteUrl service started", { urlId, userId });

    const url = await this.urlRepository.findById(urlId);
    if (!url) {
      logWarn("DeleteUrl failed - URL not found", { urlId });
      throw new NotFoundError("URL not found");
    }

    if (url.userId !== userId) {
      logWarn("DeleteUrl failed - unauthorized access", { urlId, userId });
      throw new ValidationError("Unauthorized to delete this URL");
    }

    const deleted = await this.urlRepository.delete(urlId);

    logInfo("DeleteUrl completed successfully", { urlId, deleted });

    return deleted;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async updateUrl(urlId: string, userId: string, updates: {
    title?: string;
    description?: string;
    isActive?: boolean;
    expiresAt?: Date;
  }): Promise<UrlResponse> {
    logInfo("UpdateUrl service started", { urlId, userId });

    const url = await this.urlRepository.findById(urlId);
    if (!url) {
      logWarn("UpdateUrl failed - URL not found", { urlId });
      throw new NotFoundError("URL not found");
    }

    if (url.userId !== userId) {
      logWarn("UpdateUrl failed - unauthorized access", { urlId, userId });
      throw new ValidationError("Unauthorized to update this URL");
    }

    const updatedUrl = await this.urlRepository.update(urlId, updates);
    if (!updatedUrl) {
      throw new NotFoundError("URL not found");
    }

    logInfo("UpdateUrl completed successfully", { urlId });

    return {
      id: updatedUrl._id.toString(),
      url: updatedUrl.url,
      shortCode: updatedUrl.shortCode,
      userId: updatedUrl.userId,
      clicks: updatedUrl.clicks,
      expiresAt: updatedUrl.expiresAt,
      isActive: updatedUrl.isActive,
      createdAt: updatedUrl.createdAt,
      updatedAt: updatedUrl.updatedAt,
    };
  }

  private generateShortCode(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
