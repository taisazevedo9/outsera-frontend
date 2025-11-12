import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MoviesPreview } from "../movies-preview";
import { useMoviesPreview } from "../../hooks/use-movies-preview";
import { Movie } from "../../types";

jest.mock("../../hooks/use-movies-preview");

describe("MoviesPreview", () => {
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

  const mockUseMoviesPreview = useMoviesPreview as jest.MockedFunction<
    typeof useMoviesPreview
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMoviesPreview.mockReturnValue({
      movies: mockMovies,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it("should render component", () => {
    render(<MoviesPreview />);
    expect(screen.getByText("List movie winners by year")).toBeInTheDocument();
  });

  it("should render search input", () => {
    render(<MoviesPreview />);
    const input = screen.getByPlaceholderText("Search by year");
    expect(input).toBeInTheDocument();
  });

  it("should render search button", () => {
    render(<MoviesPreview />);
    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  it("should have button disabled when input is empty", () => {
    render(<MoviesPreview />);
    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toBeDisabled();
  });

  it("should enable button when input has value", () => {
    render(<MoviesPreview />);
    const input = screen.getByPlaceholderText("Search by year");
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "1980" } });
    expect(button).not.toBeDisabled();
  });

  it("should disable button when loading", () => {
    mockUseMoviesPreview.mockReturnValue({
      movies: [],
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<MoviesPreview />);
    // When loading, the Card shows a spinner and child inputs/buttons are not rendered
    expect(screen.queryByPlaceholderText("Search by year")).toBeNull();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should call refetch when search button is clicked", async () => {
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

  it("should render movies data in the table", () => {
    render(<MoviesPreview />);
    // SimpleTable renders a table with movie rows; assert a known movie title is present
    expect(screen.getByText("Can't Stop the Music")).toBeInTheDocument();
    expect(screen.getByText("Cruising")).toBeInTheDocument();
  });

  it("should have input with required attribute", () => {
    render(<MoviesPreview />);
    const input = screen.getByPlaceholderText("Search by year");
    expect(input).toHaveAttribute("required");
  });

  it("should have input with maxLength attribute", () => {
    render(<MoviesPreview />);
    const input = screen.getByPlaceholderText("Search by year");
    expect(input).toHaveAttribute("maxLength", "4");
  });

  it("should update input value when typing", () => {
    render(<MoviesPreview />);
    const input = screen.getByPlaceholderText("Search by year") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "1985" } });
    expect(input.value).toBe("1985");
  });

  it("should apply custom colSize", () => {
    const { container } = render(<MoviesPreview colSize="col-lg-12" />);
    // The outer wrapper should include the provided column size class
    expect(container.querySelector(".col-lg-12")).toBeInTheDocument();
  });

  it("should display error when error exists", () => {
    mockUseMoviesPreview.mockReturnValue({
      movies: [],
      loading: false,
      error: "Failed to load movies",
      refetch: jest.fn(),
    });

    render(<MoviesPreview />);
    // Card renders an alert for errors
    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load movies");
  });

  it("should show loading state", () => {
    mockUseMoviesPreview.mockReturnValue({
      movies: [],
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<MoviesPreview />);
    // Card shows a spinner with role=status when loading
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
