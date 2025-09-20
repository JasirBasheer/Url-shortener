export interface IUrl {
  url: string;
  shortCode: string;
  userId: string;
  clicks: number;
  expiresAt?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
