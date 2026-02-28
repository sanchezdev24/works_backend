export class Pagination {
  private readonly page: number;
  private readonly limit: number;

  constructor(page: number = 1, limit: number = 20) {
    if (page < 1) throw new Error('Page must be greater than 0');
    if (limit < 1 || limit > 100) throw new Error('Limit must be between 1 and 100');
    this.page = page;
    this.limit = limit;
  }

  getPage(): number {
    return this.page;
  }

  getLimit(): number {
    return this.limit;
  }

  getOffset(): number {
    return (this.page - 1) * this.limit;
  }
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  pagination: Pagination,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / pagination.getLimit());
  return {
    data,
    total,
    page: pagination.getPage(),
    limit: pagination.getLimit(),
    totalPages,
    hasNextPage: pagination.getPage() < totalPages,
    hasPreviousPage: pagination.getPage() > 1,
  };
}
