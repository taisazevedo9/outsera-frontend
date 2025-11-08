import { useCallback, useMemo } from "react";
import { useApiData } from "@/shared/hooks/use-api-data";
import { DashboardService } from "../api/dashboard-service";
import { ApiClient } from "@/shared/services/api-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function useProducerInterval() {
  const apiClient = useMemo(() => new ApiClient(API_BASE), []);
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
