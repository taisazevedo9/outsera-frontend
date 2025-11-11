import { useCallback, useMemo } from "react";
import { useApiData } from "@/shared/hooks/use-api-data";
import { MovieService } from "@/features/movies/api/movie-service";
import { ApiClient } from "@/shared/services/api-client";

export function useMoviesPreview(year?: number) {
  const apiClient = useMemo(() => new ApiClient(), []);
  const movieService = useMemo(() => new MovieService(apiClient), [apiClient]);

  const fetcher = useCallback(async () => {
    if (year) {
      console.log("Fetching winners for year:", year);
      return movieService.getWinnersByYear(year);
    }
    const result = await movieService.getMovies({ page: 1, size: 15 });
    return result.movies;
  }, [movieService, year]);

  const { data, loading, error, refetch } = useApiData({
    fetcher,
    initialLoad: false,
  });

  return {
    movies: data || [],
    loading,
    error,
    refetch,
  };
}
