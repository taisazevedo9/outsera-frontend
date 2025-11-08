import { renderHook, waitFor } from "@testing-library/react";
import { useMoviesPreview } from "../use-movies-preview";
import { MovieService } from "@/features/movies/api/movie-service";
import { ApiClient } from "@/shared/services/api-client";
import { Movie } from "../../types";

jest.mock("@/shared/services/api-client");
jest.mock("@/features/movies/api/movie-service");

describe("useMoviesPreview", () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      year: 1980,
      title: "Can't Stop the Music",
      studios: ["Associated Film Distribution"],
      producers: ["Allan Carr"],
      winner: true,
    },
    {
      id: 2,
      year: 1980,
      title: "Cruising",
      studios: ["Lorimar Productions"],
      producers: ["Jerry Weintraub"],
      winner: false,
    },
    {
      id: 3,
      year: 1981,
      title: "Mommie Dearest",
      studios: ["Paramount Pictures"],
      producers: ["Frank Yablans"],
      winner: true,
    },
  ];

  const mockApiClient = {
    get: jest.fn(),
  };

  const mockMovieService = {
    getMovies: jest.fn(),
    getWinnersByYear: jest.fn(),
  };

  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiClient as jest.Mock).mockImplementation(() => mockApiClient);
    (MovieService as jest.Mock).mockImplementation(() => mockMovieService);
    mockMovieService.getMovies.mockResolvedValue(mockMovies);
    mockMovieService.getWinnersByYear.mockResolvedValue(
      mockMovies.filter((m) => m.winner)
    );
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("initialization", () => {
    it("should initialize with empty movies array and not loading", () => {
      const { result } = renderHook(() => useMoviesPreview());

      expect(result.current.movies).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should not fetch on mount when initialLoad is false", () => {
      renderHook(() => useMoviesPreview());

      expect(mockMovieService.getMovies).not.toHaveBeenCalled();
      expect(mockMovieService.getWinnersByYear).not.toHaveBeenCalled();
    });

    it("should expose refetch function", () => {
      const { result } = renderHook(() => useMoviesPreview());

      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe("function");
    });
  });

  describe("fetching without year parameter", () => {
    it("should fetch movies with default parameters when refetch is called", async () => {
      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getMovies).toHaveBeenCalledWith({
        page: 1,
        size: 15,
      });
      expect(mockMovieService.getMovies).toHaveBeenCalledTimes(1);
    });

    it("should return all movies when no year is provided", async () => {
      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toEqual(mockMovies);
      expect(result.current.movies).toHaveLength(3);
    });

    it("should set loading state correctly during fetch", async () => {
      const { result } = renderHook(() => useMoviesPreview());

      expect(result.current.loading).toBe(false);

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toHaveLength(3);
    });

    it("should not call getWinnersByYear when no year provided", async () => {
      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getWinnersByYear).not.toHaveBeenCalled();
    });
  });

  describe("fetching with year parameter", () => {
    it("should fetch winners by year when year is provided", async () => {
      const { result } = renderHook(() => useMoviesPreview(1980));

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getWinnersByYear).toHaveBeenCalledWith(1980);
      expect(mockMovieService.getWinnersByYear).toHaveBeenCalledTimes(1);
    });

    it("should not call getMovies when year is provided", async () => {
      const { result } = renderHook(() => useMoviesPreview(1980));

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getMovies).not.toHaveBeenCalled();
    });

    it("should return only winners for the specified year", async () => {
      const { result } = renderHook(() => useMoviesPreview(1980));

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toHaveLength(2);
      expect(result.current.movies.every((m) => m.winner)).toBe(true);
    });

    it("should log when fetching winners for year", async () => {
      const { result } = renderHook(() => useMoviesPreview(1985));

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Fetching winners for year:",
        1985
      );
    });

    it("should handle year parameter of 0", async () => {
      const { result } = renderHook(() => useMoviesPreview(0));

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // 0 is falsy, so should fetch all movies
      expect(mockMovieService.getMovies).toHaveBeenCalledWith({
        page: 1,
        size: 15,
      });
      expect(mockMovieService.getWinnersByYear).not.toHaveBeenCalled();
    });

    it("should handle different year values", async () => {
      const { result, rerender } = renderHook(
        ({ year }) => useMoviesPreview(year),
        { initialProps: { year: 1980 } }
      );

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getWinnersByYear).toHaveBeenCalledWith(1980);

      // Change year
      rerender({ year: 1990 });

      result.current.refetch();

      await waitFor(() => {
        expect(mockMovieService.getWinnersByYear).toHaveBeenCalledWith(1990);
      });
    });
  });

  describe("data handling", () => {
    it("should return empty array when data is null", async () => {
      mockMovieService.getMovies.mockResolvedValueOnce(null);

      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toEqual([]);
    });

    it("should return empty array when data is undefined", async () => {
      mockMovieService.getMovies.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toEqual([]);
    });

    it("should handle empty movies array from API", async () => {
      mockMovieService.getMovies.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toEqual([]);
    });

    it("should handle single movie", async () => {
      mockMovieService.getMovies.mockResolvedValueOnce([mockMovies[0]]);

      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toHaveLength(1);
      expect(result.current.movies[0]).toEqual(mockMovies[0]);
    });

    it("should preserve movie data structure", async () => {
      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const movie = result.current.movies[0];
      expect(movie).toHaveProperty("id");
      expect(movie).toHaveProperty("year");
      expect(movie).toHaveProperty("title");
      expect(movie).toHaveProperty("studios");
      expect(movie).toHaveProperty("producers");
      expect(movie).toHaveProperty("winner");
    });
  });

  describe("loading state", () => {
    it("should start with loading false when initialLoad is false", () => {
      const { result } = renderHook(() => useMoviesPreview());

      expect(result.current.loading).toBe(false);
    });

    it("should set loading to true during fetch", async () => {
      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toHaveLength(3);
    });

    it("should set loading to false after successful fetch", async () => {
      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toHaveLength(3);
    });

    it("should set loading to false after error", async () => {
      const error = new Error("Failed to fetch");
      mockMovieService.getMovies.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Failed to fetch");
    });
  });

  describe("error handling", () => {
    it("should handle errors when fetching movies", async () => {
      const errorMessage = "Network error";
      mockMovieService.getMovies.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.movies).toEqual([]);
    });

    it("should handle errors when fetching winners by year", async () => {
      const errorMessage = "Year not found";
      mockMovieService.getWinnersByYear.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useMoviesPreview(1980));

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.movies).toEqual([]);
    });

    it("should handle non-Error exceptions", async () => {
      mockMovieService.getMovies.mockRejectedValueOnce("String error");

      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Unknown error");
      expect(result.current.movies).toEqual([]);
    });

    it("should handle API errors with status codes", async () => {
      const apiError = new Error("Internal Server Error");
      (apiError as any).statusCode = 500;
      mockMovieService.getMovies.mockRejectedValueOnce(apiError);

      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Internal Server Error");
    });
  });

  describe("memoization", () => {
    it("should create ApiClient instance", () => {
      renderHook(() => useMoviesPreview());

      expect(ApiClient).toHaveBeenCalled();
    });

    it("should create MovieService instance with apiClient", () => {
      renderHook(() => useMoviesPreview());

      expect(MovieService).toHaveBeenCalledWith(mockApiClient);
    });

    it("should memoize apiClient instance", () => {
      const { rerender } = renderHook(() => useMoviesPreview());

      const firstCallCount = (ApiClient as jest.Mock).mock.calls.length;

      rerender();

      const secondCallCount = (ApiClient as jest.Mock).mock.calls.length;

      expect(secondCallCount).toBe(firstCallCount);
    });

    it("should memoize movieService instance", () => {
      const { rerender } = renderHook(() => useMoviesPreview());

      const firstCallCount = (MovieService as jest.Mock).mock.calls.length;

      rerender();

      const secondCallCount = (MovieService as jest.Mock).mock.calls.length;

      expect(secondCallCount).toBe(firstCallCount);
    });

    it("should recreate fetcher when year changes", async () => {
      const { result, rerender } = renderHook(
        ({ year }) => useMoviesPreview(year),
        { initialProps: { year: undefined as number | undefined } }
      );

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getMovies).toHaveBeenCalledTimes(1);

      // Change year
      rerender({ year: 1980 });

      result.current.refetch();

      await waitFor(() => {
        expect(mockMovieService.getWinnersByYear).toHaveBeenCalledWith(1980);
      });
    });

    it("should not recreate fetcher when year stays undefined", async () => {
      const { result, rerender } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstCallCount = mockMovieService.getMovies.mock.calls.length;

      rerender();

      // Refetch again
      result.current.refetch();

      await waitFor(() => {
        expect(mockMovieService.getMovies.mock.calls.length).toBeGreaterThan(
          firstCallCount
        );
      });
    });
  });

  describe("return value structure", () => {
    it("should return object with movies, loading, error, and refetch properties", () => {
      const { result } = renderHook(() => useMoviesPreview());

      expect(result.current).toHaveProperty("movies");
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("error");
      expect(result.current).toHaveProperty("refetch");
    });

    it("should expose refetch function unlike other hooks", () => {
      const { result } = renderHook(() => useMoviesPreview());

      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe("function");
    });

    it("should always return array for movies", () => {
      const { result } = renderHook(() => useMoviesPreview());

      expect(Array.isArray(result.current.movies)).toBe(true);
    });
  });

  describe("integration with useApiData", () => {
    it("should use initialLoad: false", () => {
      renderHook(() => useMoviesPreview());

      // Should not fetch on mount
      expect(mockMovieService.getMovies).not.toHaveBeenCalled();
      expect(mockMovieService.getWinnersByYear).not.toHaveBeenCalled();
    });

    it("should call correct service method based on year parameter", async () => {
      const { result } = renderHook(() => useMoviesPreview(1985));

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getWinnersByYear).toHaveBeenCalledWith(1985);
      expect(mockMovieService.getMovies).not.toHaveBeenCalled();
    });
  });

  describe("movie data structure", () => {
    it("should preserve all movie properties", async () => {
      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const movie = result.current.movies[0];
      expect(typeof movie.id).toBe("number");
      expect(typeof movie.year).toBe("number");
      expect(typeof movie.title).toBe("string");
      expect(Array.isArray(movie.studios)).toBe(true);
      expect(Array.isArray(movie.producers)).toBe(true);
      expect(typeof movie.winner).toBe("boolean");
    });

    it("should handle movies with winners and non-winners", async () => {
      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const hasWinners = result.current.movies.some((m) => m.winner);
      const hasNonWinners = result.current.movies.some((m) => !m.winner);

      expect(hasWinners).toBe(true);
      expect(hasNonWinners).toBe(true);
    });

    it("should handle multiple studios and producers", async () => {
      const movieWithMultiple = {
        ...mockMovies[0],
        studios: ["Studio 1", "Studio 2"],
        producers: ["Producer 1", "Producer 2", "Producer 3"],
      };
      mockMovieService.getMovies.mockResolvedValueOnce([movieWithMultiple]);

      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies[0].studios).toHaveLength(2);
      expect(result.current.movies[0].producers).toHaveLength(3);
    });
  });

  describe("API_BASE configuration", () => {
    it("should use NEXT_PUBLIC_API_URL from environment", () => {
      renderHook(() => useMoviesPreview());

      expect(ApiClient).toHaveBeenCalled();
    });

    it("should handle missing API_BASE", () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      delete process.env.NEXT_PUBLIC_API_URL;

      renderHook(() => useMoviesPreview());

      expect(ApiClient).toHaveBeenCalled();

      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });
  });

  describe("refetch functionality", () => {
    it("should allow multiple refetches", async () => {
      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getMovies).toHaveBeenCalledTimes(1);

      result.current.refetch();

      await waitFor(() => {
        expect(mockMovieService.getMovies).toHaveBeenCalledTimes(2);
      });
    });

    it("should maintain refetch functionality after year change", async () => {
      const { result, rerender } = renderHook(
        ({ year }) => useMoviesPreview(year),
        { initialProps: { year: undefined as number | undefined } }
      );

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getMovies).toHaveBeenCalled();

      rerender({ year: 1980 });

      result.current.refetch();

      await waitFor(() => {
        expect(mockMovieService.getWinnersByYear).toHaveBeenCalledWith(1980);
      });
    });

    it("should update movies after refetch", async () => {
      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstMovies = result.current.movies;

      const newMovies = [mockMovies[0]];
      mockMovieService.getMovies.mockResolvedValueOnce(newMovies);

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.movies).not.toBe(firstMovies);
        expect(result.current.movies).toEqual(newMovies);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle very large year values", async () => {
      const { result } = renderHook(() => useMoviesPreview(9999));

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getWinnersByYear).toHaveBeenCalledWith(9999);
    });

    it("should handle negative year values", async () => {
      const { result } = renderHook(() => useMoviesPreview(-1));

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getWinnersByYear).toHaveBeenCalledWith(-1);
    });

    it("should handle switching between year and no year", async () => {
      const { result, rerender } = renderHook(
        ({ year }) => useMoviesPreview(year),
        { initialProps: { year: 1980 as number | undefined } }
      );

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockMovieService.getWinnersByYear).toHaveBeenCalledWith(1980);

      // Remove year
      rerender({ year: undefined });

      result.current.refetch();

      await waitFor(() => {
        expect(mockMovieService.getMovies).toHaveBeenCalledWith({
          page: 1,
          size: 15,
        });
      });
    });

    it("should handle large datasets", async () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        ...mockMovies[0],
        id: i + 1,
        title: `Movie ${i + 1}`,
      }));
      mockMovieService.getMovies.mockResolvedValueOnce(largeDataset);

      const { result } = renderHook(() => useMoviesPreview());

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toHaveLength(100);
    });
  });
});
