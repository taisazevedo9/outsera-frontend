import { useCallback, useMemo } from "react";
import { useApiData } from "@/shared/hooks/use-api-data";
import { DashboardService } from "../api/dashboard-service";
import { ApiClient } from "@/shared/services/api-client";

export function useYearWinners() {
  const apiClient = useMemo(() => new ApiClient(), []);

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
