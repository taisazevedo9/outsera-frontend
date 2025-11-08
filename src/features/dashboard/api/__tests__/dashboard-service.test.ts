import { DashboardService } from "../dashboard-service";
import { ApiClient } from "@/shared/services/api-client";
import {
  YearWithMultipleWinners,
  YearsWithMultipleWinnersResponse,
  StudioCountPerWin,
  StudiosWithWinCountResponse,
  ProducerWithInterval,
  MaxMinWinIntervalForProducersResponse,
} from "../../types";

jest.mock("@/shared/services/api-client");

describe("DashboardService", () => {
  let dashboardService: DashboardService;
  let mockApiClient: jest.Mocked<ApiClient>;

  const mockYears: YearWithMultipleWinners[] = [
    { year: 1986, winnerCount: 2 },
    { year: 1990, winnerCount: 2 },
  ];

  const mockYearsResponse: YearsWithMultipleWinnersResponse = {
    years: mockYears,
  };

  const mockStudios: StudioCountPerWin[] = [
    { name: "Columbia Pictures", winCount: 7 },
    { name: "Paramount Pictures", winCount: 6 },
    { name: "Warner Bros.", winCount: 5 },
  ];

  const mockStudiosResponse: StudiosWithWinCountResponse = {
    studios: mockStudios,
  };

  const mockProducers: MaxMinWinIntervalForProducersResponse = {
    min: [
      {
        producer: "Joel Silver",
        interval: 1,
        previousWin: 1990,
        followingWin: 1991,
      },
    ],
    max: [
      {
        producer: "Matthew Vaughn",
        interval: 13,
        previousWin: 2002,
        followingWin: 2015,
      },
    ],
  };

  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
    } as any;

    dashboardService = new DashboardService(mockApiClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getYearsWithMultipleWinners", () => {
    it("should fetch years with multiple winners", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockYearsResponse);

      const result = await dashboardService.getYearsWithMultipleWinners();

      expect(mockApiClient.get).toHaveBeenCalledTimes(1);
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/movies/yearsWithMultipleWinners"
      );
      expect(result).toEqual(mockYears);
    });

    it("should return only years array from response", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockYearsResponse);

      const result = await dashboardService.getYearsWithMultipleWinners();

      expect(result).toEqual(mockYears);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle empty years array", async () => {
      const emptyResponse: YearsWithMultipleWinnersResponse = {
        years: [],
      };
      mockApiClient.get.mockResolvedValueOnce(emptyResponse);

      const result = await dashboardService.getYearsWithMultipleWinners();

      expect(result).toEqual([]);
    });

    it("should call correct endpoint without parameters", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockYearsResponse);

      await dashboardService.getYearsWithMultipleWinners();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/movies/yearsWithMultipleWinners"
      );
      expect(mockApiClient.get.mock.calls[0].length).toBe(1); // No second parameter
    });

    it("should propagate errors from apiClient", async () => {
      const error = new Error("Network error");
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(
        dashboardService.getYearsWithMultipleWinners()
      ).rejects.toThrow("Network error");
    });

    it("should handle years with different winner counts", async () => {
      const multipleResponse: YearsWithMultipleWinnersResponse = {
        years: [
          { year: 1986, winnerCount: 2 },
          { year: 1990, winnerCount: 3 },
          { year: 2000, winnerCount: 5 },
        ],
      };
      mockApiClient.get.mockResolvedValueOnce(multipleResponse);

      const result = await dashboardService.getYearsWithMultipleWinners();

      expect(result).toHaveLength(3);
      expect(result[0].winnerCount).toBe(2);
      expect(result[1].winnerCount).toBe(3);
      expect(result[2].winnerCount).toBe(5);
    });
  });

  describe("getStudiosWithWinCount", () => {
    it("should fetch studios without limit", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockStudiosResponse);

      const result = await dashboardService.getStudiosWithWinCount();

      expect(mockApiClient.get).toHaveBeenCalledTimes(1);
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/movies/studiosWithWinCount",
        {
          params: undefined,
        }
      );
      expect(result).toEqual(mockStudios);
    });

    it("should fetch studios with limit", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockStudiosResponse);

      const result = await dashboardService.getStudiosWithWinCount(3);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/movies/studiosWithWinCount",
        {
          params: { limit: 3 },
        }
      );
      expect(result).toEqual(mockStudios);
    });

    it("should handle limit of 1", async () => {
      const singleStudio: StudiosWithWinCountResponse = {
        studios: [mockStudios[0]],
      };
      mockApiClient.get.mockResolvedValueOnce(singleStudio);

      const result = await dashboardService.getStudiosWithWinCount(1);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/movies/studiosWithWinCount",
        {
          params: { limit: 1 },
        }
      );
      expect(result).toHaveLength(1);
    });

    it("should handle limit of 0", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockStudiosResponse);

      await dashboardService.getStudiosWithWinCount(0);

      // 0 is falsy, so params should be undefined
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/movies/studiosWithWinCount",
        {
          params: undefined,
        }
      );
    });

    it("should handle large limit numbers", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockStudiosResponse);

      await dashboardService.getStudiosWithWinCount(100);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/movies/studiosWithWinCount",
        {
          params: { limit: 100 },
        }
      );
    });

    it("should return only studios array from response", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockStudiosResponse);

      const result = await dashboardService.getStudiosWithWinCount();

      expect(result).toEqual(mockStudios);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle empty studios array", async () => {
      const emptyResponse: StudiosWithWinCountResponse = {
        studios: [],
      };
      mockApiClient.get.mockResolvedValueOnce(emptyResponse);

      const result = await dashboardService.getStudiosWithWinCount();

      expect(result).toEqual([]);
    });

    it("should propagate errors from apiClient", async () => {
      const error = new Error("Server error");
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(dashboardService.getStudiosWithWinCount()).rejects.toThrow(
        "Server error"
      );
    });

    it("should handle studios with different win counts", async () => {
      const studiosResponse: StudiosWithWinCountResponse = {
        studios: [
          { name: "Studio A", winCount: 10 },
          { name: "Studio B", winCount: 5 },
          { name: "Studio C", winCount: 1 },
        ],
      };
      mockApiClient.get.mockResolvedValueOnce(studiosResponse);

      const result = await dashboardService.getStudiosWithWinCount();

      expect(result).toHaveLength(3);
      expect(result[0].winCount).toBe(10);
      expect(result[1].winCount).toBe(5);
      expect(result[2].winCount).toBe(1);
    });
  });

  describe("getProducersWithInterval", () => {
    it("should fetch producers with intervals", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const result = await dashboardService.getProducersWithInterval();

      expect(mockApiClient.get).toHaveBeenCalledTimes(1);
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/movies/maxMinWinIntervalForProducers"
      );
      expect(result).toEqual({
        min: mockProducers.min,
        max: mockProducers.max,
      });
    });

    it("should return object with min and max properties", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const result = await dashboardService.getProducersWithInterval();

      expect(result).toHaveProperty("min");
      expect(result).toHaveProperty("max");
      expect(Array.isArray(result.min)).toBe(true);
      expect(Array.isArray(result.max)).toBe(true);
    });

    it("should handle empty min array", async () => {
      const response: MaxMinWinIntervalForProducersResponse = {
        min: [],
        max: mockProducers.max,
      };
      mockApiClient.get.mockResolvedValueOnce(response);

      const result = await dashboardService.getProducersWithInterval();

      expect(result.min).toEqual([]);
      expect(result.max).toEqual(mockProducers.max);
    });

    it("should handle empty max array", async () => {
      const response: MaxMinWinIntervalForProducersResponse = {
        min: mockProducers.min,
        max: [],
      };
      mockApiClient.get.mockResolvedValueOnce(response);

      const result = await dashboardService.getProducersWithInterval();

      expect(result.min).toEqual(mockProducers.min);
      expect(result.max).toEqual([]);
    });

    it("should handle both arrays empty", async () => {
      const response: MaxMinWinIntervalForProducersResponse = {
        min: [],
        max: [],
      };
      mockApiClient.get.mockResolvedValueOnce(response);

      const result = await dashboardService.getProducersWithInterval();

      expect(result.min).toEqual([]);
      expect(result.max).toEqual([]);
    });

    it("should handle multiple producers in min", async () => {
      const response: MaxMinWinIntervalForProducersResponse = {
        min: [
          {
            producer: "Producer A",
            interval: 1,
            previousWin: 1990,
            followingWin: 1991,
          },
          {
            producer: "Producer B",
            interval: 1,
            previousWin: 2000,
            followingWin: 2001,
          },
        ],
        max: mockProducers.max,
      };
      mockApiClient.get.mockResolvedValueOnce(response);

      const result = await dashboardService.getProducersWithInterval();

      expect(result.min).toHaveLength(2);
      expect(result.min[0].interval).toBe(1);
      expect(result.min[1].interval).toBe(1);
    });

    it("should handle multiple producers in max", async () => {
      const response: MaxMinWinIntervalForProducersResponse = {
        min: mockProducers.min,
        max: [
          {
            producer: "Producer X",
            interval: 13,
            previousWin: 2002,
            followingWin: 2015,
          },
          {
            producer: "Producer Y",
            interval: 13,
            previousWin: 1990,
            followingWin: 2003,
          },
        ],
      };
      mockApiClient.get.mockResolvedValueOnce(response);

      const result = await dashboardService.getProducersWithInterval();

      expect(result.max).toHaveLength(2);
      expect(result.max[0].interval).toBe(13);
      expect(result.max[1].interval).toBe(13);
    });

    it("should call correct endpoint without parameters", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      await dashboardService.getProducersWithInterval();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/movies/maxMinWinIntervalForProducers"
      );
      expect(mockApiClient.get.mock.calls[0].length).toBe(1); // No second parameter
    });

    it("should propagate errors from apiClient", async () => {
      const error = new Error("API error");
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(dashboardService.getProducersWithInterval()).rejects.toThrow(
        "API error"
      );
    });

    it("should preserve producer data structure", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const result = await dashboardService.getProducersWithInterval();

      expect(result.min[0]).toHaveProperty("producer");
      expect(result.min[0]).toHaveProperty("interval");
      expect(result.min[0]).toHaveProperty("previousWin");
      expect(result.min[0]).toHaveProperty("followingWin");
    });
  });

  describe("constructor", () => {
    it("should create instance with apiClient", () => {
      const service = new DashboardService(mockApiClient);
      expect(service).toBeInstanceOf(DashboardService);
    });

    it("should store apiClient as private property", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockYearsResponse);

      await dashboardService.getYearsWithMultipleWinners();

      expect(mockApiClient.get).toHaveBeenCalled();
    });
  });

  describe("integration", () => {
    it("should call different endpoints for each method", async () => {
      mockApiClient.get
        .mockResolvedValueOnce(mockYearsResponse)
        .mockResolvedValueOnce(mockStudiosResponse)
        .mockResolvedValueOnce(mockProducers);

      await dashboardService.getYearsWithMultipleWinners();
      await dashboardService.getStudiosWithWinCount();
      await dashboardService.getProducersWithInterval();

      expect(mockApiClient.get).toHaveBeenCalledTimes(3);
      expect(mockApiClient.get.mock.calls[0][0]).toBe(
        "/api/movies/yearsWithMultipleWinners"
      );
      expect(mockApiClient.get.mock.calls[1][0]).toBe(
        "/api/movies/studiosWithWinCount"
      );
      expect(mockApiClient.get.mock.calls[2][0]).toBe(
        "/api/movies/maxMinWinIntervalForProducers"
      );
    });

    it("should handle multiple sequential calls to same method", async () => {
      mockApiClient.get.mockResolvedValue(mockYearsResponse);

      await dashboardService.getYearsWithMultipleWinners();
      await dashboardService.getYearsWithMultipleWinners();

      expect(mockApiClient.get).toHaveBeenCalledTimes(2);
    });

    it("should handle concurrent calls", async () => {
      mockApiClient.get
        .mockResolvedValueOnce(mockYearsResponse)
        .mockResolvedValueOnce(mockStudiosResponse)
        .mockResolvedValueOnce(mockProducers);

      const promises = [
        dashboardService.getYearsWithMultipleWinners(),
        dashboardService.getStudiosWithWinCount(3),
        dashboardService.getProducersWithInterval(),
      ];

      await Promise.all(promises);

      expect(mockApiClient.get).toHaveBeenCalledTimes(3);
    });

    it("should maintain independent state for each method", async () => {
      mockApiClient.get
        .mockResolvedValueOnce(mockYearsResponse)
        .mockResolvedValueOnce(mockStudiosResponse);

      const yearsResult = await dashboardService.getYearsWithMultipleWinners();
      const studiosResult = await dashboardService.getStudiosWithWinCount(5);

      expect(yearsResult).toEqual(mockYears);
      expect(studiosResult).toEqual(mockStudios);
      expect(yearsResult).not.toEqual(studiosResult);
    });
  });
});
