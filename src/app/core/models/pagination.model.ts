export type PaginationResponseModel<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};

export type PaginationRequestModel = {
  search?: string | null;
  page: number;
  limit: number;
  sort?: string | null;
  order?: 'asc' | 'desc' | null;
};
