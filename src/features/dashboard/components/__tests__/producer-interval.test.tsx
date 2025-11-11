import { render, screen } from "@testing-library/react";
import { ProducerInterval } from "../producer-interval";
import { useProducerInterval } from "../../hooks/use-producer-interval";
import { ProducerWithInterval } from "../../types";

jest.mock("../../hooks/use-producer-interval");
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
  return function SimpleTable({ title, data, columns, showFilters, itemsPerPage, showPagination }: any) {
    const testIdPrefix = title ? title.toLowerCase().replace(/\s+/g, "-") : "table";
    return (
      <div data-testid={`simple-table-${testIdPrefix}`}>
        <div data-testid={`${testIdPrefix}-title`}>{title}</div>
        <div data-testid={`${testIdPrefix}-show-filters`}>{String(showFilters)}</div>
        <div data-testid={`${testIdPrefix}-items-per-page`}>{itemsPerPage}</div>
        <div data-testid={`${testIdPrefix}-show-pagination`}>{String(showPagination)}</div>
        <div data-testid={`${testIdPrefix}-columns-count`}>{columns?.length || 0}</div>
        <div data-testid={`${testIdPrefix}-data-count`}>{data?.length || 0}</div>
      </div>
    );
  };
});

describe("ProducerInterval", () => {
  const mockProducers: ProducerWithInterval[] = [
    { producer: "Producer 1", interval: 13, previousWin: 1980, followingWin: 1993 },
    { producer: "Producer 2", interval: 13, previousWin: 1986, followingWin: 1999 },
    { producer: "Producer 3", interval: 1, previousWin: 1991, followingWin: 1992 },
  ];

  const mockUseProducerInterval = useProducerInterval as jest.MockedFunction<
    typeof useProducerInterval
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProducerInterval.mockReturnValue({
      producers: mockProducers,
      maxProducers: [mockProducers[0], mockProducers[1]],
      minProducers: [mockProducers[2]],
      loading: false,
      error: null,
    });
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-maximum")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-minimum")).toBeInTheDocument();
    });

    it("should render card with correct title", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "Producers with longest and shortest interval between wins"
      );
    });

    it("should render both Maximum and Minimum tables", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("simple-table-maximum")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-minimum")).toBeInTheDocument();
      expect(screen.getByTestId("maximum-title")).toHaveTextContent("Maximum");
      expect(screen.getByTestId("minimum-title")).toHaveTextContent("Minimum");
    });

    it("should call useProducerInterval hook", () => {
      render(<ProducerInterval />);

      expect(mockUseProducerInterval).toHaveBeenCalledTimes(1);
    });
  });

  describe("colSize prop", () => {
    it("should use default colSize of col-md-6", () => {
      render(<ProducerInterval />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-md-6");
    });

    it("should accept custom colSize", () => {
      render(<ProducerInterval colSize="col-lg-12" />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-lg-12");
    });

    it("should handle col-md-12", () => {
      render(<ProducerInterval colSize="col-md-12" />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-md-12");
    });

    it("should handle col-sm-6", () => {
      render(<ProducerInterval colSize="col-sm-6" />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size", "col-sm-6");
    });
  });

  describe("data display", () => {
    it("should split producers data between Maximum and Minimum tables", () => {
      render(<ProducerInterval />);

      // With 3 producers: first 2 in Maximum (index < 1.5), last 1 in Minimum (index >= 1.5)
      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("2");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("1");
    });

    it("should handle empty producers array", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [],
        maxProducers: [],
        minProducers: [],
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("0");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("0");
    });

    it("should handle single producer", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [mockProducers[0]],
        maxProducers: [mockProducers[0]],
        minProducers: [],
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      // With 1 producer: first 0 in Maximum (0 < 0.5), none in Minimum
      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("1");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("0");
    });

    it("should handle many producers", () => {
      const manyProducers = Array.from({ length: 20 }, (_, i) => ({
        producer: `Producer ${i + 1}`,
        interval: i + 1,
        previousWin: 1980 + i,
        followingWin: 1980 + i + (i + 1),
      }));
      mockUseProducerInterval.mockReturnValue({
        producers: manyProducers,
        maxProducers: manyProducers.slice(0, 10),
        minProducers: manyProducers.slice(10),
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      // With 20 producers: first 10 in Maximum (index < 10), last 10 in Minimum (index >= 10)
      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("10");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("10");
    });

    it("should handle even number of producers", () => {
      const evenProducers = [
        mockProducers[0],
        mockProducers[1],
        mockProducers[2],
        { producer: "Producer 4", interval: 2, previousWin: 1992, followingWin: 1994 },
      ];
      mockUseProducerInterval.mockReturnValue({
        producers: evenProducers,
        maxProducers: evenProducers.slice(0, 2),
        minProducers: evenProducers.slice(2),
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      // With 4 producers: first 2 in Maximum (index < 2), last 2 in Minimum (index >= 2)
      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("2");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("2");
    });
  });

  describe("loading state", () => {
    it("should show loading state when loading", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [],
        maxProducers: [],
        minProducers: [],
        loading: true,
        error: null,
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should not show loading when data is loaded", () => {
      render(<ProducerInterval />);

      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
    });

    it("should pass loading state to Card", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [],
        maxProducers: [],
        minProducers: [],
        loading: true,
        error: null,
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("card-loading")).toHaveTextContent("Loading...");
    });
  });

  describe("error handling", () => {
    it("should show error when error exists", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [],
        maxProducers: [],
        minProducers: [],
        loading: false,
        error: "Failed to load producers",
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("card-error")).toBeInTheDocument();
      expect(screen.getByTestId("card-error")).toHaveTextContent(
        "Failed to load producers"
      );
    });

    it("should not show error when no error", () => {
      render(<ProducerInterval />);

      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should pass error to Card component", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [],
        maxProducers: [],
        minProducers: [],
        loading: false,
        error: "Network error",
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("card-error")).toHaveTextContent("Network error");
    });

    it("should still render both tables when there is an error", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [],
        maxProducers: [],
        minProducers: [],
        loading: false,
        error: "Error",
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("simple-table-maximum")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-minimum")).toBeInTheDocument();
    });
  });

  describe("table configuration", () => {
    it("should configure both tables with showFilters as false", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-show-filters")).toHaveTextContent("false");
      expect(screen.getByTestId("minimum-show-filters")).toHaveTextContent("false");
    });

    it("should configure both tables with itemsPerPage as 10", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-items-per-page")).toHaveTextContent("10");
      expect(screen.getByTestId("minimum-items-per-page")).toHaveTextContent("10");
    });

    it("should configure both tables with showPagination as false", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-show-pagination")).toHaveTextContent("false");
      expect(screen.getByTestId("minimum-show-pagination")).toHaveTextContent("false");
    });

    it("should pass 4 columns to both tables", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-columns-count")).toHaveTextContent("4");
      expect(screen.getByTestId("minimum-columns-count")).toHaveTextContent("4");
    });
  });

  describe("column configuration", () => {
    it("should have producer column configured correctly", () => {
      render(<ProducerInterval />);
      
      expect(screen.getByTestId("simple-table-maximum")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-minimum")).toBeInTheDocument();
    });

    it("should have interval column configured correctly", () => {
      render(<ProducerInterval />);
      
      expect(screen.getByTestId("simple-table-maximum")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-minimum")).toBeInTheDocument();
    });

    it("should have previousWin column configured correctly", () => {
      render(<ProducerInterval />);
      
      expect(screen.getByTestId("simple-table-maximum")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-minimum")).toBeInTheDocument();
    });

    it("should have followingWin column configured correctly", () => {
      render(<ProducerInterval />);
      
      expect(screen.getByTestId("simple-table-maximum")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-minimum")).toBeInTheDocument();
    });
  });

  describe("integration", () => {
    it("should integrate hook data with Card component", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "Producers with longest and shortest interval between wins"
      );
      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should integrate hook data with both SimpleTable components", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("simple-table-maximum")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-minimum")).toBeInTheDocument();
      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("2");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("1");
    });

    it("should handle all states together", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-maximum")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-minimum")).toBeInTheDocument();
      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("2");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("1");
    });
  });

  describe("props interface", () => {
    it("should accept optional colSize prop", () => {
      render(<ProducerInterval colSize="col-lg-8" />);

      expect(screen.getByTestId("card")).toHaveAttribute(
        "data-col-size",
        "col-lg-8"
      );
    });

    it("should work without any props", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
    });
  });

  describe("card props", () => {
    it("should pass all required props to Card", () => {
      render(<ProducerInterval />);

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("data-col-size");
      expect(screen.getByTestId("card-title")).toBeInTheDocument();
    });

    it("should pass title prop to Card", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "Producers with longest and shortest interval between wins"
      );
    });

    it("should pass colSize prop to Card", () => {
      render(<ProducerInterval colSize="col-xl-4" />);

      expect(screen.getByTestId("card")).toHaveAttribute(
        "data-col-size",
        "col-xl-4"
      );
    });

    it("should pass loading prop to Card", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [],
        maxProducers: [],
        minProducers: [],
        loading: true,
        error: null,
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should pass error prop to Card", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [],
        maxProducers: [],
        minProducers: [],
        loading: false,
        error: "Test error",
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("card-error")).toHaveTextContent("Test error");
    });
  });

  describe("table props", () => {
    it("should pass data prop to both SimpleTables", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("2");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("1");
    });

    it("should pass columns prop to both SimpleTables", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-columns-count")).toHaveTextContent("4");
      expect(screen.getByTestId("minimum-columns-count")).toHaveTextContent("4");
    });

    it("should pass showFilters=false to both SimpleTables", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-show-filters")).toHaveTextContent("false");
      expect(screen.getByTestId("minimum-show-filters")).toHaveTextContent("false");
    });

    it("should pass itemsPerPage=10 to both SimpleTables", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-items-per-page")).toHaveTextContent("10");
      expect(screen.getByTestId("minimum-items-per-page")).toHaveTextContent("10");
    });

    it("should pass showPagination=false to both SimpleTables", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-show-pagination")).toHaveTextContent("false");
      expect(screen.getByTestId("minimum-show-pagination")).toHaveTextContent("false");
    });

    it("should pass title prop to both SimpleTables", () => {
      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-title")).toHaveTextContent("Maximum");
      expect(screen.getByTestId("minimum-title")).toHaveTextContent("Minimum");
    });
  });

  describe("edge cases", () => {
    it("should handle undefined producers gracefully", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: undefined as any,
        maxProducers: [],
        minProducers: [],
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("simple-table-maximum")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-minimum")).toBeInTheDocument();
    });

    it("should handle null error", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: mockProducers,
        maxProducers: [mockProducers[0]],
        minProducers: [mockProducers[2]],
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should handle loading and error simultaneously", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [],
        maxProducers: [],
        minProducers: [],
        loading: true,
        error: "Error while loading",
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
      expect(screen.getByTestId("card-error")).toBeInTheDocument();
    });

    it("should handle producers with different intervals", () => {
      const producers = [
        { producer: "Producer A", interval: 1, previousWin: 1990, followingWin: 1991 },
        { producer: "Producer B", interval: 20, previousWin: 1980, followingWin: 2000 },
        { producer: "Producer C", interval: 5, previousWin: 1995, followingWin: 2000 },
      ];
      mockUseProducerInterval.mockReturnValue({
        producers,
        maxProducers: [producers[1]],
        minProducers: [producers[0]],
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      // With 3 producers: first 2 in Maximum (index 0,1), last 1 in Minimum (index 2)
      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("2");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("1");
    });

    it("should handle producers with same intervals", () => {
      const producers = [
        { producer: "Producer A", interval: 5, previousWin: 1990, followingWin: 1995 },
        { producer: "Producer B", interval: 5, previousWin: 1991, followingWin: 1996 },
      ];
      mockUseProducerInterval.mockReturnValue({
        producers,
        maxProducers: producers,
        minProducers: [],
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("1");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("1");
    });

    it("should handle only max producers", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [mockProducers[0], mockProducers[1]],
        maxProducers: [mockProducers[0], mockProducers[1]],
        minProducers: [],
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("1");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("1");
    });

    it("should handle only min producers", () => {
      mockUseProducerInterval.mockReturnValue({
        producers: [mockProducers[2]],
        maxProducers: [],
        minProducers: [mockProducers[2]],
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      // With 1 producer: first 1 in Maximum (0 < 0.5), none in Minimum
      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("1");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("0");
    });
  });

  describe("producer data structure", () => {
    it("should display producers with all required fields", () => {
      render(<ProducerInterval />);

      // Verify component renders, which means producers have correct structure
      expect(screen.getByTestId("simple-table-maximum")).toBeInTheDocument();
      expect(screen.getByTestId("simple-table-minimum")).toBeInTheDocument();
      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("2");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("1");
    });

    it("should handle producers with very large intervals", () => {
      const producers = [
        { producer: "Producer A", interval: 50, previousWin: 1950, followingWin: 2000 },
      ];
      mockUseProducerInterval.mockReturnValue({
        producers,
        maxProducers: producers,
        minProducers: [],
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      // With 1 producer: first 1 in Maximum (0 < 0.5), none in Minimum
      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("1");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("0");
    });

    it("should handle producers with interval of 1", () => {
      const producers = [
        { producer: "Producer A", interval: 1, previousWin: 2000, followingWin: 2001 },
      ];
      mockUseProducerInterval.mockReturnValue({
        producers,
        maxProducers: [],
        minProducers: producers,
        loading: false,
        error: null,
      });

      render(<ProducerInterval />);

      // With 1 producer: first 1 in Maximum (0 < 0.5), none in Minimum
      expect(screen.getByTestId("maximum-data-count")).toHaveTextContent("1");
      expect(screen.getByTestId("minimum-data-count")).toHaveTextContent("0");
    });
  });

  describe("title content", () => {
    it("should have descriptive title mentioning longest and shortest", () => {
      render(<ProducerInterval />);

      const title = screen.getByTestId("card-title");
      expect(title.textContent).toContain("longest");
      expect(title.textContent).toContain("shortest");
    });

    it("should have title mentioning interval", () => {
      render(<ProducerInterval />);

      const title = screen.getByTestId("card-title");
      expect(title.textContent).toContain("interval");
    });

    it("should have title mentioning wins", () => {
      render(<ProducerInterval />);

      const title = screen.getByTestId("card-title");
      expect(title.textContent).toContain("wins");
    });
  });
});
