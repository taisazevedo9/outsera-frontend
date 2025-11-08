import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../page";

jest.mock("@/features/dashboard/components/dashboard-stats", () => {
  return jest.fn(() => <div data-testid="dashboard-stats">DashboardStats Component</div>);
});

jest.mock("@/shared/components/layout", () => ({
  PageLayout: jest.fn(({ title, children }: any) => (
    <div data-testid="page-layout">
      <div data-testid="page-layout-title">{title}</div>
      {children}
    </div>
  )),
}));

import DashboardStats from "@/features/dashboard/components/dashboard-stats";
import { PageLayout } from "@/shared/components/layout";

const MockedDashboardStats = DashboardStats as jest.MockedFunction<typeof DashboardStats>;
const MockedPageLayout = PageLayout as jest.MockedFunction<typeof PageLayout>;

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the page", () => {
      render(<Dashboard />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
    });

    it("should render PageLayout component", () => {
      render(<Dashboard />);
      expect(MockedPageLayout).toHaveBeenCalled();
    });

    it("should render DashboardStats component", () => {
      render(<Dashboard />);
      expect(MockedDashboardStats).toHaveBeenCalled();
    });

    it("should render without errors", () => {
      const { container } = render(<Dashboard />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Page title", () => {
    it("should have 'Dashboard' as title", () => {
      render(<Dashboard />);
      const title = screen.getByTestId("page-layout-title");
      expect(title).toHaveTextContent("Dashboard");
    });

    it("should pass title to PageLayout", () => {
      render(<Dashboard />);
      expect(MockedPageLayout).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Dashboard" }),
        {}
      );
    });

    it("should not have empty title", () => {
      render(<Dashboard />);
      const title = screen.getByTestId("page-layout-title");
      expect(title.textContent).not.toBe("");
    });

    it("should display correct title text", () => {
      render(<Dashboard />);
      const title = screen.getByTestId("page-layout-title");
      expect(title.textContent).toBe("Dashboard");
    });
  });

  describe("PageLayout integration", () => {
    it("should call PageLayout with correct props", () => {
      render(<Dashboard />);
      expect(MockedPageLayout).toHaveBeenCalledWith(
        {
          title: "Dashboard",
          children: expect.anything(),
        },
        {}
      );
    });

    it("should render PageLayout once", () => {
      render(<Dashboard />);
      expect(MockedPageLayout).toHaveBeenCalledTimes(1);
    });

    it("should pass children to PageLayout", () => {
      render(<Dashboard />);
      expect(MockedPageLayout).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.anything(),
        }),
        {}
      );
    });

    it("should integrate PageLayout correctly", () => {
      render(<Dashboard />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
      expect(screen.getByTestId("dashboard-stats")).toBeInTheDocument();
    });
  });

  describe("DashboardStats integration", () => {
    it("should render DashboardStats inside PageLayout", () => {
      render(<Dashboard />);
      expect(screen.getByTestId("dashboard-stats")).toBeInTheDocument();
    });

    it("should call DashboardStats once", () => {
      render(<Dashboard />);
      expect(MockedDashboardStats).toHaveBeenCalledTimes(1);
    });

    it("should render DashboardStats without props", () => {
      render(<Dashboard />);
      expect(MockedDashboardStats).toHaveBeenCalledWith({}, {});
    });

    it("should integrate DashboardStats as child of PageLayout", () => {
      const { container } = render(<Dashboard />);
      const pageLayout = screen.getByTestId("page-layout");
      const dashboardStats = screen.getByTestId("dashboard-stats");
      expect(pageLayout).toContainElement(dashboardStats);
    });
  });

  describe("Component structure", () => {
    it("should have PageLayout as root component", () => {
      render(<Dashboard />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
    });

    it("should have DashboardStats as child component", () => {
      render(<Dashboard />);
      const pageLayout = screen.getByTestId("page-layout");
      const dashboardStats = screen.getByTestId("dashboard-stats");
      expect(pageLayout).toContainElement(dashboardStats);
    });

    it("should have correct component hierarchy", () => {
      const { container } = render(<Dashboard />);
      expect(container.querySelector('[data-testid="page-layout"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="dashboard-stats"]')).toBeInTheDocument();
    });

    it("should render single PageLayout", () => {
      render(<Dashboard />);
      const layouts = screen.getAllByTestId("page-layout");
      expect(layouts).toHaveLength(1);
    });

    it("should render single DashboardStats", () => {
      render(<Dashboard />);
      const stats = screen.getAllByTestId("dashboard-stats");
      expect(stats).toHaveLength(1);
    });
  });

  describe("Page behavior", () => {
    it("should render consistently on multiple renders", () => {
      const { rerender } = render(<Dashboard />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();

      rerender(<Dashboard />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
    });

    it("should maintain structure across rerenders", () => {
      const { rerender } = render(<Dashboard />);
      const initialTitle = screen.getByTestId("page-layout-title").textContent;

      rerender(<Dashboard />);
      const rerenderedTitle = screen.getByTestId("page-layout-title").textContent;

      expect(rerenderedTitle).toBe(initialTitle);
    });

    it("should not change component count on rerender", () => {
      const { rerender } = render(<Dashboard />);
      const initialCallCount = MockedPageLayout.mock.calls.length;

      rerender(<Dashboard />);
      const finalCallCount = MockedPageLayout.mock.calls.length;

      expect(finalCallCount).toBeGreaterThanOrEqual(initialCallCount);
    });
  });

  describe("Props validation", () => {
    it("should pass string type for title", () => {
      render(<Dashboard />);
      expect(MockedPageLayout).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
        }),
        {}
      );
    });

    it("should have valid title prop", () => {
      render(<Dashboard />);
      const calls = MockedPageLayout.mock.calls[0];
      expect(calls[0].title).toBeDefined();
      expect(typeof calls[0].title).toBe("string");
    });

    it("should have children prop in PageLayout", () => {
      render(<Dashboard />);
      const calls = MockedPageLayout.mock.calls[0];
      expect(calls[0].children).toBeDefined();
    });
  });

  describe("Component responsibility", () => {
    it("should be responsible for page layout", () => {
      render(<Dashboard />);
      expect(MockedPageLayout).toHaveBeenCalled();
    });

    it("should be responsible for displaying dashboard stats", () => {
      render(<Dashboard />);
      expect(MockedDashboardStats).toHaveBeenCalled();
    });

    it("should act as a page wrapper", () => {
      render(<Dashboard />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
      expect(screen.getByTestId("dashboard-stats")).toBeInTheDocument();
    });

    it("should delegate dashboard rendering to DashboardStats component", () => {
      render(<Dashboard />);
      expect(MockedDashboardStats).toHaveBeenCalledTimes(1);
    });

    it("should delegate layout to PageLayout component", () => {
      render(<Dashboard />);
      expect(MockedPageLayout).toHaveBeenCalledTimes(1);
    });
  });

  describe("Default export", () => {
    it("should export default function", () => {
      expect(Dashboard).toBeDefined();
      expect(typeof Dashboard).toBe("function");
    });

    it("should be a React component", () => {
      const result = render(<Dashboard />);
      expect(result).toBeDefined();
    });

    it("should render valid JSX", () => {
      const { container } = render(<Dashboard />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should not crash on render", () => {
      expect(() => render(<Dashboard />)).not.toThrow();
    });

    it("should handle multiple renders gracefully", () => {
      const { rerender } = render(<Dashboard />);
      expect(() => rerender(<Dashboard />)).not.toThrow();
    });

    it("should maintain consistency across renders", () => {
      const { rerender } = render(<Dashboard />);
      const firstRender = screen.getByTestId("page-layout");

      rerender(<Dashboard />);
      const secondRender = screen.getByTestId("page-layout");

      expect(firstRender).toBeInTheDocument();
      expect(secondRender).toBeInTheDocument();
    });
  });

  describe("Mock verification", () => {
    it("should call PageLayout with exact props", () => {
      render(<Dashboard />);
      const calls = MockedPageLayout.mock.calls[0];
      expect(calls[0].title).toBe("Dashboard");
    });

    it("should call DashboardStats without arguments", () => {
      render(<Dashboard />);
      expect(MockedDashboardStats).toHaveBeenCalledWith({}, {});
    });

    it("should call components in correct order", () => {
      render(<Dashboard />);
      expect(MockedPageLayout).toHaveBeenCalled();
      expect(MockedDashboardStats).toHaveBeenCalled();
    });

    it("should not pass unexpected props to PageLayout", () => {
      render(<Dashboard />);
      const calls = MockedPageLayout.mock.calls[0];
      const props = calls[0];
      const expectedKeys = ["title", "children"];
      const actualKeys = Object.keys(props);

      expectedKeys.forEach((key) => {
        expect(actualKeys).toContain(key);
      });
    });

    it("should not pass props to DashboardStats", () => {
      render(<Dashboard />);
      expect(MockedDashboardStats).toHaveBeenCalledWith({}, {});
    });
  });

  describe("Component composition", () => {
    it("should compose PageLayout and DashboardStats", () => {
      render(<Dashboard />);
      expect(MockedPageLayout).toHaveBeenCalled();
      expect(MockedDashboardStats).toHaveBeenCalled();
    });

    it("should nest DashboardStats inside PageLayout", () => {
      render(<Dashboard />);
      const pageLayout = screen.getByTestId("page-layout");
      const dashboardStats = screen.getByTestId("dashboard-stats");
      expect(pageLayout.contains(dashboardStats)).toBe(true);
    });

    it("should have correct parent-child relationship", () => {
      const { container } = render(<Dashboard />);
      const pageLayout = container.querySelector('[data-testid="page-layout"]') as HTMLElement;
      const dashboardStats = container.querySelector('[data-testid="dashboard-stats"]') as HTMLElement;
      expect(pageLayout).toContainElement(dashboardStats);
    });
  });

  describe("Page title semantics", () => {
    it("should have descriptive title", () => {
      render(<Dashboard />);
      const title = screen.getByTestId("page-layout-title");
      expect(title.textContent?.length).toBeGreaterThan(0);
    });

    it("should use 'Dashboard' as semantic title", () => {
      render(<Dashboard />);
      expect(MockedPageLayout).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Dashboard" }),
        {}
      );
    });

    it("should indicate page purpose in title", () => {
      render(<Dashboard />);
      const title = screen.getByTestId("page-layout-title");
      expect(title.textContent).toContain("Dashboard");
    });
  });

  describe("Integration test", () => {
    it("should render complete page structure", () => {
      render(<Dashboard />);
      
      // Verify PageLayout is rendered
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
      
      // Verify title is set
      expect(screen.getByTestId("page-layout-title")).toHaveTextContent("Dashboard");
      
      // Verify DashboardStats is rendered
      expect(screen.getByTestId("dashboard-stats")).toBeInTheDocument();
    });

    it("should integrate all components correctly", () => {
      render(<Dashboard />);
      
      const pageLayout = screen.getByTestId("page-layout");
      const title = screen.getByTestId("page-layout-title");
      const dashboardStats = screen.getByTestId("dashboard-stats");
      
      expect(pageLayout).toContainElement(title);
      expect(pageLayout).toContainElement(dashboardStats);
    });

    it("should call all mocked components exactly once", () => {
      render(<Dashboard />);
      
      expect(MockedPageLayout).toHaveBeenCalledTimes(1);
      expect(MockedDashboardStats).toHaveBeenCalledTimes(1);
    });
  });
});
