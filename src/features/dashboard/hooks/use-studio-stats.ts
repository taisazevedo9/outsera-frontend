import { useCallback, useMemo } from "react";
import { useApiData } from "@/shared/hooks/use-api-data";
import { DashboardService } from "../api/dashboard-service";
import { ApiClient } from "@/shared/services/api-client";

export function useStudioStats(limit: number = 3) {
  const apiClient = useMemo(() => new ApiClient(), []);
  const dashboardService = useMemo(
    () => new DashboardService(apiClient),
    [apiClient]
  );

  const fetcher = useCallback(async () => {
    const studios = await dashboardService.getStudiosWithWinCount();
    return studios.sort((a, b) => b.winCount - a.winCount).slice(0, limit);
  }, [dashboardService, limit]);

  const { data, loading, error } = useApiData({
    fetcher,
    initialLoad: true,
  });

  return {
    studios: data || [],
    loading,
    error,
  };
}
