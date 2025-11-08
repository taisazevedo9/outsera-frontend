"use client";

import { useState, useCallback, useEffect } from "react";

interface UseApiDataOptions<T> {
  fetcher: () => Promise<T>;
  initialLoad?: boolean;
}

interface UseApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApiData<T>({
  fetcher,
  initialLoad = true,
}: UseApiDataOptions<T>): UseApiDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (initialLoad) {
      fetch();
    }
  }, [initialLoad, fetch]);

  return { data, loading, error, refetch: fetch };
}
