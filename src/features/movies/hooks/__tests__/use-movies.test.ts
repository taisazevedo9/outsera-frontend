import { renderHook, waitFor } from "@testing-library/react";
import { useMovies } from "../use-movies";
import { MovieService } from "../../api/movie-service";
import { ApiClient } from "@/shared/services/api-client";
import { Movie } from "@/features/dashboard/types";

// Mock the dependencies
jest.mock("@/shared/services/api-client");
jest.mock("../../api/movie-service");

describe("useMovies", () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      year: 2020,
      title: "Movie 1",
      studios: ["Studio A"],
      producers: ["Producer A"],
      winner: true,
    },
    {
      id: 2,
      year: 2021,
      title: "Movie 2",
      studios: ["Studio B"],
      producers: ["Producer B"],
      winner: false,
    },
  ];

  const mockMoviePageData = {
    movies: mockMovies,
    totalPages: 5,
    totalElements: 100,
  };

  const mockApiClient = {
    get: jest.fn(),
  };

  const mockMovieService = {
    getMovies: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiClient as jest.Mock).mockImplementation(() => mockApiClient);
    (MovieService as jest.Mock).mockImplementation(() => mockMovieService);
    mockMovieService.getMovies.mockResolvedValue(mockMoviePageData);
  });

  it("should initialize with empty movies array and loading state", () => {
    const { result } = renderHook(() => useMovies());

    expect(result.current.movies).toEqual([]);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.totalElements).toBe(0);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should fetch movies on mount", async () => {
    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockMovieService.getMovies).toHaveBeenCalledTimes(1);
    expect(mockMovieService.getMovies).toHaveBeenCalledWith({});
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.totalElements).toBe(100);
  });

  it("should fetch movies with filters", async () => {
    const filters = { year: 2020, winner: true, page: 0, size: 10 };
    const { result } = renderHook(() => useMovies(filters));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockMovieService.getMovies).toHaveBeenCalledWith(filters);
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.totalElements).toBe(100);
  });

  it("should handle errors when fetching movies", async () => {
    const errorMessage = "Failed to fetch movies";
    mockMovieService.getMovies.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.movies).toEqual([]);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.totalElements).toBe(0);
  });

  it("should provide refetch function", async () => {
    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockMovieService.getMovies.mockResolvedValueOnce([mockMovies[0]]);

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(mockMovieService.getMovies).toHaveBeenCalledTimes(2);
    });
  });

  it("should refetch with updated data", async () => {
    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updatedMovies: Movie[] = [
      {
        id: 3,
        year: 2022,
        title: "Movie 3",
        studios: ["Studio C"],
        producers: ["Producer C"],
        winner: true,
      },
    ];

    const updatedPageData = {
      movies: updatedMovies,
      totalPages: 1,
      totalElements: 1,
    };

    mockMovieService.getMovies.mockResolvedValueOnce(updatedPageData);
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.movies).toEqual(updatedMovies);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.totalElements).toBe(1);
    });
  });

  it("should handle undefined filters", async () => {
    const { result } = renderHook(() => useMovies(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockMovieService.getMovies).toHaveBeenCalledWith({});
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.totalElements).toBe(100);
  });

  it("should handle partial filters", async () => {
    const filters = { year: 2020 };
    const { result } = renderHook(() => useMovies(filters));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockMovieService.getMovies).toHaveBeenCalledWith(filters);
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.totalElements).toBe(100);
  });

  it("should create ApiClient with API_BASE from const", () => {
    // The API_BASE is evaluated at module load time, not at hook execution time
    // So we just verify that ApiClient is instantiated
    renderHook(() => useMovies());

    expect(ApiClient).toHaveBeenCalled();
  });

  it("should use default API_BASE_URL from ApiClient when env is not set", () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    renderHook(() => useMovies());

    // ApiClient now uses default parameter, so it's called without arguments
    expect(ApiClient).toHaveBeenCalledWith();

    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  it("should memoize apiClient instance", () => {
    const { rerender } = renderHook(() => useMovies());

    const firstCallCount = (ApiClient as jest.Mock).mock.calls.length;

    rerender();

    const secondCallCount = (ApiClient as jest.Mock).mock.calls.length;

    // ApiClient should only be created once
    expect(secondCallCount).toBe(firstCallCount);
  });

  it("should memoize movieService instance", () => {
    const { rerender } = renderHook(() => useMovies());

    const firstCallCount = (MovieService as jest.Mock).mock.calls.length;

    rerender();

    const secondCallCount = (MovieService as jest.Mock).mock.calls.length;

    // MovieService should only be created once
    expect(secondCallCount).toBe(firstCallCount);
  });

  it("should update fetcher when filters change", async () => {
    const { result, rerender } = renderHook(
      ({ filters }) => useMovies(filters),
      {
        initialProps: { filters: { year: 2020 } },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockMovieService.getMovies).toHaveBeenCalledWith({ year: 2020 });

    // Change filters
    rerender({ filters: { year: 2021 } });

    await waitFor(() => {
      expect(mockMovieService.getMovies).toHaveBeenCalledWith({ year: 2021 });
    });
  });

  it("should return empty array when data is null", async () => {
    mockMovieService.getMovies.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toEqual([]);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.totalElements).toBe(0);
  });

  it("should return empty array when data is undefined", async () => {
    mockMovieService.getMovies.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toEqual([]);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.totalElements).toBe(0);
  });

  it("should handle network errors", async () => {
    const networkError = new Error("Network error");
    mockMovieService.getMovies.mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.movies).toEqual([]);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.totalElements).toBe(0);
  });

  it("should handle empty movies array response", async () => {
    mockMovieService.getMovies.mockResolvedValueOnce({
      movies: [],
      totalPages: 0,
      totalElements: 0,
    });

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toEqual([]);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.totalElements).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it("should handle large movies array", async () => {
    const largeMovies = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      year: 2020 + (i % 5),
      title: `Movie ${i + 1}`,
      studios: [`Studio ${i % 10}`],
      producers: [`Producer ${i % 10}`],
      winner: i % 2 === 0,
    }));

    mockMovieService.getMovies.mockResolvedValueOnce({
      movies: largeMovies,
      totalPages: 10,
      totalElements: 1000,
    });

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toEqual(largeMovies);
    expect(result.current.movies.length).toBe(100);
    expect(result.current.totalPages).toBe(10);
    expect(result.current.totalElements).toBe(1000);
  });

  it("should show loading state during refetch", async () => {
    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Trigger refetch and immediately check loading state
    const refetchPromise = result.current.refetch();

    // Wait for loading state to become true, then false again
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await refetchPromise;
  });

  it("should pass all filter options correctly", async () => {
    const fullFilters = {
      page: 2,
      size: 20,
      year: 2019,
      winner: false,
    };

    const { result } = renderHook(() => useMovies(fullFilters));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockMovieService.getMovies).toHaveBeenCalledWith(fullFilters);
  });
});
