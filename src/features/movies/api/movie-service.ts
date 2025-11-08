import { ApiClient } from "@/shared/services/api-client";
import { MoviePagedResponse, MovieFilters } from "../types";
import { Movie } from "@/features/dashboard/types";

export class MovieService {
  constructor(private apiClient: ApiClient) {}

  async getMovies(filters: MovieFilters): Promise<Movie[]> {
    const response = await this.apiClient.get<MoviePagedResponse>(
      "/api/movies",
      {
        params: filters,
      }
    );
    return response.content;
  }

  async getWinnersByYear(year: number): Promise<Movie[]> {
    const response = await this.apiClient.get<MoviePagedResponse>(
      "/api/movies",
      {
        params: {
          page: 0,
          size: 99,
          winner: true,
          year: year,
        },
      }
    );
    return response.content;
  }
}
