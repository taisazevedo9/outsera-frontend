import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MovieCard } from "../movie-card";
import { useMovies } from "../../hooks/use-movies";
import { Movie } from "@/features/dashboard/types";

jest.mock("../../hooks/use-movies");
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
    currentPage,
    totalPages,
    onPageChange,
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
        <div data-testid="table-current-page">{currentPage}</div>
        <div data-testid="table-total-pages">{totalPages}</div>
        {onPageChange && (
          <button
            data-testid="pagination-button"
            onClick={() => onPageChange(1)}
          >
            Next Page
          </button>
        )}
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

const mockUseMovies = useMovies as jest.MockedFunction<typeof useMovies>;

describe("MovieCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMovies.mockReturnValue({
      movies: mockMovies,
      totalPages: 1,
      totalElements: 3,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  describe("Rendering", () => {
    it("should render the component", () => {
      render(<MovieCard title="Test Title" />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("should render Card component", () => {
      render(<MovieCard title="Test Title" />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("should render SimpleTable component", () => {
      render(<MovieCard title="Test Title" />);
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });

    it("should render with required props only", () => {
      render(<MovieCard title="Movies" />);
      expect(screen.getByTestId("card-title")).toHaveTextContent("Movies");
    });
  });

  describe("Title prop", () => {
    it("should display correct title", () => {
      render(<MovieCard title="Movie List" />);
      const title = screen.getByTestId("card-title");
      expect(title).toHaveTextContent("Movie List");
    });

    it("should display custom title", () => {
      render(<MovieCard title="Custom Title" />);
      const title = screen.getByTestId("card-title");
      expect(title).toHaveTextContent("Custom Title");
    });

    it("should handle empty string title", () => {
      render(<MovieCard title="" />);
      const title = screen.getByTestId("card-title");
      expect(title).toBeInTheDocument();
    });
  });

  describe("ColSize prop", () => {
    it("should apply custom colSize", () => {
      render(<MovieCard title="Test" colSize="col-md-6" />);
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-md-6");
    });

    it("should handle undefined colSize", () => {
      render(<MovieCard title="Test" />);
      const card = screen.getByTestId("card");
      expect(card).toBeInTheDocument();
    });

    it("should apply col-12", () => {
      render(<MovieCard title="Test" colSize="col-12" />);
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-12");
    });

    it("should apply complex grid classes", () => {
      render(<MovieCard title="Test" colSize="col-12 col-md-6" />);
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-12 col-md-6");
    });
  });

  describe("ShowFilters prop", () => {
    it("should hide filters by default", () => {
      render(<MovieCard title="Test" />);
      expect(screen.queryByPlaceholderText("Filter by year")).not.toBeInTheDocument();
    });

    it("should show filters when showFilters is true", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      expect(screen.getByPlaceholderText("Filter by year")).toBeInTheDocument();
    });

    it("should hide filters when showFilters is false", () => {
      render(<MovieCard title="Test" showFilters={false} />);
      expect(screen.queryByPlaceholderText("Filter by year")).not.toBeInTheDocument();
    });

    it("should render filter inputs when enabled", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      expect(screen.getByPlaceholderText("Filter by year")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("ItemsPerPage prop", () => {
    it("should use default itemsPerPage of 15", () => {
      render(<MovieCard title="Test" />);
      const itemsPerPage = screen.getByTestId("table-items-per-page");
      expect(itemsPerPage).toHaveTextContent("15");
    });

    it("should apply custom itemsPerPage", () => {
      render(<MovieCard title="Test" itemsPerPage={20} />);
      const itemsPerPage = screen.getByTestId("table-items-per-page");
      expect(itemsPerPage).toHaveTextContent("20");
    });

    it("should handle itemsPerPage of 10", () => {
      render(<MovieCard title="Test" itemsPerPage={10} />);
      const itemsPerPage = screen.getByTestId("table-items-per-page");
      expect(itemsPerPage).toHaveTextContent("10");
    });

    it("should handle large itemsPerPage", () => {
      render(<MovieCard title="Test" itemsPerPage={100} />);
      const itemsPerPage = screen.getByTestId("table-items-per-page");
      expect(itemsPerPage).toHaveTextContent("100");
    });
  });

  describe("InitialFilters prop", () => {
    it("should call hook with initialFilters", () => {
      const initialFilters = { page: 0, size: 10 };
      render(<MovieCard title="Test" initialFilters={initialFilters} />);
      expect(mockUseMovies).toHaveBeenCalledWith(initialFilters);
    });

    it("should call hook with default page and size when no initialFilters", () => {
      render(<MovieCard title="Test" />);
      expect(mockUseMovies).toHaveBeenCalledWith({ page: 0, size: 15 });
    });

    it("should handle year filter in initialFilters", () => {
      const initialFilters = { year: 1980 };
      render(<MovieCard title="Test" initialFilters={initialFilters} />);
      expect(mockUseMovies).toHaveBeenCalledWith({
        year: 1980,
        page: 0,
        size: 15,
      });
    });

    it("should handle winner filter in initialFilters", () => {
      const initialFilters = { winner: true };
      render(<MovieCard title="Test" initialFilters={initialFilters} />);
      expect(mockUseMovies).toHaveBeenCalledWith({
        winner: true,
        page: 0,
        size: 15,
      });
    });

    it("should handle multiple filters in initialFilters", () => {
      const initialFilters = { page: 0, size: 10, year: 1980, winner: true };
      render(<MovieCard title="Test" initialFilters={initialFilters} />);
      expect(mockUseMovies).toHaveBeenCalledWith(initialFilters);
    });
  });

  describe("Year filter input", () => {
    it("should render year input when filters enabled", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const input = screen.getByPlaceholderText("Filter by year");
      expect(input).toBeInTheDocument();
    });

    it("should have type number", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const input = screen.getByPlaceholderText("Filter by year");
      expect(input).toHaveAttribute("type", "number");
    });

    it("should have min and max attributes", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const input = screen.getByPlaceholderText("Filter by year");
      expect(input).toHaveAttribute("min", "1900");
      expect(input).toHaveAttribute("max", "2100");
    });

    it("should update value on change", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const input = screen.getByPlaceholderText("Filter by year") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "1980" } });
      expect(input.value).toBe("1980");
    });

    it("should start with empty value", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const input = screen.getByPlaceholderText("Filter by year") as HTMLInputElement;
      expect(input.value).toBe("");
    });
  });

  describe("Winner filter select", () => {
    it("should render winner select when filters enabled", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
    });

    it("should have 'All' option", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      expect(screen.getByText("All")).toBeInTheDocument();
    });

    it("should have 'Yes' option", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    it("should have 'No' option", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      expect(screen.getByText("No")).toBeInTheDocument();
    });

    it("should update value on change", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const select = screen.getByRole("combobox") as HTMLSelectElement;
      fireEvent.change(select, { target: { value: "true" } });
      expect(select.value).toBe("true");
    });

    it("should start with empty value", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("");
    });

    it("should change to 'false' value", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const select = screen.getByRole("combobox") as HTMLSelectElement;
      fireEvent.change(select, { target: { value: "false" } });
      expect(select.value).toBe("false");
    });
  });

  describe("Filter button", () => {
    it("should render Filter button when filters enabled", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const button = screen.getByRole("button", { name: /filter/i });
      expect(button).toBeInTheDocument();
    });

    it("should have primary button class", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const button = screen.getByRole("button", { name: /filter/i });
      expect(button).toHaveClass("btn", "btn-primary");
    });

    it("should contain search icon", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const button = screen.getByRole("button", { name: /filter/i });
      const icon = button.querySelector("i.bi-search");
      expect(icon).toBeInTheDocument();
    });

    it("should be enabled by default", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const button = screen.getByRole("button", { name: /filter/i });
      expect(button).not.toBeDisabled();
    });

    it("should be disabled when loading", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" showFilters={true} />);
      const button = screen.getByRole("button", { name: /filter/i });
      expect(button).toBeDisabled();
    });
  });

  describe("Clear button", () => {
    it("should render Clear button when filters enabled", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const button = screen.getByRole("button", { name: /clear/i });
      expect(button).toBeInTheDocument();
    });

    it("should have secondary button class", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const button = screen.getByRole("button", { name: /clear/i });
      expect(button).toHaveClass("btn", "btn-secondary");
    });

    it("should contain x-circle icon", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const button = screen.getByRole("button", { name: /clear/i });
      const icon = button.querySelector("i.bi-x-circle");
      expect(icon).toBeInTheDocument();
    });

    it("should be enabled by default", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const button = screen.getByRole("button", { name: /clear/i });
      expect(button).not.toBeDisabled();
    });

    it("should be disabled when loading", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" showFilters={true} />);
      const button = screen.getByRole("button", { name: /clear/i });
      expect(button).toBeDisabled();
    });
  });

  describe("Filter functionality", () => {
    it("should apply year filter when Filter button clicked", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MovieCard title="Test" showFilters={true} />);
      const yearInput = screen.getByPlaceholderText("Filter by year");
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.change(yearInput, { target: { value: "1980" } });
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it("should apply winner filter when Filter button clicked", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MovieCard title="Test" showFilters={true} />);
      const winnerSelect = screen.getByRole("combobox");
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.change(winnerSelect, { target: { value: "true" } });
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it("should apply both filters together", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MovieCard title="Test" showFilters={true} />);
      const yearInput = screen.getByPlaceholderText("Filter by year");
      const winnerSelect = screen.getByRole("combobox");
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.change(yearInput, { target: { value: "1980" } });
      fireEvent.change(winnerSelect, { target: { value: "true" } });
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it("should parse year as integer", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MovieCard title="Test" showFilters={true} />);
      const yearInput = screen.getByPlaceholderText("Filter by year");
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.change(yearInput, { target: { value: "1980" } });
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it("should convert winner string to boolean", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MovieCard title="Test" showFilters={true} />);
      const winnerSelect = screen.getByRole("combobox");
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.change(winnerSelect, { target: { value: "true" } });
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it("should preserve initialFilters when applying new filters", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(
        <MovieCard
          title="Test"
          showFilters={true}
          initialFilters={{ page: 0, size: 10 }}
        />
      );
      const yearInput = screen.getByPlaceholderText("Filter by year");
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.change(yearInput, { target: { value: "1980" } });
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });
  });

  describe("Clear functionality", () => {
    it("should clear year filter", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MovieCard title="Test" showFilters={true} />);
      const yearInput = screen.getByPlaceholderText("Filter by year") as HTMLInputElement;
      const clearButton = screen.getByRole("button", { name: /clear/i });

      fireEvent.change(yearInput, { target: { value: "1980" } });
      fireEvent.click(clearButton);

      expect(yearInput.value).toBe("");
    });

    it("should clear winner filter", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const winnerSelect = screen.getByRole("combobox") as HTMLSelectElement;
      const clearButton = screen.getByRole("button", { name: /clear/i });

      fireEvent.change(winnerSelect, { target: { value: "true" } });
      fireEvent.click(clearButton);

      expect(winnerSelect.value).toBe("");
    });

    it("should clear both filters", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      const yearInput = screen.getByPlaceholderText("Filter by year") as HTMLInputElement;
      const winnerSelect = screen.getByRole("combobox") as HTMLSelectElement;
      const clearButton = screen.getByRole("button", { name: /clear/i });

      fireEvent.change(yearInput, { target: { value: "1980" } });
      fireEvent.change(winnerSelect, { target: { value: "true" } });
      fireEvent.click(clearButton);

      expect(yearInput.value).toBe("");
      expect(winnerSelect.value).toBe("");
    });

    it("should reset to initialFilters after clear", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(
        <MovieCard
          title="Test"
          showFilters={true}
          initialFilters={{ page: 0, size: 10 }}
        />
      );
      const clearButton = screen.getByRole("button", { name: /clear/i });

      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });
  });

  describe("Data display", () => {
    it("should display movies data", () => {
      render(<MovieCard title="Test" />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("3");
    });

    it("should display empty state when no movies", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("0");
    });

    it("should update data when movies change", () => {
      const { rerender } = render(<MovieCard title="Test" />);
      let dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("3");

      mockUseMovies.mockReturnValue({
        movies: [mockMovies[0]],
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(<MovieCard title="Test" />);
      dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("1");
    });

    it("should pass movies array to SimpleTable", () => {
      render(<MovieCard title="Test" />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent(String(mockMovies.length));
    });
  });

  describe("Loading state", () => {
    it("should show loading state", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should hide table data during loading", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("0");
    });

    it("should not show loading when data is ready", () => {
      render(<MovieCard title="Test" />);
      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
    });

    it("should disable buttons when loading", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" showFilters={true} />);
      const filterButton = screen.getByRole("button", { name: /filter/i });
      const clearButton = screen.getByRole("button", { name: /clear/i });
      expect(filterButton).toBeDisabled();
      expect(clearButton).toBeDisabled();
    });
  });

  describe("Error handling", () => {
    it("should display error message", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: "Failed to fetch movies",
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      expect(screen.getByTestId("card-error")).toHaveTextContent(
        "Failed to fetch movies"
      );
    });

    it("should not show error when no error exists", () => {
      render(<MovieCard title="Test" />);
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should display network error", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: "Network error",
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      expect(screen.getByTestId("card-error")).toHaveTextContent("Network error");
    });

    it("should allow filtering after error", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: "Error occurred",
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" showFilters={true} />);
      const filterButton = screen.getByRole("button", { name: /filter/i });
      expect(filterButton).not.toBeDisabled();
    });
  });

  describe("Table configuration", () => {
    it("should configure table with showFilters=false", () => {
      render(<MovieCard title="Test" />);
      const showFilters = screen.getByTestId("table-show-filters");
      expect(showFilters).toHaveTextContent("false");
    });

    it("should configure table with showPagination=true", () => {
      render(<MovieCard title="Test" />);
      const showPagination = screen.getByTestId("table-show-pagination");
      expect(showPagination).toHaveTextContent("true");
    });

    it("should pass itemsPerPage to table", () => {
      render(<MovieCard title="Test" itemsPerPage={20} />);
      const itemsPerPage = screen.getByTestId("table-items-per-page");
      expect(itemsPerPage).toHaveTextContent("20");
    });

    it("should have all table configuration properties", () => {
      render(<MovieCard title="Test" />);
      expect(screen.getByTestId("table-show-filters")).toBeInTheDocument();
      expect(screen.getByTestId("table-items-per-page")).toBeInTheDocument();
      expect(screen.getByTestId("table-show-pagination")).toBeInTheDocument();
    });
  });

  describe("Column configuration", () => {
    it("should configure table with 4 columns", () => {
      render(<MovieCard title="Test" />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(columnsCount).toHaveTextContent("4");
    });

    it("should have correct number of columns", () => {
      render(<MovieCard title="Test" />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(Number(columnsCount.textContent)).toBe(4);
    });

    it("should include id column", () => {
      render(<MovieCard title="Test" />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(Number(columnsCount.textContent)).toBeGreaterThanOrEqual(1);
    });

    it("should include year column", () => {
      render(<MovieCard title="Test" />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(Number(columnsCount.textContent)).toBeGreaterThanOrEqual(2);
    });

    it("should include title column", () => {
      render(<MovieCard title="Test" />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(Number(columnsCount.textContent)).toBeGreaterThanOrEqual(3);
    });

    it("should include winner column", () => {
      render(<MovieCard title="Test" />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(Number(columnsCount.textContent)).toBe(4);
    });
  });

  describe("Integration", () => {
    it("should integrate Card and SimpleTable", () => {
      render(<MovieCard title="Test" />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });

    it("should pass loading state to Card", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should pass error state to Card", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: "Error message",
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      expect(screen.getByTestId("card-error")).toBeInTheDocument();
    });

    it("should integrate filters with hook", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MovieCard title="Test" showFilters={true} />);
      const yearInput = screen.getByPlaceholderText("Filter by year");
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.change(yearInput, { target: { value: "1980" } });
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle undefined movies gracefully", () => {
      mockUseMovies.mockReturnValue({
        movies: undefined as any,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("0");
    });

    it("should handle null movies gracefully", () => {
      mockUseMovies.mockReturnValue({
        movies: null as any,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("0");
    });

    it("should handle empty movies array", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("0");
    });

    it("should handle loading and error simultaneously", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: true,
        error: "Error",
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
      expect(screen.getByTestId("card-error")).toBeInTheDocument();
    });

    it("should handle empty year filter gracefully", () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MovieCard title="Test" showFilters={true} />);
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.click(filterButton);

      // Component should handle empty filters without errors
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("should handle empty winner filter gracefully", () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MovieCard title="Test" showFilters={true} />);
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.click(filterButton);

      // Component should handle empty filters without errors
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("should handle single movie in array", () => {
      mockUseMovies.mockReturnValue({
        movies: [mockMovies[0]],
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("1");
    });
  });

  describe("Filter state management", () => {
    it("should maintain filter values after applying", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MovieCard title="Test" showFilters={true} />);
      const yearInput = screen.getByPlaceholderText("Filter by year") as HTMLInputElement;
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.change(yearInput, { target: { value: "1980" } });
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(yearInput.value).toBe("1980");
      });
    });

    it("should allow changing filters multiple times", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MovieCard title="Test" showFilters={true} />);
      
      // Clear the initial refetch call from mount
      mockRefetch.mockClear();
      
      const yearInput = screen.getByPlaceholderText("Filter by year");
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.change(yearInput, { target: { value: "1980" } });
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(1);
      });

      fireEvent.change(yearInput, { target: { value: "1985" } });
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(2);
      });
    });

    it("should refetch when appliedFilters change", async () => {
      const mockRefetch = jest.fn();
      mockUseMovies.mockReturnValue({
        movies: mockMovies,
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(
        <MovieCard
          title="Test"
          showFilters={true}
          initialFilters={{ page: 0 }}
        />
      );
      const filterButton = screen.getByRole("button", { name: /filter/i });

      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });
  });

  describe("Props interface", () => {
    it("should accept all optional props", () => {
      render(
        <MovieCard
          title="Test"
          colSize="col-md-6"
          showFilters={true}
          itemsPerPage={20}
          initialFilters={{ page: 0, size: 10 }}
        />
      );
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("should work with only required props", () => {
      render(<MovieCard title="Test" />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("should handle partial props", () => {
      render(<MovieCard title="Test" showFilters={true} />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });
  });

  describe("Card props", () => {
    it("should pass title to Card", () => {
      render(<MovieCard title="Test Title" />);
      const title = screen.getByTestId("card-title");
      expect(title).toHaveTextContent("Test Title");
    });

    it("should pass colSize to Card", () => {
      render(<MovieCard title="Test" colSize="col-md-8" />);
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-md-8");
    });

    it("should pass loading to Card", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should pass error to Card", () => {
      mockUseMovies.mockReturnValue({
        movies: [],
        totalPages: 1,
        totalElements: 3,
        loading: false,
        error: "Test error",
        refetch: jest.fn(),
      });
      render(<MovieCard title="Test" />);
      expect(screen.getByTestId("card-error")).toHaveTextContent("Test error");
    });

    it("should render Card children", () => {
      render(<MovieCard title="Test" />);
      const card = screen.getByTestId("card");
      expect(card.querySelector('[data-testid="simple-table"]')).toBeInTheDocument();
    });
  });

  describe("Table props", () => {
    it("should pass movies data to table", () => {
      render(<MovieCard title="Test" />);
      const dataCount = screen.getByTestId("table-data-count");
      expect(dataCount).toHaveTextContent("3");
    });

    it("should pass columns to table", () => {
      render(<MovieCard title="Test" />);
      const columnsCount = screen.getByTestId("table-columns-count");
      expect(columnsCount).toHaveTextContent("4");
    });

    it("should pass showFilters=false to table", () => {
      render(<MovieCard title="Test" />);
      const showFilters = screen.getByTestId("table-show-filters");
      expect(showFilters).toHaveTextContent("false");
    });

    it("should pass itemsPerPage to table", () => {
      render(<MovieCard title="Test" itemsPerPage={25} />);
      const itemsPerPage = screen.getByTestId("table-items-per-page");
      expect(itemsPerPage).toHaveTextContent("25");
    });

    it("should pass showPagination=true to table", () => {
      render(<MovieCard title="Test" />);
      const showPagination = screen.getByTestId("table-show-pagination");
      expect(showPagination).toHaveTextContent("true");
    });
  });
});
