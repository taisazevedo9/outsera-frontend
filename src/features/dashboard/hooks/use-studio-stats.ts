import { useCallback, useMemo } from "react";
import { useApiData } from "@/shared/hooks/use-api-data";
import { DashboardService } from "../api/dashboard-service";
import { ApiClient } from "@/shared/services/api-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function useStudioStats(limit: number = 3) {
  const apiClient = useMemo(() => new ApiClient(API_BASE), []);
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
