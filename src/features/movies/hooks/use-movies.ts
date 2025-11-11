"use client";

import { useMemo, useCallback } from "react";
import { useApiData } from "@/shared/hooks/use-api-data";
import { MovieService } from "../api/movie-service";
import { MovieFilters } from "../types";
import { ApiClient } from "@/shared/services/api-client";

export function useMovies(filters?: MovieFilters) {
  const apiClient = useMemo(() => new ApiClient(), []);
  const movieService = useMemo(() => new MovieService(apiClient), [apiClient]);

  const fetcher = useCallback(() => {
    return movieService.getMovies(filters || {});
  }, [movieService, filters]);

  const { data, loading, error, refetch } = useApiData({
    fetcher,
    initialLoad: true,
  });

  return {
    movies: data?.movies || [],
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    loading,
    error,
    refetch,
  };
}
