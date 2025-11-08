import { Movie } from "@/features/dashboard/types";

export interface MoviePagedResponse {
  content: Movie[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}

export interface MovieFilters {
  page?: number;
  size?: number;
  year?: number;
  winner?: boolean;
}
