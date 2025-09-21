export interface QueryDto {
  page: number;
  limit: number;
  query?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  type?: string;
}
