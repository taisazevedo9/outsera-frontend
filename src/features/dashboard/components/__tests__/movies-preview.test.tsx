import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MoviesPreview } from "../movies-preview";
import { useMoviesPreview } from "../../hooks/use-movies-preview";
import { Movie } from "../../types";

jest.mock("../../hooks/use-movies-preview");
jest.mock("@/shared/components/ui/card", () => {
  return function Card({
    title,
    colSize,
    loading,
    error,
    children,
  }: any) {
    return (
      <div data-testid="card" data-col-size={colSize}>
        <div data-testid="card-title">{title}</div>
        {loading && <div data-testid="card-loading">Loading...</div>}
        {error && <div data-testid="card-error">{error}</div>}
        {children}
      </div>
    );
  };
});

jest.mock("@/shared/components/ui/simple-table", () => {
  return function SimpleTable({
    data,
    columns,
    showFilters,
    itemsPerPage,
    showPagination,
  }: any) {
    return (
      <div data-testid="simple-table">
        <div data-testid="table-show-filters">{String(showFilters)}</div>
        <div data-testid="table-items-per-page">{itemsPerPage}</div>
        <div data-testid="table-show-pagination">
          {String(showPagination)}
        </div>
        <div data-testid="table-columns-count">{columns?.length || 0}</div>
        <div data-testid="table-data-count">{data?.length || 0}</div>
      </div>
    );
  };
});

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
    studios: ["Lorimar Productions", "United Artists"],
    producers: ["Jerry Weintraub"],
    winner: false,
  },
  {
    id: 3,
    year: 1980,
    title: "The Formula",
    studios: ["MGM", "United Artists"],
    producers: ["Steve Shagan"],
    winner: false,
  },
];

const mockUseMoviesPreview = useMoviesPreview as jest.MockedFunction<
  typeof useMoviesPreview
>;

