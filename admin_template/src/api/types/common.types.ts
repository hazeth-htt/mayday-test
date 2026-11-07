export interface ApiResponse<T = unknown> {
  code: string;
  message: string;
  data: T;
  total?: number | string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  data?: unknown;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  pagination?: PaginationMeta;
}
