import { IUrlDocument } from "../../models";

export class UrlMapper {
  static toResponse(url: IUrlDocument) {
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
}
