import { useCallback, useMemo } from "react";
import { useApiData } from "@/shared/hooks/use-api-data";
import { DashboardService } from "../api/dashboard-service";
import { ApiClient } from "@/shared/services/api-client";

export function useProducerInterval() {
  const apiClient = useMemo(() => new ApiClient(), []);
  const dashboardService = useMemo(
    () => new DashboardService(apiClient),
    [apiClient]
  );

  const fetcher = useCallback(() => {
    return dashboardService.getProducersWithInterval();
  }, [dashboardService]);

  const { data, loading, error } = useApiData({
    fetcher,
    initialLoad: true,
  });

  const producers = useMemo(() => {
    if (!data) return [];
    return [...data.max, ...data.min];
  }, [data]);

  return {
    producers,
    maxProducers: data?.max || [],
    minProducers: data?.min || [],
    loading,
    error,
  };
}
