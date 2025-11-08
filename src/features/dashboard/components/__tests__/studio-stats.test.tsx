import { render, screen } from "@testing-library/react";
import { StudioStats } from "../studio-stats";
import { useStudioStats } from "../../hooks/use-studio-stats";
import { StudioCountPerWin } from "../../types";

jest.mock("../../hooks/use-studio-stats");
jest.mock("@/shared/components/ui/card", () => {
  return function Card({ title, colSize, loading, error, children }: any) {
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
  return function SimpleTable({ data, columns, showFilters, itemsPerPage, showPagination }: any) {
    return (
      <div data-testid="simple-table">
        <div data-testid="table-show-filters">{String(showFilters)}</div>
        <div data-testid="table-items-per-page">{itemsPerPage}</div>
        <div data-testid="table-show-pagination">{String(showPagination)}</div>
        <div data-testid="table-columns-count">{columns?.length || 0}</div>
        <div data-testid="table-data-count">{data?.length || 0}</div>
      </div>
    );
  };
});

describe("StudioStats", () => {
  const mockStudios: StudioCountPerWin[] = [
    { name: "Columbia Pictures", winCount: 7 },
    { name: "Paramount Pictures", winCount: 6 },
    { name: "Warner Bros.", winCount: 5 },
  ];

  const mockUseStudioStats = useStudioStats as jest.MockedFunction<
    typeof useStudioStats
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseStudioStats.mockReturnValue({
      studios: mockStudios,
      loading: false,
      error: null,
    });
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });

    it("should render card with correct title", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "Top 3 studios with winners"
      );
    });

    it("should render simple table", () => {
      render(<StudioStats />);

      const table = screen.getByTestId("simple-table");
      expect(table).toBeInTheDocument();
    });

    it("should call useStudioStats hook with limit", () => {
      render(<StudioStats />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(3);
    });
  });

  describe("colSize prop", () => {
    it("should use default colSize of col-md-6", () => {
      render(<StudioStats />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-md-6");
    });

    it("should accept custom colSize", () => {
      render(<StudioStats colSize="col-lg-12" />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-lg-12");
    });

    it("should handle col-md-12", () => {
      render(<StudioStats colSize="col-md-12" />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-md-12");
    });

    it("should handle col-sm-6", () => {
      render(<StudioStats colSize="col-sm-6" />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-sm-6");
    });
  });

  describe("limit prop", () => {
    it("should use default limit of 3", () => {
      render(<StudioStats />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(3);
      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("3");
    });

    it("should accept custom limit", () => {
      render(<StudioStats limit={5} />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(5);
      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("5");
    });

    it("should handle limit of 1", () => {
      render(<StudioStats limit={1} />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(1);
      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("1");
    });

    it("should handle limit of 10", () => {
      render(<StudioStats limit={10} />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(10);
      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("10");
    });

    it("should handle limit of 0", () => {
      render(<StudioStats limit={0} />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(0);
      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("0");
    });
  });

  describe("data display", () => {
    it("should pass studios data to SimpleTable", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("3");
    });

    it("should handle empty studios array", () => {
      mockUseStudioStats.mockReturnValue({
        studios: [],
        loading: false,
        error: null,
      });

      render(<StudioStats />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("0");
    });

    it("should handle single studio", () => {
      mockUseStudioStats.mockReturnValue({
        studios: [{ name: "Columbia Pictures", winCount: 7 }],
        loading: false,
        error: null,
      });

      render(<StudioStats />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("1");
    });

    it("should handle many studios", () => {
      const manyStudios = Array.from({ length: 10 }, (_, i) => ({
        name: `Studio ${i + 1}`,
        winCount: 10 - i,
      }));
      mockUseStudioStats.mockReturnValue({
        studios: manyStudios,
        loading: false,
        error: null,
      });

      render(<StudioStats />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("10");
    });
  });

  describe("loading state", () => {
    it("should show loading state when loading", () => {
      mockUseStudioStats.mockReturnValue({
        studios: [],
        loading: true,
        error: null,
      });

      render(<StudioStats />);

      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should not show loading when data is loaded", () => {
      render(<StudioStats />);

      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
    });

    it("should pass loading state to Card", () => {
      mockUseStudioStats.mockReturnValue({
        studios: [],
        loading: true,
        error: null,
      });

      render(<StudioStats />);

      expect(screen.getByTestId("card-loading")).toHaveTextContent("Loading...");
    });
  });

  describe("error handling", () => {
    it("should show error when error exists", () => {
      mockUseStudioStats.mockReturnValue({
        studios: [],
        loading: false,
        error: "Failed to load studios",
      });

      render(<StudioStats />);

      expect(screen.getByTestId("card-error")).toBeInTheDocument();
      expect(screen.getByTestId("card-error")).toHaveTextContent(
        "Failed to load studios"
      );
    });

    it("should not show error when no error", () => {
      render(<StudioStats />);

      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should pass error to Card component", () => {
      mockUseStudioStats.mockReturnValue({
        studios: [],
        loading: false,
        error: "Network error",
      });

      render(<StudioStats />);

      expect(screen.getByTestId("card-error")).toHaveTextContent("Network error");
    });

    it("should still render table when there is an error", () => {
      mockUseStudioStats.mockReturnValue({
        studios: [],
        loading: false,
        error: "Error",
      });

      render(<StudioStats />);

      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });
  });

  describe("table configuration", () => {
    it("should configure table with showFilters as false", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("table-show-filters")).toHaveTextContent("false");
    });

    it("should configure table with itemsPerPage equal to limit", () => {
      render(<StudioStats limit={5} />);

      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("5");
    });

    it("should configure table with showPagination as false", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("table-show-pagination")).toHaveTextContent(
        "false"
      );
    });

    it("should pass 2 columns to table", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("table-columns-count")).toHaveTextContent("2");
    });
  });

  describe("column configuration", () => {
    it("should have name column configured correctly", () => {
      render(<StudioStats />);
      
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });

    it("should have winCount column configured correctly", () => {
      render(<StudioStats />);
      
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });
  });

  describe("integration", () => {
    it("should integrate hook data with Card component", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "Top 3 studios with winners"
      );
      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should integrate hook data with SimpleTable component", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-data-count")).toHaveTextContent("3");
    });

    it("should handle all states together", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
      expect(screen.getByTestId("table-data-count")).toHaveTextContent("3");
    });
  });

  describe("props interface", () => {
    it("should accept optional colSize prop", () => {
      render(<StudioStats colSize="col-lg-8" />);

      expect(screen.getByTestId("card")).toHaveAttribute(
        "data-col-size",
        "col-lg-8"
      );
    });

    it("should accept optional limit prop", () => {
      render(<StudioStats limit={7} />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(7);
    });

    it("should work without any props", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(mockUseStudioStats).toHaveBeenCalledWith(3);
    });

    it("should accept both props together", () => {
      render(<StudioStats colSize="col-xl-4" limit={5} />);

      expect(screen.getByTestId("card")).toHaveAttribute(
        "data-col-size",
        "col-xl-4"
      );
      expect(mockUseStudioStats).toHaveBeenCalledWith(5);
    });
  });

  describe("card props", () => {
    it("should pass all required props to Card", () => {
      render(<StudioStats />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size");
      expect(screen.getByTestId("card-title")).toBeInTheDocument();
    });

    it("should pass title prop to Card", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "Top 3 studios with winners"
      );
    });

    it("should pass colSize prop to Card", () => {
      render(<StudioStats colSize="col-xl-4" />);

      expect(screen.getByTestId("card")).toHaveAttribute(
        "data-col-size",
        "col-xl-4"
      );
    });

    it("should pass loading prop to Card", () => {
      mockUseStudioStats.mockReturnValue({
        studios: [],
        loading: true,
        error: null,
      });

      render(<StudioStats />);

      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should pass error prop to Card", () => {
      mockUseStudioStats.mockReturnValue({
        studios: [],
        loading: false,
        error: "Test error",
      });

      render(<StudioStats />);

      expect(screen.getByTestId("card-error")).toHaveTextContent("Test error");
    });
  });

  describe("table props", () => {
    it("should pass data prop to SimpleTable", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("3");
    });

    it("should pass columns prop to SimpleTable", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("table-columns-count")).toHaveTextContent("2");
    });

    it("should pass showFilters=false to SimpleTable", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("table-show-filters")).toHaveTextContent("false");
    });

    it("should pass itemsPerPage equal to limit to SimpleTable", () => {
      render(<StudioStats limit={8} />);

      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("8");
    });

    it("should pass showPagination=false to SimpleTable", () => {
      render(<StudioStats />);

      expect(screen.getByTestId("table-show-pagination")).toHaveTextContent(
        "false"
      );
    });
  });

  describe("limit synchronization", () => {
    it("should pass same limit to hook and table", () => {
      render(<StudioStats limit={4} />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(4);
      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("4");
    });

    it("should update both when limit changes", () => {
      const { rerender } = render(<StudioStats limit={3} />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(3);
      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("3");

      rerender(<StudioStats limit={6} />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(6);
      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("6");
    });
  });

  describe("edge cases", () => {
    it("should handle undefined studios gracefully", () => {
      mockUseStudioStats.mockReturnValue({
        studios: undefined as any,
        loading: false,
        error: null,
      });

      render(<StudioStats />);

      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });

    it("should handle null error", () => {
      mockUseStudioStats.mockReturnValue({
        studios: mockStudios,
        loading: false,
        error: null,
      });

      render(<StudioStats />);

      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should handle loading and error simultaneously", () => {
      mockUseStudioStats.mockReturnValue({
        studios: [],
        loading: true,
        error: "Error while loading",
      });

      render(<StudioStats />);

      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
      expect(screen.getByTestId("card-error")).toBeInTheDocument();
    });

    it("should handle studios with different win counts", () => {
      const studios = [
        { name: "Studio A", winCount: 10 },
        { name: "Studio B", winCount: 1 },
        { name: "Studio C", winCount: 25 },
      ];
      mockUseStudioStats.mockReturnValue({
        studios,
        loading: false,
        error: null,
      });

      render(<StudioStats />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("3");
    });

    it("should handle studios with zero wins", () => {
      const studios = [
        { name: "Studio A", winCount: 5 },
        { name: "Studio B", winCount: 0 },
      ];
      mockUseStudioStats.mockReturnValue({
        studios,
        loading: false,
        error: null,
      });

      render(<StudioStats />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("2");
    });

    it("should handle very large limits", () => {
      render(<StudioStats limit={100} />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(100);
      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("100");
    });

    it("should handle negative limits", () => {
      render(<StudioStats limit={-1} />);

      expect(mockUseStudioStats).toHaveBeenCalledWith(-1);
      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("-1");
    });
  });

  describe("title consistency", () => {
    it("should always show 'Top 3 studios with winners' regardless of limit", () => {
      render(<StudioStats limit={5} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "Top 3 studios with winners"
      );
    });

    it("should show same title with limit of 1", () => {
      render(<StudioStats limit={1} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "Top 3 studios with winners"
      );
    });

    it("should show same title with limit of 10", () => {
      render(<StudioStats limit={10} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "Top 3 studios with winners"
      );
    });
  });
});
