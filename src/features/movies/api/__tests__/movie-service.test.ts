import { MovieService } from "../movie-service";
import { ApiClient } from "@/shared/services/api-client";
import { MoviePagedResponse, MovieFilters } from "../../types";
import { Movie } from "@/features/dashboard/types";

jest.mock("@/shared/services/api-client");

describe("MovieService", () => {
  let movieService: MovieService;
  let mockApiClient: jest.Mocked<ApiClient>;

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

  const mockPagedResponse: MoviePagedResponse = {
    content: mockMovies,
    pageable: {
      unpaged: false,
      paged: true,
      pageSize: 10,
      pageNumber: 0,
      offset: 0,
      sort: {
        unsorted: true,
        sorted: false,
        empty: true,
      },
    },
    totalElements: 2,
    totalPages: 1,
    numberOfElements: 2,
    size: 10,
    number: 0,
    sort: {
      unsorted: true,
      sorted: false,
      empty: true,
    },
    first: true,
    last: true,
    empty: false,
  };

  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
    } as any;

    movieService = new MovieService(mockApiClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getMovies", () => {
    it("should fetch movies with filters", async () => {
      const filters: MovieFilters = {
        page: 0,
        size: 10,
        year: 2020,
        winner: true,
      };

      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      const result = await movieService.getMovies(filters);

      expect(mockApiClient.get).toHaveBeenCalledTimes(1);
      expect(mockApiClient.get).toHaveBeenCalledWith("/api/movies", {
        params: filters,
      });
      expect(result).toEqual({
        movies: mockMovies,
        totalPages: mockPagedResponse.totalPages,
        totalElements: mockPagedResponse.totalElements,
      });
    });

    it("should fetch movies with empty filters", async () => {
      const filters: MovieFilters = {};

      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      const result = await movieService.getMovies(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/movies", {
        params: {},
      });
      expect(result).toEqual({
        movies: mockMovies,
        totalPages: mockPagedResponse.totalPages,
        totalElements: mockPagedResponse.totalElements,
      });
    });

    it("should fetch movies with partial filters", async () => {
      const filters: MovieFilters = {
        year: 2020,
      };

      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      const result = await movieService.getMovies(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/movies", {
        params: { year: 2020 },
      });
      expect(result).toEqual({
        movies: mockMovies,
        totalPages: mockPagedResponse.totalPages,
        totalElements: mockPagedResponse.totalElements,
      });
    });

    it("should return MoviePageData with all properties", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      const result = await movieService.getMovies({});

      expect(result).toEqual({
        movies: mockMovies,
        totalPages: mockPagedResponse.totalPages,
        totalElements: mockPagedResponse.totalElements,
      });
      expect(result).toHaveProperty("movies");
      expect(result).toHaveProperty("totalPages");
      expect(result).toHaveProperty("totalElements");
    });

    it("should handle empty content array", async () => {
      const emptyResponse: MoviePagedResponse = {
        content: [],
        pageable: {
          unpaged: false,
          paged: true,
          pageSize: 10,
          pageNumber: 0,
          offset: 0,
          sort: { unsorted: true, sorted: false, empty: true },
        },
        totalElements: 0,
        totalPages: 0,
        numberOfElements: 0,
        size: 10,
        number: 0,
        sort: { unsorted: true, sorted: false, empty: true },
        first: true,
        last: true,
        empty: true,
      };

      mockApiClient.get.mockResolvedValueOnce(emptyResponse);

      const result = await movieService.getMovies({});

      expect(result).toEqual({
        movies: [],
        totalPages: 0,
        totalElements: 0,
      });
    });

    it("should pass all filter parameters correctly", async () => {
      const filters: MovieFilters = {
        page: 2,
        size: 20,
        year: 2019,
        winner: false,
      };

      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      await movieService.getMovies(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/movies", {
        params: {
          page: 2,
          size: 20,
          year: 2019,
          winner: false,
        },
      });
    });

    it("should propagate errors from apiClient", async () => {
      const error = new Error("Network error");
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(movieService.getMovies({})).rejects.toThrow("Network error");
    });

    it("should handle API errors with status codes", async () => {
      const apiError = new Error("Not Found");
      (apiError as any).statusCode = 404;
      mockApiClient.get.mockRejectedValueOnce(apiError);

      await expect(movieService.getMovies({})).rejects.toThrow("Not Found");
    });
  });

  describe("getWinnersByYear", () => {
    it("should fetch winners for a specific year", async () => {
      const year = 2020;
      const winnersResponse: MoviePagedResponse = {
        content: [mockMovies[0]],
        pageable: {
          unpaged: false,
          paged: true,
          pageSize: 99,
          pageNumber: 0,
          offset: 0,
          sort: { unsorted: true, sorted: false, empty: true },
        },
        totalElements: 1,
        totalPages: 1,
        numberOfElements: 1,
        size: 99,
        number: 0,
        sort: { unsorted: true, sorted: false, empty: true },
        first: true,
        last: true,
        empty: false,
      };

      mockApiClient.get.mockResolvedValueOnce(winnersResponse);

      const result = await movieService.getWinnersByYear(year);

      expect(mockApiClient.get).toHaveBeenCalledTimes(1);
      expect(mockApiClient.get).toHaveBeenCalledWith("/api/movies", {
        params: {
          page: 0,
          size: 99,
          winner: true,
          year: 2020,
        },
      });
      expect(result).toEqual([mockMovies[0]]);
    });

    it("should always set winner to true", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      await movieService.getWinnersByYear(2021);

      const callParams = mockApiClient.get.mock.calls[0][1];
      expect(callParams?.params?.winner).toBe(true);
    });

    it("should always set page to 0", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      await movieService.getWinnersByYear(2021);

      const callParams = mockApiClient.get.mock.calls[0][1];
      expect(callParams?.params?.page).toBe(0);
    });

    it("should always set size to 99", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      await movieService.getWinnersByYear(2021);

      const callParams = mockApiClient.get.mock.calls[0][1];
      expect(callParams?.params?.size).toBe(99);
    });

    it("should handle year as number parameter", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      await movieService.getWinnersByYear(2020);

      const callParams = mockApiClient.get.mock.calls[0][1];
      expect(callParams?.params?.year).toBe(2020);
      expect(typeof callParams?.params?.year).toBe("number");
    });

    it("should return only winners", async () => {
      const winnersOnly: Movie[] = [
        {
          id: 1,
          year: 2020,
          title: "Winner Movie",
          studios: ["Studio A"],
          producers: ["Producer A"],
          winner: true,
        },
      ];

      const winnersResponse: MoviePagedResponse = {
        content: winnersOnly,
        pageable: {
          unpaged: false,
          paged: true,
          pageSize: 99,
          pageNumber: 0,
          offset: 0,
          sort: { unsorted: true, sorted: false, empty: true },
        },
        totalElements: 1,
        totalPages: 1,
        numberOfElements: 1,
        size: 99,
        number: 0,
        sort: { unsorted: true, sorted: false, empty: true },
        first: true,
        last: true,
        empty: false,
      };

      mockApiClient.get.mockResolvedValueOnce(winnersResponse);

      const result = await movieService.getWinnersByYear(2020);

      expect(result).toEqual(winnersOnly);
      expect(result.every((movie) => movie.winner)).toBe(true);
    });

    it("should handle empty winners for a year", async () => {
      const emptyResponse: MoviePagedResponse = {
        content: [],
        pageable: {
          unpaged: false,
          paged: true,
          pageSize: 99,
          pageNumber: 0,
          offset: 0,
          sort: { unsorted: true, sorted: false, empty: true },
        },
        totalElements: 0,
        totalPages: 0,
        numberOfElements: 0,
        size: 99,
        number: 0,
        sort: { unsorted: true, sorted: false, empty: true },
        first: true,
        last: true,
        empty: true,
      };

      mockApiClient.get.mockResolvedValueOnce(emptyResponse);

      const result = await movieService.getWinnersByYear(2022);

      expect(result).toEqual([]);
    });

    it("should handle different years", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      await movieService.getWinnersByYear(1999);

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/movies", {
        params: {
          page: 0,
          size: 99,
          winner: true,
          year: 1999,
        },
      });
    });

    it("should propagate errors from apiClient", async () => {
      const error = new Error("Server error");
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(movieService.getWinnersByYear(2020)).rejects.toThrow(
        "Server error"
      );
    });

    it("should handle future years", async () => {
      const futureYear = 2030;
      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      await movieService.getWinnersByYear(futureYear);

      const callParams = mockApiClient.get.mock.calls[0][1];
      expect(callParams?.params?.year).toBe(2030);
    });

    it("should handle old years", async () => {
      const oldYear = 1980;
      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      await movieService.getWinnersByYear(oldYear);

      const callParams = mockApiClient.get.mock.calls[0][1];
      expect(callParams?.params?.year).toBe(1980);
    });
  });

  describe("constructor", () => {
    it("should create instance with apiClient", () => {
      const service = new MovieService(mockApiClient);
      expect(service).toBeInstanceOf(MovieService);
    });

    it("should store apiClient as private property", async () => {
      mockApiClient.get.mockResolvedValueOnce(mockPagedResponse);

      await movieService.getMovies({});

      expect(mockApiClient.get).toHaveBeenCalled();
    });
  });

  describe("integration", () => {
    it("should call same endpoint for both methods", async () => {
      mockApiClient.get.mockResolvedValue(mockPagedResponse);

      await movieService.getMovies({});
      await movieService.getWinnersByYear(2020);

      expect(mockApiClient.get).toHaveBeenCalledTimes(2);
      expect(mockApiClient.get.mock.calls[0][0]).toBe("/api/movies");
      expect(mockApiClient.get.mock.calls[1][0]).toBe("/api/movies");
    });

    it("should handle multiple sequential calls", async () => {
      mockApiClient.get.mockResolvedValue(mockPagedResponse);

      await movieService.getMovies({ year: 2020 });
      await movieService.getMovies({ year: 2021 });
      await movieService.getWinnersByYear(2020);

      expect(mockApiClient.get).toHaveBeenCalledTimes(3);
    });

    it("should handle concurrent calls", async () => {
      mockApiClient.get.mockResolvedValue(mockPagedResponse);

      const promises = [
        movieService.getMovies({ year: 2020 }),
        movieService.getMovies({ year: 2021 }),
        movieService.getWinnersByYear(2020),
      ];

      await Promise.all(promises);

      expect(mockApiClient.get).toHaveBeenCalledTimes(3);
    });
  });
});
