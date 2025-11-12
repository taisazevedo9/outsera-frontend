import { ApiClient } from "@/shared/services/api-client";
import { MoviePagedResponse, MovieFilters } from "../types";
import { Movie } from "@/features/dashboard/types";

export interface MoviePageData {
  movies: Movie[];
  totalPages: number;
  totalElements: number;
}

export class MovieService {
  constructor(private apiClient: ApiClient) {}

  async getMovies(filters: MovieFilters): Promise<MoviePageData> {
    const response = await this.apiClient.get<MoviePagedResponse>(
      "/api/movies",
      {
        params: filters,
      }
    );
    return {
      movies: response.content,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
    };
  }

  async getWinnersByYear(year: number): Promise<Movie[]> {
    const response = await this.apiClient.get<Movie[]>(
      "/api/movies/winnersByYear",
      {
        params: {
          winner: true,
          year: year,
        },
      }
    );
    return response;
  }
}
