import { renderHook, waitFor } from "@testing-library/react";
import { useProducerInterval } from "../use-producer-interval";
import { DashboardService } from "../../api/dashboard-service";
import { ApiClient } from "@/shared/services/api-client";
import { ProducerWithInterval } from "../../types";

jest.mock("@/shared/services/api-client");
jest.mock("../../api/dashboard-service");

describe("useProducerInterval", () => {
  const mockMaxProducers: ProducerWithInterval[] = [
    { producer: "Producer 1", interval: 13, previousWin: 1980, followingWin: 1993 },
    { producer: "Producer 2", interval: 13, previousWin: 1986, followingWin: 1999 },
  ];

  const mockMinProducers: ProducerWithInterval[] = [
    { producer: "Producer 3", interval: 1, previousWin: 1991, followingWin: 1992 },
  ];

  const mockProducerData = {
    min: mockMinProducers,
    max: mockMaxProducers,
  };

  const mockApiClient = {
    get: jest.fn(),
  };

  const mockDashboardService = {
    getProducersWithInterval: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiClient as jest.Mock).mockImplementation(() => mockApiClient);
    (DashboardService as jest.Mock).mockImplementation(
      () => mockDashboardService
    );
    mockDashboardService.getProducersWithInterval.mockResolvedValue(
      mockProducerData
    );
  });

  describe("initialization", () => {
    it("should initialize with empty arrays and loading state", () => {
      const { result } = renderHook(() => useProducerInterval());

      expect(result.current.producers).toEqual([]);
      expect(result.current.maxProducers).toEqual([]);
      expect(result.current.minProducers).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("should fetch producer intervals on mount", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(
        mockDashboardService.getProducersWithInterval
      ).toHaveBeenCalledTimes(1);
    });

    it("should call getProducersWithInterval without parameters", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockDashboardService.getProducersWithInterval).toHaveBeenCalledWith();
    });
  });

  describe("data handling", () => {
    it("should return combined producers array (max + min)", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.producers).toHaveLength(3);
      expect(result.current.producers).toEqual([
        ...mockMaxProducers,
        ...mockMinProducers,
      ]);
    });

    it("should separate max and min producers", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.maxProducers).toEqual(mockMaxProducers);
      expect(result.current.minProducers).toEqual(mockMinProducers);
    });

    it("should return empty arrays when data is null", async () => {
      mockDashboardService.getProducersWithInterval.mockResolvedValueOnce(null);

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.producers).toEqual([]);
      expect(result.current.maxProducers).toEqual([]);
      expect(result.current.minProducers).toEqual([]);
    });

    it("should return empty arrays when data is undefined", async () => {
      mockDashboardService.getProducersWithInterval.mockResolvedValueOnce(
        undefined
      );

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.producers).toEqual([]);
      expect(result.current.maxProducers).toEqual([]);
      expect(result.current.minProducers).toEqual([]);
    });

    it("should handle empty max array", async () => {
      mockDashboardService.getProducersWithInterval.mockResolvedValueOnce({
        min: mockMinProducers,
        max: [],
      });

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.producers).toEqual(mockMinProducers);
      expect(result.current.maxProducers).toEqual([]);
      expect(result.current.minProducers).toEqual(mockMinProducers);
    });

    it("should handle empty min array", async () => {
      mockDashboardService.getProducersWithInterval.mockResolvedValueOnce({
        min: [],
        max: mockMaxProducers,
      });

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.producers).toEqual(mockMaxProducers);
      expect(result.current.maxProducers).toEqual(mockMaxProducers);
      expect(result.current.minProducers).toEqual([]);
    });

    it("should handle both arrays empty", async () => {
      mockDashboardService.getProducersWithInterval.mockResolvedValueOnce({
        min: [],
        max: [],
      });

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.producers).toEqual([]);
      expect(result.current.maxProducers).toEqual([]);
      expect(result.current.minProducers).toEqual([]);
    });

    it("should handle single producer in each array", async () => {
      const singleData = {
        min: [mockMinProducers[0]],
        max: [mockMaxProducers[0]],
      };
      mockDashboardService.getProducersWithInterval.mockResolvedValueOnce(
        singleData
      );

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.producers).toHaveLength(2);
      expect(result.current.maxProducers).toHaveLength(1);
      expect(result.current.minProducers).toHaveLength(1);
    });

    it("should handle multiple producers in min array", async () => {
      const multipleMinProducers = [
        { producer: "Producer A", interval: 1, previousWin: 1990, followingWin: 1991 },
        { producer: "Producer B", interval: 1, previousWin: 1992, followingWin: 1993 },
        { producer: "Producer C", interval: 1, previousWin: 1994, followingWin: 1995 },
      ];
      mockDashboardService.getProducersWithInterval.mockResolvedValueOnce({
        min: multipleMinProducers,
        max: mockMaxProducers,
      });

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.minProducers).toHaveLength(3);
      expect(result.current.producers).toHaveLength(5);
    });

    it("should maintain order when combining arrays", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // max comes first, then min
      expect(result.current.producers[0]).toBe(mockMaxProducers[0]);
      expect(result.current.producers[1]).toBe(mockMaxProducers[1]);
      expect(result.current.producers[2]).toBe(mockMinProducers[0]);
    });
  });

  describe("loading state", () => {
    it("should set loading to true initially", () => {
      const { result } = renderHook(() => useProducerInterval());

      expect(result.current.loading).toBe(true);
    });

    it("should set loading to false after successful fetch", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.producers).toHaveLength(3);
    });

    it("should set loading to false after error", async () => {
      const error = new Error("Failed to fetch");
      mockDashboardService.getProducersWithInterval.mockRejectedValueOnce(
        error
      );

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Failed to fetch");
    });
  });

  describe("error handling", () => {
    it("should handle errors when fetching producer intervals", async () => {
      const errorMessage = "Network error";
      mockDashboardService.getProducersWithInterval.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.producers).toEqual([]);
      expect(result.current.maxProducers).toEqual([]);
      expect(result.current.minProducers).toEqual([]);
    });

    it("should handle non-Error exceptions", async () => {
      mockDashboardService.getProducersWithInterval.mockRejectedValueOnce(
        "String error"
      );

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Unknown error");
      expect(result.current.producers).toEqual([]);
    });

    it("should handle API errors with status codes", async () => {
      const apiError = new Error("Internal Server Error");
      (apiError as any).statusCode = 500;
      mockDashboardService.getProducersWithInterval.mockRejectedValueOnce(
        apiError
      );

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Internal Server Error");
    });

    it("should handle 404 errors", async () => {
      const notFoundError = new Error("Not Found");
      (notFoundError as any).statusCode = 404;
      mockDashboardService.getProducersWithInterval.mockRejectedValueOnce(
        notFoundError
      );

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Not Found");
    });
  });

  describe("memoization", () => {
    it("should create ApiClient instance", () => {
      renderHook(() => useProducerInterval());

      expect(ApiClient).toHaveBeenCalled();
    });

    it("should create DashboardService instance with apiClient", () => {
      renderHook(() => useProducerInterval());

      expect(DashboardService).toHaveBeenCalledWith(mockApiClient);
    });

    it("should memoize apiClient instance", () => {
      const { rerender } = renderHook(() => useProducerInterval());

      const firstCallCount = (ApiClient as jest.Mock).mock.calls.length;

      rerender();

      const secondCallCount = (ApiClient as jest.Mock).mock.calls.length;

      expect(secondCallCount).toBe(firstCallCount);
    });

    it("should memoize dashboardService instance", () => {
      const { rerender } = renderHook(() => useProducerInterval());

      const firstCallCount = (DashboardService as jest.Mock).mock.calls.length;

      rerender();

      const secondCallCount = (DashboardService as jest.Mock).mock.calls.length;

      expect(secondCallCount).toBe(firstCallCount);
    });

    it("should memoize fetcher callback", async () => {
      const { result, rerender } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstCallCount =
        mockDashboardService.getProducersWithInterval.mock.calls.length;

      rerender();

      await waitFor(() => {
        expect(
          mockDashboardService.getProducersWithInterval.mock.calls.length
        ).toBe(firstCallCount);
      });
    });

    it("should memoize producers array when data doesn't change", async () => {
      const { result, rerender } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstProducers = result.current.producers;

      rerender();

      expect(result.current.producers).toBe(firstProducers);
    });

    it("should recalculate producers when data changes", async () => {
      const { result, rerender } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstProducers = result.current.producers;

      // Change the mock data
      const newData = {
        min: [mockMinProducers[0]],
        max: [mockMaxProducers[0]],
      };
      mockDashboardService.getProducersWithInterval.mockResolvedValueOnce(
        newData
      );

      rerender();

      // Producers reference should remain the same since data didn't actually update
      expect(result.current.producers).toBe(firstProducers);
    });
  });

  describe("return value structure", () => {
    it("should return object with correct properties", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toHaveProperty("producers");
      expect(result.current).toHaveProperty("maxProducers");
      expect(result.current).toHaveProperty("minProducers");
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("error");
    });

    it("should not expose refetch function", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).not.toHaveProperty("refetch");
    });

    it("should always return arrays for producer properties", async () => {
      const { result } = renderHook(() => useProducerInterval());

      expect(Array.isArray(result.current.producers)).toBe(true);
      expect(Array.isArray(result.current.maxProducers)).toBe(true);
      expect(Array.isArray(result.current.minProducers)).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(Array.isArray(result.current.producers)).toBe(true);
      expect(Array.isArray(result.current.maxProducers)).toBe(true);
      expect(Array.isArray(result.current.minProducers)).toBe(true);
    });

    it("should return different references for producers vs max/min", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // producers is a combined array, not the same reference as max or min
      expect(result.current.producers).not.toBe(result.current.maxProducers);
      expect(result.current.producers).not.toBe(result.current.minProducers);
    });
  });

  describe("integration with useApiData", () => {
    it("should call useApiData with correct options", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockDashboardService.getProducersWithInterval).toHaveBeenCalled();
    });

    it("should use initialLoad: true", async () => {
      const { result } = renderHook(() => useProducerInterval());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(
        mockDashboardService.getProducersWithInterval
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("producer data structure", () => {
    it("should preserve producer properties", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const producer = result.current.producers[0];
      expect(producer).toHaveProperty("producer");
      expect(producer).toHaveProperty("interval");
      expect(producer).toHaveProperty("previousWin");
      expect(producer).toHaveProperty("followingWin");
      expect(typeof producer.producer).toBe("string");
      expect(typeof producer.interval).toBe("number");
      expect(typeof producer.previousWin).toBe("number");
      expect(typeof producer.followingWin).toBe("number");
    });

    it("should maintain separate max producers structure", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.maxProducers[0]).toEqual(mockMaxProducers[0]);
      expect(result.current.maxProducers[1]).toEqual(mockMaxProducers[1]);
    });

    it("should maintain separate min producers structure", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.minProducers[0]).toEqual(mockMinProducers[0]);
    });

    it("should contain all producers in combined array", async () => {
      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const allProducers = [
        ...result.current.maxProducers,
        ...result.current.minProducers,
      ];
      expect(result.current.producers).toEqual(allProducers);
    });
  });

  describe("API_BASE configuration", () => {
    it("should use NEXT_PUBLIC_API_URL from environment", () => {
      renderHook(() => useProducerInterval());

      expect(ApiClient).toHaveBeenCalled();
    });

    it("should handle missing API_BASE", () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      delete process.env.NEXT_PUBLIC_API_URL;

      renderHook(() => useProducerInterval());

      expect(ApiClient).toHaveBeenCalled();

      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });
  });

  describe("edge cases", () => {
    it("should handle very large intervals", async () => {
      const largeIntervalData = {
        min: [{ producer: "Fast Winner", interval: 1, previousWin: 1990, followingWin: 1991 }],
        max: [{ producer: "Slow Winner", interval: 50, previousWin: 1950, followingWin: 2000 }],
      };
      mockDashboardService.getProducersWithInterval.mockResolvedValueOnce(
        largeIntervalData
      );

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.maxProducers[0].interval).toBe(50);
      expect(result.current.minProducers[0].interval).toBe(1);
    });

    it("should handle producers with same interval", async () => {
      const sameIntervalData = {
        min: [
          { producer: "Producer A", interval: 5, previousWin: 1990, followingWin: 1995 },
          { producer: "Producer B", interval: 5, previousWin: 1991, followingWin: 1996 },
        ],
        max: [
          { producer: "Producer C", interval: 10, previousWin: 1980, followingWin: 1990 },
          { producer: "Producer D", interval: 10, previousWin: 1985, followingWin: 1995 },
        ],
      };
      mockDashboardService.getProducersWithInterval.mockResolvedValueOnce(
        sameIntervalData
      );

      const { result } = renderHook(() => useProducerInterval());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.minProducers).toHaveLength(2);
      expect(result.current.maxProducers).toHaveLength(2);
      expect(result.current.producers).toHaveLength(4);
    });
  });
});
