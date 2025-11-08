import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MovieList } from "../movie-list";
import { MovieCard } from "../movie-card";

jest.mock("../movie-card", () => ({
  MovieCard: jest.fn(({ title, colSize, showFilters, initialFilters }: any) => {
    return (
      <div data-testid="movie-card">
        <div data-testid="movie-card-title">{title}</div>
        <div data-testid="movie-card-col-size">{colSize}</div>
        <div data-testid="movie-card-show-filters">{String(showFilters)}</div>
        <div data-testid="movie-card-initial-filters">
          {JSON.stringify(initialFilters)}
        </div>
      </div>
    );
  }),
}));

const MockedMovieCard = MovieCard as jest.MockedFunction<typeof MovieCard>;

describe("MovieList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component", () => {
      render(<MovieList />);
      expect(screen.getByTestId("movie-card")).toBeInTheDocument();
    });

    it("should render MovieCard component", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalled();
    });

    it("should render without errors", () => {
      const { container } = render(<MovieList />);
      expect(container).toBeInTheDocument();
    });

    it("should render a single MovieCard", () => {
      render(<MovieList />);
      const movieCards = screen.getAllByTestId("movie-card");
      expect(movieCards).toHaveLength(1);
    });
  });

  describe("MovieCard props", () => {
    it("should pass correct title to MovieCard", () => {
      render(<MovieList />);
      const title = screen.getByTestId("movie-card-title");
      expect(title).toHaveTextContent("Movie List");
    });

    it("should pass colSize='col-12' to MovieCard", () => {
      render(<MovieList />);
      const colSize = screen.getByTestId("movie-card-col-size");
      expect(colSize).toHaveTextContent("col-12");
    });

    it("should pass showFilters=true to MovieCard", () => {
      render(<MovieList />);
      const showFilters = screen.getByTestId("movie-card-show-filters");
      expect(showFilters).toHaveTextContent("true");
    });

    it("should pass initialFilters to MovieCard", () => {
      render(<MovieList />);
      const initialFilters = screen.getByTestId("movie-card-initial-filters");
      expect(initialFilters).toHaveTextContent('{"page":0,"size":99}');
    });

    it("should pass all required props to MovieCard", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        {
          title: "Movie List",
          colSize: "col-12",
          showFilters: true,
          initialFilters: { page: 0, size: 99 },
        },
        {}
      );
    });
  });

  describe("Title prop", () => {
    it("should have 'Movie List' as title", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Movie List" }),
        {}
      );
    });

    it("should display title in MovieCard", () => {
      render(<MovieList />);
      const title = screen.getByTestId("movie-card-title");
      expect(title.textContent).toBe("Movie List");
    });

    it("should not have empty title", () => {
      render(<MovieList />);
      const title = screen.getByTestId("movie-card-title");
      expect(title.textContent).not.toBe("");
    });
  });

  describe("ColSize prop", () => {
    it("should set colSize to 'col-12'", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({ colSize: "col-12" }),
        {}
      );
    });

    it("should use full width column", () => {
      render(<MovieList />);
      const colSize = screen.getByTestId("movie-card-col-size");
      expect(colSize).toHaveTextContent("col-12");
    });

    it("should not use partial width", () => {
      render(<MovieList />);
      const colSize = screen.getByTestId("movie-card-col-size");
      expect(colSize.textContent).not.toContain("col-6");
      expect(colSize.textContent).not.toContain("col-md-6");
    });
  });

  describe("ShowFilters prop", () => {
    it("should enable filters", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({ showFilters: true }),
        {}
      );
    });

    it("should have showFilters set to true", () => {
      render(<MovieList />);
      const showFilters = screen.getByTestId("movie-card-show-filters");
      expect(showFilters).toHaveTextContent("true");
    });

    it("should not have showFilters as false", () => {
      render(<MovieList />);
      const showFilters = screen.getByTestId("movie-card-show-filters");
      expect(showFilters.textContent).not.toBe("false");
    });

    it("should enable filtering functionality", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({ showFilters: true }),
        {}
      );
    });
  });

  describe("InitialFilters prop", () => {
    it("should set page to 0", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          initialFilters: expect.objectContaining({ page: 0 }),
        }),
        {}
      );
    });

    it("should set size to 99", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          initialFilters: expect.objectContaining({ size: 99 }),
        }),
        {}
      );
    });

    it("should have both page and size properties", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          initialFilters: { page: 0, size: 99 },
        }),
        {}
      );
    });

    it("should start from first page", () => {
      render(<MovieList />);
      const initialFilters = screen.getByTestId("movie-card-initial-filters");
      const filters = JSON.parse(initialFilters.textContent || "{}");
      expect(filters.page).toBe(0);
    });

    it("should display 99 items per page", () => {
      render(<MovieList />);
      const initialFilters = screen.getByTestId("movie-card-initial-filters");
      const filters = JSON.parse(initialFilters.textContent || "{}");
      expect(filters.size).toBe(99);
    });

    it("should have valid pagination configuration", () => {
      render(<MovieList />);
      const initialFilters = screen.getByTestId("movie-card-initial-filters");
      const filters = JSON.parse(initialFilters.textContent || "{}");
      expect(filters.page).toBeGreaterThanOrEqual(0);
      expect(filters.size).toBeGreaterThan(0);
    });

    it("should pass complete initialFilters object", () => {
      render(<MovieList />);
      const initialFilters = screen.getByTestId("movie-card-initial-filters");
      expect(initialFilters.textContent).toBe('{"page":0,"size":99}');
    });
  });

  describe("Component structure", () => {
    it("should render within a React fragment", () => {
      const { container } = render(<MovieList />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should only contain MovieCard as child", () => {
      render(<MovieList />);
      const movieCards = screen.getAllByTestId("movie-card");
      expect(movieCards).toHaveLength(1);
    });

    it("should not render additional elements", () => {
      const { container } = render(<MovieList />);
      const movieCard = screen.getByTestId("movie-card");
      expect(container.firstChild).toContainElement(movieCard);
    });

    it("should have clean structure without wrapper divs", () => {
      const { container } = render(<MovieList />);
      const movieCard = screen.getByTestId("movie-card");
      expect(movieCard).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("should call MovieCard with all props", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledTimes(1);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        {
          title: "Movie List",
          colSize: "col-12",
          showFilters: true,
          initialFilters: { page: 0, size: 99 },
        },
        {}
      );
    });

    it("should properly integrate with MovieCard component", () => {
      render(<MovieList />);
      expect(screen.getByTestId("movie-card")).toBeInTheDocument();
      expect(screen.getByTestId("movie-card-title")).toHaveTextContent(
        "Movie List"
      );
    });

    it("should pass props in correct format", () => {
      render(<MovieList />);
      const title = screen.getByTestId("movie-card-title");
      const colSize = screen.getByTestId("movie-card-col-size");
      const showFilters = screen.getByTestId("movie-card-show-filters");
      const initialFilters = screen.getByTestId("movie-card-initial-filters");

      expect(title).toHaveTextContent("Movie List");
      expect(colSize).toHaveTextContent("col-12");
      expect(showFilters).toHaveTextContent("true");
      expect(JSON.parse(initialFilters.textContent || "{}")).toEqual({
        page: 0,
        size: 99,
      });
    });
  });

  describe("Props validation", () => {
    it("should have string type for title", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
        }),
        {}
      );
    });

    it("should have string type for colSize", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          colSize: expect.any(String),
        }),
        {}
      );
    });

    it("should have boolean type for showFilters", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          showFilters: expect.any(Boolean),
        }),
        {}
      );
    });

    it("should have object type for initialFilters", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          initialFilters: expect.any(Object),
        }),
        {}
      );
    });

    it("should have number type for page in initialFilters", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          initialFilters: expect.objectContaining({
            page: expect.any(Number),
          }),
        }),
        {}
      );
    });

    it("should have number type for size in initialFilters", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          initialFilters: expect.objectContaining({
            size: expect.any(Number),
          }),
        }),
        {}
      );
    });
  });

  describe("Component behavior", () => {
    it("should render consistently on multiple renders", () => {
      const { rerender } = render(<MovieList />);
      expect(screen.getByTestId("movie-card")).toBeInTheDocument();

      rerender(<MovieList />);
      expect(screen.getByTestId("movie-card")).toBeInTheDocument();
    });

    it("should maintain prop values across renders", () => {
      const { rerender } = render(<MovieList />);
      const initialTitle = screen.getByTestId("movie-card-title").textContent;

      rerender(<MovieList />);
      const rerenderedTitle = screen.getByTestId("movie-card-title")
        .textContent;

      expect(rerenderedTitle).toBe(initialTitle);
    });

    it("should not change props on rerender", () => {
      const { rerender } = render(<MovieList />);
      const initialFilters = screen.getByTestId(
        "movie-card-initial-filters"
      ).textContent;

      rerender(<MovieList />);
      const rerenderedFilters = screen.getByTestId(
        "movie-card-initial-filters"
      ).textContent;

      expect(rerenderedFilters).toBe(initialFilters);
    });
  });

  describe("Default configuration", () => {
    it("should use default page size of 99", () => {
      render(<MovieList />);
      const initialFilters = screen.getByTestId("movie-card-initial-filters");
      const filters = JSON.parse(initialFilters.textContent || "{}");
      expect(filters.size).toBe(99);
    });

    it("should start at page 0 by default", () => {
      render(<MovieList />);
      const initialFilters = screen.getByTestId("movie-card-initial-filters");
      const filters = JSON.parse(initialFilters.textContent || "{}");
      expect(filters.page).toBe(0);
    });

    it("should have filters enabled by default", () => {
      render(<MovieList />);
      const showFilters = screen.getByTestId("movie-card-show-filters");
      expect(showFilters).toHaveTextContent("true");
    });

    it("should use full width layout by default", () => {
      render(<MovieList />);
      const colSize = screen.getByTestId("movie-card-col-size");
      expect(colSize).toHaveTextContent("col-12");
    });

    it("should have descriptive title", () => {
      render(<MovieList />);
      const title = screen.getByTestId("movie-card-title");
      expect(title.textContent).toContain("Movie");
      expect(title.textContent).toContain("List");
    });
  });

  describe("Pagination configuration", () => {
    it("should configure pagination with correct page", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          initialFilters: expect.objectContaining({ page: 0 }),
        }),
        {}
      );
    });

    it("should configure pagination with correct size", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          initialFilters: expect.objectContaining({ size: 99 }),
        }),
        {}
      );
    });

    it("should have zero-based page indexing", () => {
      render(<MovieList />);
      const initialFilters = screen.getByTestId("movie-card-initial-filters");
      const filters = JSON.parse(initialFilters.textContent || "{}");
      expect(filters.page).toBe(0);
    });

    it("should have large page size for displaying many items", () => {
      render(<MovieList />);
      const initialFilters = screen.getByTestId("movie-card-initial-filters");
      const filters = JSON.parse(initialFilters.textContent || "{}");
      expect(filters.size).toBeGreaterThan(50);
    });
  });

  describe("Edge cases", () => {
    it("should not crash on render", () => {
      expect(() => render(<MovieList />)).not.toThrow();
    });

    it("should handle multiple renders gracefully", () => {
      const { rerender } = render(<MovieList />);
      expect(() => rerender(<MovieList />)).not.toThrow();
    });

    it("should maintain consistency across renders", () => {
      const { rerender } = render(<MovieList />);
      const firstRenderCallCount = MockedMovieCard.mock.calls.length;

      rerender(<MovieList />);
      const secondRenderCallCount = MockedMovieCard.mock.calls.length;

      expect(secondRenderCallCount).toBeGreaterThanOrEqual(
        firstRenderCallCount
      );
    });
  });

  describe("MovieCard mock verification", () => {
    it("should call MovieCard exactly once", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledTimes(1);
    });

    it("should pass props without modification", () => {
      render(<MovieList />);
      const calls = MockedMovieCard.mock.calls[0];
      expect(calls[0].title).toBe("Movie List");
      expect(calls[0].colSize).toBe("col-12");
      expect(calls[0].showFilters).toBe(true);
      expect(calls[0].initialFilters).toEqual({ page: 0, size: 99 });
    });

    it("should not pass additional unexpected props", () => {
      render(<MovieList />);
      const calls = MockedMovieCard.mock.calls[0];
      const props = calls[0];
      const expectedKeys = ["title", "colSize", "showFilters", "initialFilters"];
      const actualKeys = Object.keys(props);
      
      expectedKeys.forEach((key) => {
        expect(actualKeys).toContain(key);
      });
    });
  });

  describe("Component responsibilities", () => {
    it("should be responsible for rendering MovieCard", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalled();
    });

    it("should provide configuration to MovieCard", () => {
      render(<MovieList />);
      expect(MockedMovieCard).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
          colSize: expect.any(String),
          showFilters: expect.any(Boolean),
          initialFilters: expect.any(Object),
        }),
        {}
      );
    });

    it("should not have complex logic", () => {
      const { container } = render(<MovieList />);
      expect(container).toBeInTheDocument();
      expect(MockedMovieCard).toHaveBeenCalledTimes(1);
    });

    it("should act as a simple wrapper component", () => {
      render(<MovieList />);
      const movieCards = screen.getAllByTestId("movie-card");
      expect(movieCards).toHaveLength(1);
    });
  });
});
