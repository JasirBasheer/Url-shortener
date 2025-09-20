
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    current: number;
  };
}
