import { renderHook, waitFor } from "@testing-library/react";
import { useYearWinners } from "../use-year-winners";
import { DashboardService } from "../../api/dashboard-service";
import { ApiClient } from "@/shared/services/api-client";
import { YearWithMultipleWinners } from "../../types";

jest.mock("@/shared/services/api-client");
jest.mock("../../api/dashboard-service");

describe("useYearWinners", () => {
  const mockYears: YearWithMultipleWinners[] = [
    { year: 1986, winnerCount: 2 },
    { year: 1990, winnerCount: 2 },
    { year: 2000, winnerCount: 3 },
  ];

  const mockApiClient = {
    get: jest.fn(),
  };

  const mockDashboardService = {
    getYearsWithMultipleWinners: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiClient as jest.Mock).mockImplementation(() => mockApiClient);
    (DashboardService as jest.Mock).mockImplementation(
      () => mockDashboardService
    );
    mockDashboardService.getYearsWithMultipleWinners.mockResolvedValue(
      mockYears
    );
  });

  describe("initialization", () => {
    it("should initialize with empty years array and loading state", () => {
      const { result } = renderHook(() => useYearWinners());

      expect(result.current.years).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("should fetch years on mount", async () => {
      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(
        mockDashboardService.getYearsWithMultipleWinners
      ).toHaveBeenCalledTimes(1);
      expect(result.current.years).toEqual(mockYears);
    });

    it("should call getYearsWithMultipleWinners without parameters", async () => {
      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(
        mockDashboardService.getYearsWithMultipleWinners
      ).toHaveBeenCalledWith();
    });
  });

  describe("data handling", () => {
    it("should update years when data is fetched", async () => {
      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.years).toEqual(mockYears);
      expect(result.current.years).toHaveLength(3);
    });

    it("should return empty array when data is null", async () => {
      mockDashboardService.getYearsWithMultipleWinners.mockResolvedValueOnce(
        null
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.years).toEqual([]);
    });

    it("should return empty array when data is undefined", async () => {
      mockDashboardService.getYearsWithMultipleWinners.mockResolvedValueOnce(
        undefined
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.years).toEqual([]);
    });

    it("should handle empty years array from API", async () => {
      mockDashboardService.getYearsWithMultipleWinners.mockResolvedValueOnce(
        []
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.years).toEqual([]);
    });

    it("should handle single year", async () => {
      const singleYear = [{ year: 1986, winnerCount: 2 }];
      mockDashboardService.getYearsWithMultipleWinners.mockResolvedValueOnce(
        singleYear
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.years).toEqual(singleYear);
      expect(result.current.years).toHaveLength(1);
    });

    it("should handle large datasets", async () => {
      const largeDataset = Array.from({ length: 50 }, (_, i) => ({
        year: 1970 + i,
        winnerCount: 2,
      }));
      mockDashboardService.getYearsWithMultipleWinners.mockResolvedValueOnce(
        largeDataset
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.years).toEqual(largeDataset);
      expect(result.current.years).toHaveLength(50);
    });
  });

  describe("loading state", () => {
    it("should set loading to true initially", () => {
      const { result } = renderHook(() => useYearWinners());

      expect(result.current.loading).toBe(true);
    });

    it("should set loading to false after successful fetch", async () => {
      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.years).toEqual(mockYears);
    });

    it("should set loading to false after error", async () => {
      const error = new Error("Failed to fetch");
      mockDashboardService.getYearsWithMultipleWinners.mockRejectedValueOnce(
        error
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Failed to fetch");
    });
  });

  describe("error handling", () => {
    it("should handle errors when fetching years", async () => {
      const errorMessage = "Network error";
      mockDashboardService.getYearsWithMultipleWinners.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.years).toEqual([]);
    });

    it("should handle non-Error exceptions", async () => {
      mockDashboardService.getYearsWithMultipleWinners.mockRejectedValueOnce(
        "String error"
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Unknown error");
      expect(result.current.years).toEqual([]);
    });

    it("should handle API errors with status codes", async () => {
      const apiError = new Error("Not Found");
      (apiError as any).statusCode = 404;
      mockDashboardService.getYearsWithMultipleWinners.mockRejectedValueOnce(
        apiError
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Not Found");
    });

    it("should handle server errors", async () => {
      const serverError = new Error("Internal Server Error");
      mockDashboardService.getYearsWithMultipleWinners.mockRejectedValueOnce(
        serverError
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Internal Server Error");
    });
  });

  describe("memoization", () => {
    it("should create ApiClient instance", () => {
      renderHook(() => useYearWinners());

      expect(ApiClient).toHaveBeenCalled();
    });

    it("should create DashboardService instance with apiClient", () => {
      renderHook(() => useYearWinners());

      expect(DashboardService).toHaveBeenCalledWith(mockApiClient);
    });

    it("should memoize apiClient instance", () => {
      const { rerender } = renderHook(() => useYearWinners());

      const firstCallCount = (ApiClient as jest.Mock).mock.calls.length;

      rerender();

      const secondCallCount = (ApiClient as jest.Mock).mock.calls.length;

      expect(secondCallCount).toBe(firstCallCount);
    });

    it("should memoize dashboardService instance", () => {
      const { rerender } = renderHook(() => useYearWinners());

      const firstCallCount = (DashboardService as jest.Mock).mock.calls.length;

      rerender();

      const secondCallCount = (DashboardService as jest.Mock).mock.calls.length;

      expect(secondCallCount).toBe(firstCallCount);
    });

    it("should memoize fetcher callback", async () => {
      const { rerender, result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstCallCount =
        mockDashboardService.getYearsWithMultipleWinners.mock.calls.length;

      rerender();

      const secondCallCount =
        mockDashboardService.getYearsWithMultipleWinners.mock.calls.length;

      // Should not fetch again on rerender
      expect(secondCallCount).toBe(firstCallCount);
    });
  });

  describe("return value structure", () => {
    it("should return object with years, loading, and error properties", async () => {
      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toHaveProperty("years");
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("error");
    });

    it("should not expose refetch function", async () => {
      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).not.toHaveProperty("refetch");
    });

    it("should always return array for years", async () => {
      const { result } = renderHook(() => useYearWinners());

      expect(Array.isArray(result.current.years)).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(Array.isArray(result.current.years)).toBe(true);
    });
  });

  describe("API_BASE configuration", () => {
    it("should use API_BASE from environment", () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";

      renderHook(() => useYearWinners());

      // ApiClient is called but we can't directly test the API_BASE
      // since it's evaluated at module load time
      expect(ApiClient).toHaveBeenCalled();

      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });
  });

  describe("integration with useApiData", () => {
    it("should call useApiData with correct options", async () => {
      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify that data was fetched (useApiData with initialLoad: true)
      expect(
        mockDashboardService.getYearsWithMultipleWinners
      ).toHaveBeenCalled();
    });

    it("should use initialLoad: true", async () => {
      const { result } = renderHook(() => useYearWinners());

      // Should start fetching immediately
      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(
        mockDashboardService.getYearsWithMultipleWinners
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("years data structure", () => {
    it("should preserve year and winnerCount properties", async () => {
      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.years[0]).toHaveProperty("year");
      expect(result.current.years[0]).toHaveProperty("winnerCount");
      expect(typeof result.current.years[0].year).toBe("number");
      expect(typeof result.current.years[0].winnerCount).toBe("number");
    });

    it("should maintain order of years from API", async () => {
      const orderedYears = [
        { year: 2000, winnerCount: 3 },
        { year: 1990, winnerCount: 2 },
        { year: 1986, winnerCount: 2 },
      ];
      mockDashboardService.getYearsWithMultipleWinners.mockResolvedValueOnce(
        orderedYears
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.years[0].year).toBe(2000);
      expect(result.current.years[1].year).toBe(1990);
      expect(result.current.years[2].year).toBe(1986);
    });

    it("should handle years with different winner counts", async () => {
      const mixedCounts = [
        { year: 1986, winnerCount: 2 },
        { year: 1990, winnerCount: 5 },
        { year: 2000, winnerCount: 3 },
      ];
      mockDashboardService.getYearsWithMultipleWinners.mockResolvedValueOnce(
        mixedCounts
      );

      const { result } = renderHook(() => useYearWinners());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.years[0].winnerCount).toBe(2);
      expect(result.current.years[1].winnerCount).toBe(5);
      expect(result.current.years[2].winnerCount).toBe(3);
    });
  });
});
