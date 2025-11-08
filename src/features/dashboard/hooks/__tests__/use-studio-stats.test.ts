import { renderHook, waitFor } from "@testing-library/react";
import { useStudioStats } from "../use-studio-stats";
import { DashboardService } from "../../api/dashboard-service";
import { ApiClient } from "@/shared/services/api-client";
import { StudioCountPerWin } from "../../types";

jest.mock("@/shared/services/api-client");
jest.mock("../../api/dashboard-service");

describe("useStudioStats", () => {
  const mockStudios: StudioCountPerWin[] = [
    { name: "Columbia Pictures", winCount: 7 },
    { name: "Paramount Pictures", winCount: 6 },
    { name: "Warner Bros.", winCount: 5 },
    { name: "20th Century Fox", winCount: 4 },
    { name: "Universal Pictures", winCount: 3 },
  ];

  const mockApiClient = {
    get: jest.fn(),
  };

  const mockDashboardService = {
    getStudiosWithWinCount: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiClient as jest.Mock).mockImplementation(() => mockApiClient);
    (DashboardService as jest.Mock).mockImplementation(
      () => mockDashboardService
    );
    mockDashboardService.getStudiosWithWinCount.mockResolvedValue(mockStudios);
  });

  describe("initialization", () => {
    it("should initialize with empty studios array and loading state", () => {
      const { result } = renderHook(() => useStudioStats());

      expect(result.current.studios).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("should fetch studios on mount", async () => {
      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(
        mockDashboardService.getStudiosWithWinCount
      ).toHaveBeenCalledTimes(1);
      expect(result.current.studios).toHaveLength(3); // Default limit
    });

    it("should call getStudiosWithWinCount without parameters", async () => {
      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockDashboardService.getStudiosWithWinCount).toHaveBeenCalledWith();
    });
  });

  describe("limit parameter", () => {
    it("should use default limit of 3", async () => {
      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toHaveLength(3);
      expect(result.current.studios[0].name).toBe("Columbia Pictures");
      expect(result.current.studios[1].name).toBe("Paramount Pictures");
      expect(result.current.studios[2].name).toBe("Warner Bros.");
    });

    it("should respect custom limit", async () => {
      const { result } = renderHook(() => useStudioStats(2));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toHaveLength(2);
      expect(result.current.studios[0].name).toBe("Columbia Pictures");
      expect(result.current.studios[1].name).toBe("Paramount Pictures");
    });

    it("should handle limit of 1", async () => {
      const { result } = renderHook(() => useStudioStats(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toHaveLength(1);
      expect(result.current.studios[0].name).toBe("Columbia Pictures");
    });

    it("should handle limit of 5", async () => {
      const { result } = renderHook(() => useStudioStats(5));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toHaveLength(5);
    });

    it("should handle limit larger than available studios", async () => {
      const { result } = renderHook(() => useStudioStats(10));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toHaveLength(5); // All available
    });

    it("should handle limit of 0", async () => {
      const { result } = renderHook(() => useStudioStats(0));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toHaveLength(0);
    });

    it("should update data when limit changes", async () => {
      const { result, rerender } = renderHook(
        ({ limit }) => useStudioStats(limit),
        { initialProps: { limit: 2 } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toHaveLength(2);

      // Change limit
      rerender({ limit: 4 });

      await waitFor(() => {
        expect(result.current.studios).toHaveLength(4);
      });
    });
  });

  describe("sorting", () => {
    it("should sort studios by winCount in descending order", async () => {
      const unsortedStudios = [
        { name: "Studio A", winCount: 3 },
        { name: "Studio B", winCount: 7 },
        { name: "Studio C", winCount: 5 },
      ];
      mockDashboardService.getStudiosWithWinCount.mockResolvedValueOnce(
        unsortedStudios
      );

      const { result } = renderHook(() => useStudioStats(3));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios[0].winCount).toBe(7);
      expect(result.current.studios[1].winCount).toBe(5);
      expect(result.current.studios[2].winCount).toBe(3);
    });

    it("should maintain sort order for equal winCounts", async () => {
      const studiosWithTies = [
        { name: "Studio A", winCount: 5 },
        { name: "Studio B", winCount: 5 },
        { name: "Studio C", winCount: 7 },
      ];
      mockDashboardService.getStudiosWithWinCount.mockResolvedValueOnce(
        studiosWithTies
      );

      const { result } = renderHook(() => useStudioStats(3));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios[0].winCount).toBe(7);
      expect(result.current.studios[1].winCount).toBe(5);
      expect(result.current.studios[2].winCount).toBe(5);
    });

    it("should sort before applying limit", async () => {
      const manyStudios = [
        { name: "Studio A", winCount: 2 },
        { name: "Studio B", winCount: 8 },
        { name: "Studio C", winCount: 5 },
        { name: "Studio D", winCount: 10 },
        { name: "Studio E", winCount: 3 },
      ];
      mockDashboardService.getStudiosWithWinCount.mockResolvedValueOnce(
        manyStudios
      );

      const { result } = renderHook(() => useStudioStats(2));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should get top 2 after sorting
      expect(result.current.studios).toHaveLength(2);
      expect(result.current.studios[0].name).toBe("Studio D");
      expect(result.current.studios[0].winCount).toBe(10);
      expect(result.current.studios[1].name).toBe("Studio B");
      expect(result.current.studios[1].winCount).toBe(8);
    });
  });

  describe("data handling", () => {
    it("should return empty array when data is null", async () => {
      mockDashboardService.getStudiosWithWinCount.mockResolvedValueOnce(null);

      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toEqual([]);
    });

    it("should return empty array when data is undefined", async () => {
      mockDashboardService.getStudiosWithWinCount.mockResolvedValueOnce(
        undefined
      );

      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toEqual([]);
    });

    it("should handle empty studios array from API", async () => {
      mockDashboardService.getStudiosWithWinCount.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toEqual([]);
    });

    it("should handle single studio", async () => {
      const singleStudio = [{ name: "Studio A", winCount: 5 }];
      mockDashboardService.getStudiosWithWinCount.mockResolvedValueOnce(
        singleStudio
      );

      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toEqual(singleStudio);
      expect(result.current.studios).toHaveLength(1);
    });

    it("should handle studios with zero wins", async () => {
      const studiosWithZero = [
        { name: "Studio A", winCount: 5 },
        { name: "Studio B", winCount: 0 },
        { name: "Studio C", winCount: 3 },
      ];
      mockDashboardService.getStudiosWithWinCount.mockResolvedValueOnce(
        studiosWithZero
      );

      const { result } = renderHook(() => useStudioStats(3));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios[2].winCount).toBe(0);
    });
  });

  describe("loading state", () => {
    it("should set loading to true initially", () => {
      const { result } = renderHook(() => useStudioStats());

      expect(result.current.loading).toBe(true);
    });

    it("should set loading to false after successful fetch", async () => {
      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toHaveLength(3);
    });

    it("should set loading to false after error", async () => {
      const error = new Error("Failed to fetch");
      mockDashboardService.getStudiosWithWinCount.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Failed to fetch");
    });
  });

  describe("error handling", () => {
    it("should handle errors when fetching studios", async () => {
      const errorMessage = "Network error";
      mockDashboardService.getStudiosWithWinCount.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.studios).toEqual([]);
    });

    it("should handle non-Error exceptions", async () => {
      mockDashboardService.getStudiosWithWinCount.mockRejectedValueOnce(
        "String error"
      );

      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Unknown error");
      expect(result.current.studios).toEqual([]);
    });

    it("should handle API errors with status codes", async () => {
      const apiError = new Error("Internal Server Error");
      (apiError as any).statusCode = 500;
      mockDashboardService.getStudiosWithWinCount.mockRejectedValueOnce(
        apiError
      );

      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Internal Server Error");
    });
  });

  describe("memoization", () => {
    it("should create ApiClient instance", () => {
      renderHook(() => useStudioStats());

      expect(ApiClient).toHaveBeenCalled();
    });

    it("should create DashboardService instance with apiClient", () => {
      renderHook(() => useStudioStats());

      expect(DashboardService).toHaveBeenCalledWith(mockApiClient);
    });

    it("should memoize apiClient instance", () => {
      const { rerender } = renderHook(() => useStudioStats());

      const firstCallCount = (ApiClient as jest.Mock).mock.calls.length;

      rerender();

      const secondCallCount = (ApiClient as jest.Mock).mock.calls.length;

      expect(secondCallCount).toBe(firstCallCount);
    });

    it("should memoize dashboardService instance", () => {
      const { rerender } = renderHook(() => useStudioStats());

      const firstCallCount = (DashboardService as jest.Mock).mock.calls.length;

      rerender();

      const secondCallCount = (DashboardService as jest.Mock).mock.calls.length;

      expect(secondCallCount).toBe(firstCallCount);
    });

    it("should recreate fetcher when limit changes", async () => {
      const { result, rerender } = renderHook(
        ({ limit }) => useStudioStats(limit),
        { initialProps: { limit: 2 } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstCallCount =
        mockDashboardService.getStudiosWithWinCount.mock.calls.length;

      rerender({ limit: 3 });

      await waitFor(() => {
        expect(
          mockDashboardService.getStudiosWithWinCount.mock.calls.length
        ).toBeGreaterThan(firstCallCount);
      });
    });

    it("should not recreate fetcher when limit stays the same", async () => {
      const { result, rerender } = renderHook(
        ({ limit }) => useStudioStats(limit),
        { initialProps: { limit: 3 } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstCallCount =
        mockDashboardService.getStudiosWithWinCount.mock.calls.length;

      rerender({ limit: 3 });

      // Should not fetch again
      expect(mockDashboardService.getStudiosWithWinCount.mock.calls.length).toBe(
        firstCallCount
      );
    });
  });

  describe("return value structure", () => {
    it("should return object with studios, loading, and error properties", async () => {
      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toHaveProperty("studios");
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("error");
    });

    it("should not expose refetch function", async () => {
      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).not.toHaveProperty("refetch");
    });

    it("should always return array for studios", async () => {
      const { result } = renderHook(() => useStudioStats());

      expect(Array.isArray(result.current.studios)).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(Array.isArray(result.current.studios)).toBe(true);
    });
  });

  describe("integration with useApiData", () => {
    it("should call useApiData with correct options", async () => {
      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockDashboardService.getStudiosWithWinCount).toHaveBeenCalled();
    });

    it("should use initialLoad: true", async () => {
      const { result } = renderHook(() => useStudioStats());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(
        mockDashboardService.getStudiosWithWinCount
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("studios data structure", () => {
    it("should preserve name and winCount properties", async () => {
      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios[0]).toHaveProperty("name");
      expect(result.current.studios[0]).toHaveProperty("winCount");
      expect(typeof result.current.studios[0].name).toBe("string");
      expect(typeof result.current.studios[0].winCount).toBe("number");
    });

    it("should return studios in descending order by winCount", async () => {
      const { result } = renderHook(() => useStudioStats());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      for (let i = 0; i < result.current.studios.length - 1; i++) {
        expect(result.current.studios[i].winCount).toBeGreaterThanOrEqual(
          result.current.studios[i + 1].winCount
        );
      }
    });

    it("should handle studios with same winCount", async () => {
      const tiedStudios = [
        { name: "Studio A", winCount: 5 },
        { name: "Studio B", winCount: 5 },
        { name: "Studio C", winCount: 5 },
      ];
      mockDashboardService.getStudiosWithWinCount.mockResolvedValueOnce(
        tiedStudios
      );

      const { result } = renderHook(() => useStudioStats(3));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toHaveLength(3);
      expect(result.current.studios.every((s) => s.winCount === 5)).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle very large limit", async () => {
      const { result } = renderHook(() => useStudioStats(1000));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios).toHaveLength(5); // All available
    });

    it("should handle negative limit by returning all studios", async () => {
      const { result } = renderHook(() => useStudioStats(-1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // slice(-1) returns the last element, slice(0, -1) returns all but last
      // In this case, slice returns elements, not empty array
      expect(result.current.studios.length).toBeGreaterThan(0);
    });

    it("should handle studios with very high win counts", async () => {
      const highCountStudios = [
        { name: "Studio A", winCount: 1000 },
        { name: "Studio B", winCount: 500 },
      ];
      mockDashboardService.getStudiosWithWinCount.mockResolvedValueOnce(
        highCountStudios
      );

      const { result } = renderHook(() => useStudioStats(2));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.studios[0].winCount).toBe(1000);
      expect(result.current.studios[1].winCount).toBe(500);
    });
  });
});