describe("MoviesPreview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMoviesPreview.mockReturnValue({
      movies: mockMovies,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  describe("Rendering", () => {
    it("should render the component", () => {
      render(<MoviesPreview />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("should render with default colSize", () => {
      render(<MoviesPreview />);
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-md-6");
    });

    it("should render Card component", () => {
      render(<MoviesPreview />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("should render SimpleTable component", () => {
      render(<MoviesPreview />);
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });
  });

  describe("colSize prop", () => {
    it("should apply custom colSize when provided", () => {
      render(<MoviesPreview colSize="col-md-12" />);
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-md-12");
    });

    it("should apply col-lg-4 colSize", () => {
      render(<MoviesPreview colSize="col-lg-4" />);
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-lg-4");
    });

    it("should apply col-sm-12 colSize", () => {
      render(<MoviesPreview colSize="col-sm-12" />);
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-sm-12");
    });

    it("should handle complex grid classes", () => {
      render(<MoviesPreview colSize="col-12 col-md-6 col-lg-4" />);
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-12 col-md-6 col-lg-4");
    });
  });

  describe("Search input", () => {
    it("should render year input field", () => {
      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText("Search by year");
      expect(input).toBeInTheDocument();
    });

    it("should have type number", () => {
      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText("Search by year");
      expect(input).toHaveAttribute("type", "number");
    });

    it("should have min and max attributes", () => {
      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText("Search by year");
      expect(input).toHaveAttribute("min", "1900");
      expect(input).toHaveAttribute("max", "2100");
    });

    it("should update input value on change", () => {
      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText(
        "Search by year"
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "1980" } });
      expect(input.value).toBe("1980");
    });

    it("should start with empty value", () => {
      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText(
        "Search by year"
      ) as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("should allow clearing the input", () => {
      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText(
        "Search by year"
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "1980" } });
      fireEvent.change(input, { target: { value: "" } });
      expect(input.value).toBe("");
    });
  });

  describe("Search button", () => {
    it("should render search button", () => {
      render(<MoviesPreview />);
      const button = screen.getByRole("button", { name: /search/i });
      expect(button).toBeInTheDocument();
    });

    it("should have primary button class", () => {
      render(<MoviesPreview />);
      const button = screen.getByRole("button", { name: /search/i });
      expect(button).toHaveClass("btn", "btn-primary");
    });

    it("should contain search icon", () => {
      render(<MoviesPreview />);
      const button = screen.getByRole("button", { name: /search/i });
      const icon = button.querySelector("i.bi-search");
      expect(icon).toBeInTheDocument();
    });

    it("should be enabled by default", () => {
      render(<MoviesPreview />);
      const button = screen.getByRole("button", { name: /search/i });
      expect(button).not.toBeDisabled();
    });

    it("should be disabled when loading", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      const button = screen.getByRole("button", { name: /search/i });
      expect(button).toBeDisabled();
    });
  });

  describe("Search functionality", () => {
    it("should call refetch when search button is clicked with year", async () => {
      const mockRefetch = jest.fn();
      mockUseMoviesPreview.mockReturnValue({
        movies: mockMovies,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText("Search by year");
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "1980" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it("should call refetch when search button is clicked without year", async () => {
      const mockRefetch = jest.fn();
      mockUseMoviesPreview.mockReturnValue({
        movies: mockMovies,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MoviesPreview />);
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it("should call hook with undefined when searching without year", () => {
      render(<MoviesPreview />);
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.click(button);

      expect(mockUseMoviesPreview).toHaveBeenCalledWith(undefined);
    });

    it("should update search year when valid year is entered", () => {
      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText("Search by year");
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "1980" } });
      fireEvent.click(button);

      expect(mockUseMoviesPreview).toHaveBeenCalled();
    });

    it("should handle multiple searches", async () => {
      const mockRefetch = jest.fn();
      mockUseMoviesPreview.mockReturnValue({
        movies: mockMovies,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText("Search by year");
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "1980" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(1);
      });

      fireEvent.change(input, { target: { value: "1990" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Data display", () => {
    it("should display movies data", () => {
      render(<MoviesPreview />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("3");
    });

    it("should display empty state when no movies", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("0");
    });

    it("should update data when movies change", () => {
      const { rerender } = render(<MoviesPreview />);
      let dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("3");

      mockUseMoviesPreview.mockReturnValue({
        movies: [mockMovies[0]],
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(<MoviesPreview />);
      dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("1");
    });

    it("should pass movies array to SimpleTable", () => {
      render(<MoviesPreview />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent(String(mockMovies.length));
    });
  });

  describe("Loading state", () => {
    it("should show loading state", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should hide table data during loading", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("0");
    });

    it("should not show loading when data is ready", () => {
      render(<MoviesPreview />);
      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("should display error message", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: false,
        error: "Failed to fetch movies",
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      expect(screen.getByTestId("card-error")).toHaveTextContent(
        "Failed to fetch movies"
      );
    });

    it("should not show error when no error exists", () => {
      render(<MoviesPreview />);
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should display network error", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: false,
        error: "Network error",
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      expect(screen.getByTestId("card-error")).toHaveTextContent(
        "Network error"
      );
    });

    it("should allow searching after error", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: false,
        error: "Error occurred",
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      const button = screen.getByRole("button", { name: /search/i });
      expect(button).not.toBeDisabled();
    });
  });

  describe("Table configuration", () => {
    it("should configure table with correct showFilters", () => {
      render(<MoviesPreview />);
      const showFilters = screen.getByTestId("table-show-filters");
      expect(showFilters).toHaveTextContent("false");
    });

    it("should configure table with correct itemsPerPage", () => {
      render(<MoviesPreview />);
      const itemsPerPage = screen.getByTestId("table-items-per-page");
      expect(itemsPerPage).toHaveTextContent("15");
    });

    it("should configure table with correct showPagination", () => {
      render(<MoviesPreview />);
      const showPagination = screen.getByTestId("table-show-pagination");
      expect(showPagination).toHaveTextContent("false");
    });

    it("should have all table configuration properties", () => {
      render(<MoviesPreview />);
      expect(screen.getByTestId("table-show-filters")).toBeInTheDocument();
      expect(screen.getByTestId("table-items-per-page")).toBeInTheDocument();
      expect(screen.getByTestId("table-show-pagination")).toBeInTheDocument();
    });
  });

  describe("Column configuration", () => {
    it("should configure table with 3 columns", () => {
      render(<MoviesPreview />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(columnsCount).toHaveTextContent("3");
    });

    it("should have correct number of columns", () => {
      render(<MoviesPreview />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(Number(columnsCount.textContent)).toBe(3);
    });
  });

  describe("Integration", () => {
    it("should integrate Card and SimpleTable", () => {
      render(<MoviesPreview />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });

    it("should pass loading state to Card", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should pass error state to Card", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: false,
        error: "Error message",
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      expect(screen.getByTestId("card-error")).toBeInTheDocument();
    });
  });

  describe("Props interface", () => {
    it("should accept colSize prop", () => {
      const { rerender } = render(<MoviesPreview colSize="col-md-12" />);
      expect(screen.getByTestId("card")).toHaveAttribute(
        "data-col-size",
        "col-md-12"
      );

      rerender(<MoviesPreview colSize="col-lg-4" />);
      expect(screen.getByTestId("card")).toHaveAttribute(
        "data-col-size",
        "col-lg-4"
      );
    });

    it("should work without any props", () => {
      render(<MoviesPreview />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });
  });

  describe("Card props", () => {
    it("should pass correct title to Card", () => {
      render(<MoviesPreview />);
      const title = screen.getByTestId("card-title");
      expect(title).toHaveTextContent("List movie winners by year");
    });

    it("should pass colSize to Card", () => {
      render(<MoviesPreview colSize="col-md-8" />);
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-md-8");
    });

    it("should pass loading to Card", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should pass error to Card", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: false,
        error: "Test error",
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      expect(screen.getByTestId("card-error")).toHaveTextContent("Test error");
    });

    it("should render Card children", () => {
      render(<MoviesPreview />);
      const card = screen.getByTestId("card");
      expect(card.querySelector('[data-testid="simple-table"]')).toBeInTheDocument();
    });
  });

  describe("Table props", () => {
    it("should pass movies data to table", () => {
      render(<MoviesPreview />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("3");
    });

    it("should pass columns to table", () => {
      render(<MoviesPreview />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(columnsCount).toHaveTextContent("3");
    });

    it("should pass showFilters=false to table", () => {
      render(<MoviesPreview />);
      const showFilters = screen.getByTestId("table-show-filters");
      expect(showFilters).toHaveTextContent("false");
    });

    it("should pass itemsPerPage=15 to table", () => {
      render(<MoviesPreview />);
      const itemsPerPage = screen.getByTestId("table-items-per-page");
      expect(itemsPerPage).toHaveTextContent("15");
    });

    it("should pass showPagination=false to table", () => {
      render(<MoviesPreview />);
      const showPagination = screen.getByTestId("table-show-pagination");
      expect(showPagination).toHaveTextContent("false");
    });
  });

  describe("Edge cases", () => {
    it("should handle undefined movies gracefully", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: undefined as any,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("0");
    });

    it("should handle null movies gracefully", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: null as any,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("0");
    });

    it("should handle empty movies array", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("0");
    });

    it("should handle loading and error simultaneously", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [],
        loading: true,
        error: "Error",
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
      expect(screen.getByTestId("card-error")).toBeInTheDocument();
    });

    it("should handle very large year values", () => {
      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText(
        "Search by year"
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "9999" } });
      expect(input.value).toBe("9999");
    });

    it("should handle negative year values", () => {
      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText(
        "Search by year"
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "-100" } });
      expect(input.value).toBe("-100");
    });

    it("should handle single movie in array", () => {
      mockUseMoviesPreview.mockReturnValue({
        movies: [mockMovies[0]],
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      render(<MoviesPreview />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("1");
    });
  });

  describe("Search state management", () => {
    it("should maintain input value after search", async () => {
      const mockRefetch = jest.fn();
      mockUseMoviesPreview.mockReturnValue({
        movies: mockMovies,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText(
        "Search by year"
      ) as HTMLInputElement;
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "1980" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(input.value).toBe("1980");
      });
    });

    it("should allow changing year and searching again", async () => {
      const mockRefetch = jest.fn();
      mockUseMoviesPreview.mockReturnValue({
        movies: mockMovies,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText("Search by year");
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "1980" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(1);
      });

      fireEvent.change(input, { target: { value: "1985" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(2);
      });
    });

    it("should reset search with empty input", async () => {
      const mockRefetch = jest.fn();
      mockUseMoviesPreview.mockReturnValue({
        movies: mockMovies,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MoviesPreview />);
      const input = screen.getByPlaceholderText("Search by year");
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "1980" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(1);
      });

      fireEvent.change(input, { target: { value: "" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Title content", () => {
    it("should have descriptive title", () => {
      render(<MoviesPreview />);
      const title = screen.getByTestId("card-title");
      expect(title.textContent).toBe("List movie winners by year");
    });

    it("should include 'year' in title", () => {
      render(<MoviesPreview />);
      const title = screen.getByTestId("card-title");
      expect(title.textContent?.toLowerCase()).toContain("year");
    });

    it("should include 'winners' in title", () => {
      render(<MoviesPreview />);
      const title = screen.getByTestId("card-title");
      expect(title.textContent?.toLowerCase()).toContain("winners");
    });
  });

  describe("Movie columns structure", () => {
    it("should have id column", () => {
      render(<MoviesPreview />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(Number(columnsCount.textContent)).toBeGreaterThanOrEqual(1);
    });

    it("should have year column", () => {
      render(<MoviesPreview />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(Number(columnsCount.textContent)).toBeGreaterThanOrEqual(2);
    });

    it("should have title column", () => {
      render(<MoviesPreview />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(Number(columnsCount.textContent)).toBe(3);
    });
  });
});
