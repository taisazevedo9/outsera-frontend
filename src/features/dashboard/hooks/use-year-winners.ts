import { useCallback, useMemo } from "react";
import { useApiData } from "@/shared/hooks/use-api-data";
import { DashboardService } from "../api/dashboard-service";
import { ApiClient } from "@/shared/services/api-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function useYearWinners() {
  const apiClient = useMemo(() => new ApiClient(API_BASE), []);

  const dashboardService = useMemo(
    () => new DashboardService(apiClient),
    [apiClient]
  );

  const fetcher = useCallback(() => {
    return dashboardService.getYearsWithMultipleWinners();
  }, [dashboardService]);

  const { data, loading, error } = useApiData({
    fetcher,
    initialLoad: true,
  });

  return {
    years: data || [],
    loading,
    error,
  };
}
