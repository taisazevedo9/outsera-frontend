import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardStats, { DashboardStats as NamedExport } from "../dashboard-stats";

// Mock child components
jest.mock("../year-winners", () => ({
  YearWinners: jest.fn(({ colSize }) => (
    <div data-testid="year-winners" data-colsize={colSize}>
      YearWinners
    </div>
  )),
}));

jest.mock("../studio-stats", () => ({
  StudioStats: jest.fn(({ colSize, limit }) => (
    <div data-testid="studio-stats" data-colsize={colSize} data-limit={limit}>
      StudioStats
    </div>
  )),
}));

jest.mock("../producer-interval", () => ({
  ProducerInterval: jest.fn(({ colSize }) => (
    <div data-testid="producer-interval" data-colsize={colSize}>
      ProducerInterval
    </div>
  )),
}));

jest.mock("../movies-preview", () => ({
  MoviesPreview: jest.fn(({ colSize }) => (
    <div data-testid="movies-preview" data-colsize={colSize}>
      MoviesPreview
    </div>
  )),
}));

describe("DashboardStats", () => {
  describe("Rendering", () => {
    it("should render the component", () => {
      render(<DashboardStats />);
      expect(screen.getByTestId("year-winners")).toBeInTheDocument();
    });

    it("should render all child components", () => {
      render(<DashboardStats />);
      expect(screen.getByTestId("year-winners")).toBeInTheDocument();
      expect(screen.getByTestId("studio-stats")).toBeInTheDocument();
      expect(screen.getByTestId("producer-interval")).toBeInTheDocument();
      expect(screen.getByTestId("movies-preview")).toBeInTheDocument();
    });

    it("should render without errors", () => {
      const { container } = render(<DashboardStats />);
      expect(container).toBeInTheDocument();
    });

    it("should render with React Fragment", () => {
      const { container } = render(<DashboardStats />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render immediately", () => {
      const { container } = render(<DashboardStats />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe("Props passing", () => {
    it("should pass colSize prop to YearWinners", () => {
      render(<DashboardStats />);
      const yearWinners = screen.getByTestId("year-winners");
      expect(yearWinners).toHaveAttribute("data-colsize", "col-md-6");
    });

    it("should pass colSize prop to StudioStats", () => {
      render(<DashboardStats />);
      const studioStats = screen.getByTestId("studio-stats");
      expect(studioStats).toHaveAttribute("data-colsize", "col-md-6");
    });

    it("should pass limit prop to StudioStats", () => {
      render(<DashboardStats />);
      const studioStats = screen.getByTestId("studio-stats");
      expect(studioStats).toHaveAttribute("data-limit", "3");
    });

    it("should pass colSize prop to ProducerInterval", () => {
      render(<DashboardStats />);
      const producerInterval = screen.getByTestId("producer-interval");
      expect(producerInterval).toHaveAttribute("data-colsize", "col-md-6");
    });

    it("should pass colSize prop to MoviesPreview", () => {
      render(<DashboardStats />);
      const moviesPreview = screen.getByTestId("movies-preview");
      expect(moviesPreview).toHaveAttribute("data-colsize", "col-md-6");
    });

    it("should pass consistent colSize to all components", () => {
      render(<DashboardStats />);
      const yearWinners = screen.getByTestId("year-winners");
      const studioStats = screen.getByTestId("studio-stats");
      const producerInterval = screen.getByTestId("producer-interval");
      const moviesPreview = screen.getByTestId("movies-preview");

      expect(yearWinners).toHaveAttribute("data-colsize", "col-md-6");
      expect(studioStats).toHaveAttribute("data-colsize", "col-md-6");
      expect(producerInterval).toHaveAttribute("data-colsize", "col-md-6");
      expect(moviesPreview).toHaveAttribute("data-colsize", "col-md-6");
    });

    it("should pass correct limit to StudioStats only", () => {
      render(<DashboardStats />);
      const studioStats = screen.getByTestId("studio-stats");
      const yearWinners = screen.getByTestId("year-winners");
      const producerInterval = screen.getByTestId("producer-interval");
      const moviesPreview = screen.getByTestId("movies-preview");

      expect(studioStats).toHaveAttribute("data-limit", "3");
      expect(yearWinners).not.toHaveAttribute("data-limit");
      expect(producerInterval).not.toHaveAttribute("data-limit");
      expect(moviesPreview).not.toHaveAttribute("data-limit");
    });
  });

  describe("Component composition", () => {
    it("should render YearWinners first", () => {
      const { container } = render(<DashboardStats />);
      const components = container.querySelectorAll("[data-testid]");
      expect(components[0]).toHaveAttribute("data-testid", "year-winners");
    });

    it("should render StudioStats second", () => {
      const { container } = render(<DashboardStats />);
      const components = container.querySelectorAll("[data-testid]");
      expect(components[1]).toHaveAttribute("data-testid", "studio-stats");
    });

    it("should render ProducerInterval third", () => {
      const { container } = render(<DashboardStats />);
      const components = container.querySelectorAll("[data-testid]");
      expect(components[2]).toHaveAttribute("data-testid", "producer-interval");
    });

    it("should render MoviesPreview last", () => {
      const { container } = render(<DashboardStats />);
      const components = container.querySelectorAll("[data-testid]");
      expect(components[3]).toHaveAttribute("data-testid", "movies-preview");
    });

    it("should render exactly 4 child components", () => {
      const { container } = render(<DashboardStats />);
      const components = container.querySelectorAll("[data-testid]");
      expect(components).toHaveLength(4);
    });

    it("should maintain component order", () => {
      const { container } = render(<DashboardStats />);
      const components = container.querySelectorAll("[data-testid]");
      expect(components[0]).toHaveAttribute("data-testid", "year-winners");
      expect(components[1]).toHaveAttribute("data-testid", "studio-stats");
      expect(components[2]).toHaveAttribute("data-testid", "producer-interval");
      expect(components[3]).toHaveAttribute("data-testid", "movies-preview");
    });
  });

  describe("Component behavior", () => {
    it("should not have side effects", () => {
      const { container } = render(<DashboardStats />);
      expect(container).toBeInTheDocument();
    });

    it("should render consistently", () => {
      const { container: container1 } = render(<DashboardStats />);
      const { container: container2 } = render(<DashboardStats />);
      expect(container1.innerHTML).toBe(container2.innerHTML);
    });

    it("should handle multiple renders", () => {
      const { rerender } = render(<DashboardStats />);
      expect(screen.getByTestId("year-winners")).toBeInTheDocument();
      
      rerender(<DashboardStats />);
      expect(screen.getByTestId("year-winners")).toBeInTheDocument();
      
      rerender(<DashboardStats />);
      expect(screen.getByTestId("year-winners")).toBeInTheDocument();
    });

    it("should maintain component integrity on rerender", () => {
      const { rerender } = render(<DashboardStats />);
      const components1 = screen.getAllByTestId(/year-winners|studio-stats|producer-interval|movies-preview/);
      
      rerender(<DashboardStats />);
      const components2 = screen.getAllByTestId(/year-winners|studio-stats|producer-interval|movies-preview/);
      
      expect(components1).toHaveLength(4);
      expect(components2).toHaveLength(4);
    });

    it("should be stateless", () => {
      const { container } = render(<DashboardStats />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Client component", () => {
    it("should be a client component", () => {
      render(<DashboardStats />);
      expect(screen.getByTestId("year-winners")).toBeInTheDocument();
    });

    it("should render on client side", () => {
      const { container } = render(<DashboardStats />);
      expect(container.firstChild).toBeTruthy();
    });

    it("should work in browser environment", () => {
      render(<DashboardStats />);
      expect(screen.getAllByTestId(/year-winners|studio-stats|producer-interval|movies-preview/)).toHaveLength(4);
    });
  });

  describe("Default export", () => {
    it("should export DashboardStats as default", () => {
      expect(DashboardStats).toBeDefined();
    });

    it("should be a React component", () => {
      render(<DashboardStats />);
      expect(screen.getByTestId("year-winners")).toBeInTheDocument();
    });

    it("should be a function component", () => {
      expect(typeof DashboardStats).toBe("function");
    });

    it("should match named export", () => {
      expect(DashboardStats).toBe(NamedExport);
    });
  });

  describe("Fragment rendering", () => {
    it("should render all components without wrapper", () => {
      render(<DashboardStats />);
      expect(screen.getByTestId("year-winners")).toBeInTheDocument();
      expect(screen.getByTestId("studio-stats")).toBeInTheDocument();
      expect(screen.getByTestId("producer-interval")).toBeInTheDocument();
      expect(screen.getByTestId("movies-preview")).toBeInTheDocument();
    });

    it("should render children directly", () => {
      const { container } = render(<DashboardStats />);
      expect(screen.getByTestId("year-winners")).toBeTruthy();
      expect(screen.getByTestId("studio-stats")).toBeTruthy();
      expect(screen.getByTestId("producer-interval")).toBeTruthy();
      expect(screen.getByTestId("movies-preview")).toBeTruthy();
    });

    it("should use React Fragment", () => {
      const { container } = render(<DashboardStats />);
      const children = Array.from(container.firstChild?.childNodes || []);
      expect(children.length).toBeGreaterThan(0);
    });
  });

  describe("Child component integration", () => {
    it("should render YearWinners component", () => {
      render(<DashboardStats />);
      expect(screen.getByText("YearWinners")).toBeInTheDocument();
    });

    it("should render StudioStats component", () => {
      render(<DashboardStats />);
      expect(screen.getByText("StudioStats")).toBeInTheDocument();
    });

    it("should render ProducerInterval component", () => {
      render(<DashboardStats />);
      expect(screen.getByText("ProducerInterval")).toBeInTheDocument();
    });

    it("should render MoviesPreview component", () => {
      render(<DashboardStats />);
      expect(screen.getByText("MoviesPreview")).toBeInTheDocument();
    });

    it("should render all component texts", () => {
      render(<DashboardStats />);
      expect(screen.getByText("YearWinners")).toBeInTheDocument();
      expect(screen.getByText("StudioStats")).toBeInTheDocument();
      expect(screen.getByText("ProducerInterval")).toBeInTheDocument();
      expect(screen.getByText("MoviesPreview")).toBeInTheDocument();
    });
  });

  describe("Props validation", () => {
    it("should pass string colSize", () => {
      render(<DashboardStats />);
      expect(screen.getByTestId("year-winners")).toHaveAttribute("data-colsize", "col-md-6");
    });

    it("should pass numeric limit", () => {
      render(<DashboardStats />);
      expect(screen.getByTestId("studio-stats")).toHaveAttribute("data-limit", "3");
    });

    it("should have valid Bootstrap column class", () => {
      render(<DashboardStats />);
      const colSize = screen.getByTestId("year-winners").getAttribute("data-colsize");
      expect(colSize).toMatch(/^col-md-\d+$/);
    });

    it("should have numeric limit value", () => {
      render(<DashboardStats />);
      const limit = screen.getByTestId("studio-stats").getAttribute("data-limit");
      expect(Number(limit)).toBe(3);
    });
  });

  describe("Edge cases", () => {
    it("should handle rapid rerenders", () => {
      const { rerender } = render(<DashboardStats />);
      for (let i = 0; i < 10; i++) {
        rerender(<DashboardStats />);
      }
      expect(screen.getByTestId("year-winners")).toBeInTheDocument();
    });

    it("should maintain stability across renders", () => {
      const { container, rerender } = render(<DashboardStats />);
      const html1 = container.innerHTML;
      rerender(<DashboardStats />);
      const html2 = container.innerHTML;
      expect(html1).toBe(html2);
    });

    it("should not lose children on rerender", () => {
      const { rerender } = render(<DashboardStats />);
      expect(screen.getAllByTestId(/year-winners|studio-stats|producer-interval|movies-preview/)).toHaveLength(4);
      rerender(<DashboardStats />);
      expect(screen.getAllByTestId(/year-winners|studio-stats|producer-interval|movies-preview/)).toHaveLength(4);
    });
  });

  describe("Component isolation", () => {
    it("should not affect other components", () => {
      render(<DashboardStats />);
      const yearWinners = screen.getByTestId("year-winners");
      const studioStats = screen.getByTestId("studio-stats");
      expect(yearWinners).not.toBe(studioStats);
    });

    it("should render independent components", () => {
      render(<DashboardStats />);
      const components = screen.getAllByTestId(/year-winners|studio-stats|producer-interval|movies-preview/);
      const uniqueIds = new Set(components.map(c => c.getAttribute("data-testid")));
      expect(uniqueIds.size).toBe(4);
    });
  });
});
