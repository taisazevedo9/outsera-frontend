import { useCallback, useMemo } from "react";
import { useApiData } from "@/shared/hooks/use-api-data";
import { MovieService } from "@/features/movies/api/movie-service";
import { ApiClient } from "@/shared/services/api-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function useMoviesPreview(year?: number) {
  const apiClient = useMemo(() => new ApiClient(API_BASE), []);
  const movieService = useMemo(() => new MovieService(apiClient), [apiClient]);

  const fetcher = useCallback(() => {
    if (year) {
      console.log("Fetching winners for year:", year);
      return movieService.getWinnersByYear(year);
    }
    return movieService.getMovies({ page: 1, size: 15 });
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
