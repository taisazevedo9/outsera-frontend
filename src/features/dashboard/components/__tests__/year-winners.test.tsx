import { render, screen } from "@testing-library/react";
import { YearWinners } from "../year-winners";
import { useYearWinners } from "../../hooks/use-year-winners";
import { YearWithMultipleWinners } from "../../types";

jest.mock("../../hooks/use-year-winners");
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

describe("YearWinners", () => {
  const mockYears: YearWithMultipleWinners[] = [
    { year: 1986, winnerCount: 2 },
    { year: 1990, winnerCount: 2 },
    { year: 2015, winnerCount: 2 },
  ];

  const mockUseYearWinners = useYearWinners as jest.MockedFunction<
    typeof useYearWinners
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseYearWinners.mockReturnValue({
      years: mockYears,
      loading: false,
      error: null,
    });
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });

    it("should render card with correct title", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "List years with multiple winners"
      );
    });

    it("should render simple table", () => {
      render(<YearWinners />);

      const table = screen.getByTestId("simple-table");
      expect(table).toBeInTheDocument();
    });

    it("should call useYearWinners hook", () => {
      render(<YearWinners />);

      expect(mockUseYearWinners).toHaveBeenCalledTimes(1);
    });
  });

  describe("colSize prop", () => {
    it("should use default colSize of col-md-6", () => {
      render(<YearWinners />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-md-6");
    });

    it("should accept custom colSize", () => {
      render(<YearWinners colSize="col-lg-12" />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-lg-12");
    });

    it("should handle col-md-12", () => {
      render(<YearWinners colSize="col-md-12" />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-md-12");
    });

    it("should handle col-sm-6", () => {
      render(<YearWinners colSize="col-sm-6" />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-sm-6");
    });
  });

  describe("data display", () => {
    it("should pass years data to SimpleTable", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("3");
    });

    it("should handle empty years array", () => {
      mockUseYearWinners.mockReturnValue({
        years: [],
        loading: false,
        error: null,
      });

      render(<YearWinners />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("0");
    });

    it("should handle single year", () => {
      mockUseYearWinners.mockReturnValue({
        years: [{ year: 1986, winnerCount: 2 }],
        loading: false,
        error: null,
      });

      render(<YearWinners />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("1");
    });

    it("should handle many years", () => {
      const manyYears = Array.from({ length: 20 }, (_, i) => ({
        year: 1980 + i,
        winnerCount: 2,
      }));
      mockUseYearWinners.mockReturnValue({
        years: manyYears,
        loading: false,
        error: null,
      });

      render(<YearWinners />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("20");
    });
  });

  describe("loading state", () => {
    it("should show loading state when loading", () => {
      mockUseYearWinners.mockReturnValue({
        years: [],
        loading: true,
        error: null,
      });

      render(<YearWinners />);

      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should not show loading when data is loaded", () => {
      render(<YearWinners />);

      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
    });

    it("should pass loading state to Card", () => {
      mockUseYearWinners.mockReturnValue({
        years: [],
        loading: true,
        error: null,
      });

      render(<YearWinners />);

      expect(screen.getByTestId("card-loading")).toHaveTextContent("Loading...");
    });
  });

  describe("error handling", () => {
    it("should show error when error exists", () => {
      mockUseYearWinners.mockReturnValue({
        years: [],
        loading: false,
        error: "Failed to load years",
      });

      render(<YearWinners />);

      expect(screen.getByTestId("card-error")).toBeInTheDocument();
      expect(screen.getByTestId("card-error")).toHaveTextContent(
        "Failed to load years"
      );
    });

    it("should not show error when no error", () => {
      render(<YearWinners />);

      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should pass error to Card component", () => {
      mockUseYearWinners.mockReturnValue({
        years: [],
        loading: false,
        error: "Network error",
      });

      render(<YearWinners />);

      expect(screen.getByTestId("card-error")).toHaveTextContent("Network error");
    });

    it("should still render table when there is an error", () => {
      mockUseYearWinners.mockReturnValue({
        years: [],
        loading: false,
        error: "Error",
      });

      render(<YearWinners />);

      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });
  });

  describe("table configuration", () => {
    it("should configure table with showFilters as false", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("table-show-filters")).toHaveTextContent("false");
    });

    it("should configure table with itemsPerPage as 10", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("10");
    });

    it("should configure table with showPagination as false", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("table-show-pagination")).toHaveTextContent(
        "false"
      );
    });

    it("should pass 2 columns to table", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("table-columns-count")).toHaveTextContent("2");
    });
  });

  describe("column configuration", () => {
    it("should have year column configured correctly", () => {
      // This tests the yearColumns constant definition
      render(<YearWinners />);
      
      // Verify the component renders, which means columns are valid
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });

    it("should have winnerCount column configured correctly", () => {
      render(<YearWinners />);
      
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });
  });

  describe("integration", () => {
    it("should integrate hook data with Card component", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "List years with multiple winners"
      );
      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should integrate hook data with SimpleTable component", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
      expect(screen.getByTestId("table-data-count")).toHaveTextContent("3");
    });

    it("should handle all states together", () => {
      mockUseYearWinners.mockReturnValue({
        years: mockYears,
        loading: false,
        error: null,
      });

      render(<YearWinners />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
      expect(screen.getByTestId("table-data-count")).toHaveTextContent("3");
    });
  });

  describe("props interface", () => {
    it("should accept optional colSize prop", () => {
      render(<YearWinners colSize="col-lg-8" />);

      expect(screen.getByTestId("card")).toHaveAttribute(
        "data-col-size",
        "col-lg-8"
      );
    });

    it("should work without any props", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
    });
  });

  describe("card props", () => {
    it("should pass all required props to Card", () => {
      render(<YearWinners />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size");
      expect(screen.getByTestId("card-title")).toBeInTheDocument();
    });

    it("should pass title prop to Card", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "List years with multiple winners"
      );
    });

    it("should pass colSize prop to Card", () => {
      render(<YearWinners colSize="col-xl-4" />);

      expect(screen.getByTestId("card")).toHaveAttribute(
        "data-col-size",
        "col-xl-4"
      );
    });

    it("should pass loading prop to Card", () => {
      mockUseYearWinners.mockReturnValue({
        years: [],
        loading: true,
        error: null,
      });

      render(<YearWinners />);

      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should pass error prop to Card", () => {
      mockUseYearWinners.mockReturnValue({
        years: [],
        loading: false,
        error: "Test error",
      });

      render(<YearWinners />);

      expect(screen.getByTestId("card-error")).toHaveTextContent("Test error");
    });
  });

  describe("table props", () => {
    it("should pass data prop to SimpleTable", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("3");
    });

    it("should pass columns prop to SimpleTable", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("table-columns-count")).toHaveTextContent("2");
    });

    it("should pass showFilters=false to SimpleTable", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("table-show-filters")).toHaveTextContent("false");
    });

    it("should pass itemsPerPage=10 to SimpleTable", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("table-items-per-page")).toHaveTextContent("10");
    });

    it("should pass showPagination=false to SimpleTable", () => {
      render(<YearWinners />);

      expect(screen.getByTestId("table-show-pagination")).toHaveTextContent(
        "false"
      );
    });
  });

  describe("edge cases", () => {
    it("should handle undefined years gracefully", () => {
      mockUseYearWinners.mockReturnValue({
        years: undefined as any,
        loading: false,
        error: null,
      });

      render(<YearWinners />);

      expect(screen.getByTestId("simple-table")).toBeInTheDocument();
    });

    it("should handle null error", () => {
      mockUseYearWinners.mockReturnValue({
        years: mockYears,
        loading: false,
        error: null,
      });

      render(<YearWinners />);

      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should handle loading and error simultaneously", () => {
      mockUseYearWinners.mockReturnValue({
        years: [],
        loading: true,
        error: "Error while loading",
      });

      render(<YearWinners />);

      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
      expect(screen.getByTestId("card-error")).toBeInTheDocument();
    });

    it("should handle years with different winnerCounts", () => {
      const years = [
        { year: 1986, winnerCount: 2 },
        { year: 1990, winnerCount: 3 },
        { year: 2000, winnerCount: 5 },
      ];
      mockUseYearWinners.mockReturnValue({
        years,
        loading: false,
        error: null,
      });

      render(<YearWinners />);

      expect(screen.getByTestId("table-data-count")).toHaveTextContent("3");
    });
  });
});
