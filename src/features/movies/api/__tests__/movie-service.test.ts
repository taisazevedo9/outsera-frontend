import { MovieService } from "../movie-service";
import { ApiClient } from "@/shared/services/api-client";
import { Movie } from "@/features/dashboard/types";
import { MoviePagedResponse } from "../../types";

jest.mock("@/shared/services/api-client");

describe("MovieService", () => {
  let movieService: MovieService;
  let mockApiClient: jest.Mocked<ApiClient>;

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
  ];

  const mockPagedResponse: MoviePagedResponse = {
    content: mockMovies,
    totalPages: 5,
    totalElements: 100,
    pageable: {
      sort: {
        unsorted: true,
        sorted: false,
        empty: true,
      },
      pageSize: 15,
      pageNumber: 0,
      offset: 0,
      paged: true,
      unpaged: false,
    },
    numberOfElements: 2,
    size: 15,
    number: 0,
    sort: {
      unsorted: true,
      sorted: false,
      empty: true,
    },
    first: true,
    last: false,
    empty: false,
  };

  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as any;

    movieService = new MovieService(mockApiClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getMovies", () => {
    it("should return MoviePageData", async () => {
      mockApiClient.get.mockResolvedValue(mockPagedResponse);
      const result = await movieService.getMovies({ page: 0, size: 15 });
      expect(result).toEqual({
        movies: mockMovies,
        totalPages: 5,
        totalElements: 100,
      });
    });
  });

  describe("getWinnersByYear", () => {
    it("should return array of movies", async () => {
      const winners = mockMovies.filter((m) => m.winner);
      mockApiClient.get.mockResolvedValue(winners);
      const result = await movieService.getWinnersByYear(1980);
      expect(result).toEqual(winners);
    });
  });
});
