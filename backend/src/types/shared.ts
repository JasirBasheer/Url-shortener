
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number, total: number, pages: number, limit: number
  };
}
