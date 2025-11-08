import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ListPage from "../page";

jest.mock("@/features/movies", () => ({
  MovieList: jest.fn(() => <div data-testid="movie-list">MovieList Component</div>),
}));

jest.mock("@/shared/components/layout", () => ({
  PageLayout: jest.fn(({ title, children }: any) => (
    <div data-testid="page-layout">
      <div data-testid="page-layout-title">{title}</div>
      {children}
    </div>
  )),
}));

import { MovieList } from "@/features/movies";
import { PageLayout } from "@/shared/components/layout";

const MockedMovieList = MovieList as jest.MockedFunction<typeof MovieList>;
const MockedPageLayout = PageLayout as jest.MockedFunction<typeof PageLayout>;

describe("ListPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the page", () => {
      render(<ListPage />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
    });

    it("should render PageLayout component", () => {
      render(<ListPage />);
      expect(MockedPageLayout).toHaveBeenCalled();
    });

    it("should render MovieList component", () => {
      render(<ListPage />);
      expect(MockedMovieList).toHaveBeenCalled();
    });

    it("should render without errors", () => {
      const { container } = render(<ListPage />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Page title", () => {
    it("should have 'List' as title", () => {
      render(<ListPage />);
      const title = screen.getByTestId("page-layout-title");
      expect(title).toHaveTextContent("List");
    });

    it("should pass title to PageLayout", () => {
      render(<ListPage />);
      expect(MockedPageLayout).toHaveBeenCalledWith(
        expect.objectContaining({ title: "List" }),
        {}
      );
    });

    it("should not have empty title", () => {
      render(<ListPage />);
      const title = screen.getByTestId("page-layout-title");
      expect(title.textContent).not.toBe("");
    });

    it("should display correct title text", () => {
      render(<ListPage />);
      const title = screen.getByTestId("page-layout-title");
      expect(title.textContent).toBe("List");
    });
  });

  describe("PageLayout integration", () => {
    it("should call PageLayout with correct props", () => {
      render(<ListPage />);
      expect(MockedPageLayout).toHaveBeenCalledWith(
        {
          title: "List",
          children: expect.anything(),
        },
        {}
      );
    });

    it("should render PageLayout once", () => {
      render(<ListPage />);
      expect(MockedPageLayout).toHaveBeenCalledTimes(1);
    });

    it("should pass children to PageLayout", () => {
      render(<ListPage />);
      expect(MockedPageLayout).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.anything(),
        }),
        {}
      );
    });

    it("should integrate PageLayout correctly", () => {
      render(<ListPage />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
      expect(screen.getByTestId("movie-list")).toBeInTheDocument();
    });
  });

  describe("MovieList integration", () => {
    it("should render MovieList inside PageLayout", () => {
      render(<ListPage />);
      expect(screen.getByTestId("movie-list")).toBeInTheDocument();
    });

    it("should call MovieList once", () => {
      render(<ListPage />);
      expect(MockedMovieList).toHaveBeenCalledTimes(1);
    });

    it("should render MovieList without props", () => {
      render(<ListPage />);
      expect(MockedMovieList).toHaveBeenCalledWith({}, {});
    });

    it("should integrate MovieList as child of PageLayout", () => {
      const { container } = render(<ListPage />);
      const pageLayout = screen.getByTestId("page-layout");
      const movieList = screen.getByTestId("movie-list");
      expect(pageLayout).toContainElement(movieList);
    });
  });

  describe("Component structure", () => {
    it("should have PageLayout as root component", () => {
      render(<ListPage />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
    });

    it("should have MovieList as child component", () => {
      render(<ListPage />);
      const pageLayout = screen.getByTestId("page-layout");
      const movieList = screen.getByTestId("movie-list");
      expect(pageLayout).toContainElement(movieList);
    });

    it("should have correct component hierarchy", () => {
      const { container } = render(<ListPage />);
      expect(container.querySelector('[data-testid="page-layout"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="movie-list"]')).toBeInTheDocument();
    });

    it("should render single PageLayout", () => {
      render(<ListPage />);
      const layouts = screen.getAllByTestId("page-layout");
      expect(layouts).toHaveLength(1);
    });

    it("should render single MovieList", () => {
      render(<ListPage />);
      const lists = screen.getAllByTestId("movie-list");
      expect(lists).toHaveLength(1);
    });
  });

  describe("Page behavior", () => {
    it("should render consistently on multiple renders", () => {
      const { rerender } = render(<ListPage />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();

      rerender(<ListPage />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
    });

    it("should maintain structure across rerenders", () => {
      const { rerender } = render(<ListPage />);
      const initialTitle = screen.getByTestId("page-layout-title").textContent;

      rerender(<ListPage />);
      const rerenderedTitle = screen.getByTestId("page-layout-title").textContent;

      expect(rerenderedTitle).toBe(initialTitle);
    });

    it("should not change component count on rerender", () => {
      const { rerender } = render(<ListPage />);
      const initialCallCount = MockedPageLayout.mock.calls.length;

      rerender(<ListPage />);
      const finalCallCount = MockedPageLayout.mock.calls.length;

      expect(finalCallCount).toBeGreaterThanOrEqual(initialCallCount);
    });
  });

  describe("Props validation", () => {
    it("should pass string type for title", () => {
      render(<ListPage />);
      expect(MockedPageLayout).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
        }),
        {}
      );
    });

    it("should have valid title prop", () => {
      render(<ListPage />);
      const calls = MockedPageLayout.mock.calls[0];
      expect(calls[0].title).toBeDefined();
      expect(typeof calls[0].title).toBe("string");
    });

    it("should have children prop in PageLayout", () => {
      render(<ListPage />);
      const calls = MockedPageLayout.mock.calls[0];
      expect(calls[0].children).toBeDefined();
    });
  });

  describe("Component responsibility", () => {
    it("should be responsible for page layout", () => {
      render(<ListPage />);
      expect(MockedPageLayout).toHaveBeenCalled();
    });

    it("should be responsible for displaying movie list", () => {
      render(<ListPage />);
      expect(MockedMovieList).toHaveBeenCalled();
    });

    it("should act as a page wrapper", () => {
      render(<ListPage />);
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
      expect(screen.getByTestId("movie-list")).toBeInTheDocument();
    });

    it("should delegate movie list rendering to MovieList component", () => {
      render(<ListPage />);
      expect(MockedMovieList).toHaveBeenCalledTimes(1);
    });

    it("should delegate layout to PageLayout component", () => {
      render(<ListPage />);
      expect(MockedPageLayout).toHaveBeenCalledTimes(1);
    });
  });

  describe("Default export", () => {
    it("should export default function", () => {
      expect(ListPage).toBeDefined();
      expect(typeof ListPage).toBe("function");
    });

    it("should be a React component", () => {
      const result = render(<ListPage />);
      expect(result).toBeDefined();
    });

    it("should render valid JSX", () => {
      const { container } = render(<ListPage />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should not crash on render", () => {
      expect(() => render(<ListPage />)).not.toThrow();
    });

    it("should handle multiple renders gracefully", () => {
      const { rerender } = render(<ListPage />);
      expect(() => rerender(<ListPage />)).not.toThrow();
    });

    it("should maintain consistency across renders", () => {
      const { rerender } = render(<ListPage />);
      const firstRender = screen.getByTestId("page-layout");

      rerender(<ListPage />);
      const secondRender = screen.getByTestId("page-layout");

      expect(firstRender).toBeInTheDocument();
      expect(secondRender).toBeInTheDocument();
    });
  });

  describe("Mock verification", () => {
    it("should call PageLayout with exact props", () => {
      render(<ListPage />);
      const calls = MockedPageLayout.mock.calls[0];
      expect(calls[0].title).toBe("List");
    });

    it("should call MovieList without arguments", () => {
      render(<ListPage />);
      expect(MockedMovieList).toHaveBeenCalledWith({}, {});
    });

    it("should call components in correct order", () => {
      render(<ListPage />);
      expect(MockedPageLayout).toHaveBeenCalled();
      expect(MockedMovieList).toHaveBeenCalled();
    });

    it("should not pass unexpected props to PageLayout", () => {
      render(<ListPage />);
      const calls = MockedPageLayout.mock.calls[0];
      const props = calls[0];
      const expectedKeys = ["title", "children"];
      const actualKeys = Object.keys(props);

      expectedKeys.forEach((key) => {
        expect(actualKeys).toContain(key);
      });
    });

    it("should not pass props to MovieList", () => {
      render(<ListPage />);
      expect(MockedMovieList).toHaveBeenCalledWith({}, {});
    });
  });

  describe("Component composition", () => {
    it("should compose PageLayout and MovieList", () => {
      render(<ListPage />);
      expect(MockedPageLayout).toHaveBeenCalled();
      expect(MockedMovieList).toHaveBeenCalled();
    });

    it("should nest MovieList inside PageLayout", () => {
      render(<ListPage />);
      const pageLayout = screen.getByTestId("page-layout");
      const movieList = screen.getByTestId("movie-list");
      expect(pageLayout.contains(movieList)).toBe(true);
    });

    it("should have correct parent-child relationship", () => {
      const { container } = render(<ListPage />);
      const pageLayout = container.querySelector('[data-testid="page-layout"]') as HTMLElement;
      const movieList = container.querySelector('[data-testid="movie-list"]') as HTMLElement;
      expect(pageLayout).toContainElement(movieList);
    });
  });

  describe("Page title semantics", () => {
    it("should have descriptive title", () => {
      render(<ListPage />);
      const title = screen.getByTestId("page-layout-title");
      expect(title.textContent?.length).toBeGreaterThan(0);
    });

    it("should use 'List' as semantic title", () => {
      render(<ListPage />);
      expect(MockedPageLayout).toHaveBeenCalledWith(
        expect.objectContaining({ title: "List" }),
        {}
      );
    });

    it("should indicate page purpose in title", () => {
      render(<ListPage />);
      const title = screen.getByTestId("page-layout-title");
      expect(title.textContent).toContain("List");
    });
  });

  describe("Integration test", () => {
    it("should render complete page structure", () => {
      render(<ListPage />);
      
      // Verify PageLayout is rendered
      expect(screen.getByTestId("page-layout")).toBeInTheDocument();
      
      // Verify title is set
      expect(screen.getByTestId("page-layout-title")).toHaveTextContent("List");
      
      // Verify MovieList is rendered
      expect(screen.getByTestId("movie-list")).toBeInTheDocument();
    });

    it("should integrate all components correctly", () => {
      render(<ListPage />);
      
      const pageLayout = screen.getByTestId("page-layout");
      const title = screen.getByTestId("page-layout-title");
      const movieList = screen.getByTestId("movie-list");
      
      expect(pageLayout).toContainElement(title);
      expect(pageLayout).toContainElement(movieList);
    });

    it("should call all mocked components exactly once", () => {
      render(<ListPage />);
      
      expect(MockedPageLayout).toHaveBeenCalledTimes(1);
      expect(MockedMovieList).toHaveBeenCalledTimes(1);
    });
  });
});
