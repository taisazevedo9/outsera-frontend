import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Card } from "../card";

jest.mock("../card-title", () => {
  return jest.fn(({ title }: any) => (
    <div data-testid="card-title">{title}</div>
  ));
});

jest.mock("../card-loading", () => {
  return jest.fn(() => <div data-testid="card-loading">Loading...</div>);
});

jest.mock("../../alert/error", () => {
  return jest.fn(({ error }: any) => (
    <div data-testid="card-error">{error}</div>
  ));
});

import CardTitle from "../card-title";
import CardLoading from "../card-loading";
import CardError from "../../alert/error";

const MockedCardTitle = CardTitle as jest.MockedFunction<typeof CardTitle>;
const MockedCardLoading = CardLoading as jest.MockedFunction<typeof CardLoading>;
const MockedCardError = CardError as jest.MockedFunction<typeof CardError>;

describe("Card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render children", () => {
      render(<Card>Test Content</Card>);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should render card structure", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector(".card")).toBeInTheDocument();
      expect(container.querySelector(".card-body")).toBeInTheDocument();
    });

    it("should render without errors", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Title prop", () => {
    it("should render title when provided", () => {
      render(<Card title="My Title">Content</Card>);
      expect(screen.getByTestId("card-title")).toBeInTheDocument();
      expect(screen.getByText("My Title")).toBeInTheDocument();
    });

    it("should not render title when not provided", () => {
      render(<Card>Content</Card>);
      expect(screen.queryByTestId("card-title")).not.toBeInTheDocument();
    });

    it("should call CardTitle with correct title", () => {
      render(<Card title="Test Title">Content</Card>);
      expect(MockedCardTitle).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Test Title" }),
        {}
      );
    });

    it("should render title and children together", () => {
      render(<Card title="Title">Children Content</Card>);
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Children Content")).toBeInTheDocument();
    });

    it("should handle empty string title", () => {
      render(<Card title="">Content</Card>);
      expect(screen.queryByTestId("card-title")).not.toBeInTheDocument();
    });
  });

  describe("ColSize prop", () => {
    it("should use default colSize col-md-6", () => {
      const { container } = render(<Card>Content</Card>);
      const wrapper = container.querySelector(".col-md-6");
      expect(wrapper).toBeInTheDocument();
    });

    it("should accept custom colSize", () => {
      const { container } = render(<Card colSize="col-lg-12">Content</Card>);
      const wrapper = container.querySelector(".col-lg-12");
      expect(wrapper).toBeInTheDocument();
    });

    it("should not have default colSize when custom provided", () => {
      const { container } = render(<Card colSize="col-sm-4">Content</Card>);
      expect(container.querySelector(".col-md-6")).not.toBeInTheDocument();
      expect(container.querySelector(".col-sm-4")).toBeInTheDocument();
    });

    it("should handle different Bootstrap column sizes", () => {
      const { container } = render(<Card colSize="col-xl-3">Content</Card>);
      const wrapper = container.querySelector(".col-xl-3");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Loading prop", () => {
    it("should show loading state", () => {
      render(<Card loading={true}>Content</Card>);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should not show loading by default", () => {
      render(<Card>Content</Card>);
      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
    });

    it("should hide children when loading", () => {
      render(<Card loading={true}>Content</Card>);
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });

    it("should call CardLoading when loading", () => {
      render(<Card loading={true}>Content</Card>);
      expect(MockedCardLoading).toHaveBeenCalled();
    });

    it("should show children when not loading", () => {
      render(<Card loading={false}>Content</Card>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("Error prop", () => {
    it("should show error when provided", () => {
      render(<Card error="Error message">Content</Card>);
      expect(screen.getByTestId("card-error")).toBeInTheDocument();
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("should not show error by default", () => {
      render(<Card>Content</Card>);
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should hide children when error", () => {
      render(<Card error="Error">Content</Card>);
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });

    it("should call CardError with error message", () => {
      render(<Card error="Test Error">Content</Card>);
      expect(MockedCardError).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Test Error" }),
        {}
      );
    });

    it("should handle null error", () => {
      render(<Card error={null}>Content</Card>);
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should not show error when loading", () => {
      render(<Card loading={true} error="Error">Content</Card>);
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });
  });

  describe("Children prop", () => {
    it("should render text children", () => {
      render(<Card>Simple text</Card>);
      expect(screen.getByText("Simple text")).toBeInTheDocument();
    });

    it("should render JSX children", () => {
      render(
        <Card>
          <div data-testid="custom-child">Custom Component</div>
        </Card>
      );
      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <Card>
          <div>Child 1</div>
          <div>Child 2</div>
        </Card>
      );
      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
    });

    it("should render complex nested children", () => {
      render(
        <Card>
          <div>
            <header>Header</header>
            <section>Section</section>
          </div>
        </Card>
      );
      expect(screen.getByText("Header")).toBeInTheDocument();
      expect(screen.getByText("Section")).toBeInTheDocument();
    });

    it("should only render children when not loading and no error", () => {
      render(<Card loading={false} error={null}>Content</Card>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("ClassName prop", () => {
    it("should apply custom className", () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const wrapper = container.querySelector(".custom-class");
      expect(wrapper).toBeInTheDocument();
    });

    it("should use empty string as default className", () => {
      const { container } = render(<Card>Content</Card>);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("col-md-6");
      expect(wrapper.className).toContain("mb-3");
    });

    it("should append className to existing classes", () => {
      const { container } = render(<Card className="extra">Content</Card>);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("col-md-6");
      expect(wrapper).toHaveClass("mb-3");
      expect(wrapper).toHaveClass("extra");
    });

    it("should handle multiple custom classes", () => {
      const { container } = render(<Card className="class1 class2">Content</Card>);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("class1");
      expect(wrapper).toHaveClass("class2");
    });
  });

  describe("Component structure", () => {
    it("should have outer wrapper with colSize", () => {
      const { container } = render(<Card>Content</Card>);
      const wrapper = container.querySelector(".col-md-6.mb-3");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have card div inside wrapper", () => {
      const { container } = render(<Card>Content</Card>);
      const wrapper = container.firstChild as HTMLElement;
      const card = wrapper.querySelector(".card");
      expect(card).toBeInTheDocument();
    });

    it("should have card-body inside card", () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector(".card") as HTMLElement;
      const body = card.querySelector(".card-body");
      expect(body).toBeInTheDocument();
    });

    it("should have proper nesting", () => {
      const { container } = render(<Card>Content</Card>);
      const wrapper = container.querySelector(".col-md-6") as HTMLElement;
      const card = wrapper.querySelector(".card") as HTMLElement;
      const body = card.querySelector(".card-body");
      
      expect(wrapper).toContainElement(card);
      expect(card).toContainElement(body as HTMLElement);
    });

    it("should have h-100 class on card", () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toHaveClass("h-100");
    });
  });

  describe("CSS classes", () => {
    it("should have mb-3 class on wrapper", () => {
      const { container } = render(<Card>Content</Card>);
      const wrapper = container.querySelector(".mb-3");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have card class", () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector(".card");
      expect(card).toBeInTheDocument();
    });

    it("should have h-100 class for full height", () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector(".h-100");
      expect(card).toBeInTheDocument();
    });

    it("should have card-body class", () => {
      const { container } = render(<Card>Content</Card>);
      const body = container.querySelector(".card-body");
      expect(body).toBeInTheDocument();
    });

    it("should have all Bootstrap classes", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector(".col-md-6")).toBeInTheDocument();
      expect(container.querySelector(".mb-3")).toBeInTheDocument();
      expect(container.querySelector(".card")).toBeInTheDocument();
      expect(container.querySelector(".h-100")).toBeInTheDocument();
      expect(container.querySelector(".card-body")).toBeInTheDocument();
    });
  });

  describe("Conditional rendering", () => {
    it("should render title when provided", () => {
      render(<Card title="Title">Content</Card>);
      expect(screen.getByTestId("card-title")).toBeInTheDocument();
    });

    it("should render loading when true", () => {
      render(<Card loading={true}>Content</Card>);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should render error when provided and not loading", () => {
      render(<Card error="Error" loading={false}>Content</Card>);
      expect(screen.getByTestId("card-error")).toBeInTheDocument();
    });

    it("should render children when not loading and no error", () => {
      render(<Card loading={false} error={null}>Content</Card>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should not render children when loading", () => {
      render(<Card loading={true}>Content</Card>);
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });

    it("should not render children when error", () => {
      render(<Card error="Error">Content</Card>);
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });

    it("should prioritize loading over error", () => {
      render(<Card loading={true} error="Error">Content</Card>);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });
  });

  describe("Props interface", () => {
    it("should accept CardProps interface", () => {
      const props = {
        title: "Test",
        colSize: "col-lg-4",
        loading: false,
        error: null,
        children: "Content",
        className: "custom",
      };
      render(<Card {...props} />);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should require only children prop", () => {
      render(<Card>Required Children</Card>);
      expect(screen.getByText("Required Children")).toBeInTheDocument();
    });

    it("should have optional title prop", () => {
      render(<Card>Content</Card>);
      expect(screen.queryByTestId("card-title")).not.toBeInTheDocument();
    });

    it("should have optional loading prop with default false", () => {
      render(<Card>Content</Card>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should have optional error prop with default null", () => {
      render(<Card>Content</Card>);
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });
  });

  describe("Default props", () => {
    it("should use col-md-6 as default colSize", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector(".col-md-6")).toBeInTheDocument();
    });

    it("should use false as default loading", () => {
      render(<Card>Content</Card>);
      expect(screen.getByText("Content")).toBeInTheDocument();
      expect(screen.queryByTestId("card-loading")).not.toBeInTheDocument();
    });

    it("should use null as default error", () => {
      render(<Card>Content</Card>);
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should use empty string as default className", () => {
      const { container } = render(<Card>Content</Card>);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).not.toContain("undefined");
    });
  });

  describe("Rerendering", () => {
    it("should update children on rerender", () => {
      const { rerender } = render(<Card>Initial</Card>);
      expect(screen.getByText("Initial")).toBeInTheDocument();

      rerender(<Card>Updated</Card>);
      expect(screen.getByText("Updated")).toBeInTheDocument();
      expect(screen.queryByText("Initial")).not.toBeInTheDocument();
    });

    it("should update loading state on rerender", () => {
      const { rerender } = render(<Card loading={false}>Content</Card>);
      expect(screen.getByText("Content")).toBeInTheDocument();

      rerender(<Card loading={true}>Content</Card>);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });

    it("should update error state on rerender", () => {
      const { rerender } = render(<Card error={null}>Content</Card>);
      expect(screen.getByText("Content")).toBeInTheDocument();

      rerender(<Card error="Error occurred">Content</Card>);
      expect(screen.getByTestId("card-error")).toBeInTheDocument();
    });

    it("should maintain structure on rerender", () => {
      const { container, rerender } = render(<Card>Content</Card>);
      const firstCard = container.querySelector(".card");

      rerender(<Card>New Content</Card>);
      const secondCard = container.querySelector(".card");

      expect(firstCard).toBeInTheDocument();
      expect(secondCard).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle empty string error", () => {
      render(<Card error="">Content</Card>);
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should handle loading and error together", () => {
      render(<Card loading={true} error="Error">Content</Card>);
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
      expect(screen.queryByTestId("card-error")).not.toBeInTheDocument();
    });

    it("should handle all props together", () => {
      render(
        <Card
          title="Title"
          colSize="col-lg-12"
          loading={false}
          error={null}
          className="custom"
        >
          Content
        </Card>
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should handle numeric children", () => {
      render(<Card>{123}</Card>);
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    it("should handle null children placeholders", () => {
      render(
        <Card>
          {null}
          <div>Visible</div>
        </Card>
      );
      expect(screen.getByText("Visible")).toBeInTheDocument();
    });
  });

  describe("Component behavior", () => {
    it("should not have side effects", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      render(<Card>Content</Card>);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should render immediately", () => {
      render(<Card>Immediate</Card>);
      expect(screen.getByText("Immediate")).toBeInTheDocument();
    });

    it("should be composable", () => {
      render(
        <Card title="Parent">
          <Card title="Nested">Nested Content</Card>
        </Card>
      );
      expect(screen.getByText("Parent")).toBeInTheDocument();
    });
  });

  describe("Export", () => {
    it("should export Card as named export", () => {
      expect(Card).toBeDefined();
      expect(typeof Card).toBe("function");
    });

    it("should be a React component", () => {
      const result = render(<Card>Test</Card>);
      expect(result).toBeDefined();
    });

    it("should return valid JSX", () => {
      const { container } = render(<Card>Valid</Card>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Integration scenarios", () => {
    it("should work in dashboard layout", () => {
      render(
        <Card title="Dashboard Card" colSize="col-lg-6">
          Dashboard Content
        </Card>
      );
      expect(screen.getByText("Dashboard Card")).toBeInTheDocument();
      expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    });

    it("should work with loading state", () => {
      render(
        <Card title="Loading Card" loading={true}>
          Hidden Content
        </Card>
      );
      expect(screen.getByText("Loading Card")).toBeInTheDocument();
      expect(screen.getByTestId("card-loading")).toBeInTheDocument();
    });

    it("should work with error state", () => {
      render(
        <Card title="Error Card" error="Failed to load">
          Hidden Content
        </Card>
      );
      expect(screen.getByText("Error Card")).toBeInTheDocument();
      expect(screen.getByText("Failed to load")).toBeInTheDocument();
    });

    it("should work in grid layout", () => {
      render(
        <div className="row">
          <Card colSize="col-md-4">Card 1</Card>
          <Card colSize="col-md-4">Card 2</Card>
          <Card colSize="col-md-4">Card 3</Card>
        </div>
      );
      expect(screen.getByText("Card 1")).toBeInTheDocument();
      expect(screen.getByText("Card 2")).toBeInTheDocument();
      expect(screen.getByText("Card 3")).toBeInTheDocument();
    });
  });

  describe("Bootstrap integration", () => {
    it("should use Bootstrap card component", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector(".card")).toBeInTheDocument();
    });

    it("should use Bootstrap grid system", () => {
      const { container } = render(<Card colSize="col-sm-12">Content</Card>);
      expect(container.querySelector(".col-sm-12")).toBeInTheDocument();
    });

    it("should use Bootstrap spacing utilities", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector(".mb-3")).toBeInTheDocument();
    });

    it("should use Bootstrap height utility", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector(".h-100")).toBeInTheDocument();
    });
  });

  describe("Mock verification", () => {
    it("should call CardTitle when title provided", () => {
      render(<Card title="Test">Content</Card>);
      expect(MockedCardTitle).toHaveBeenCalledTimes(1);
    });

    it("should call CardLoading when loading", () => {
      render(<Card loading={true}>Content</Card>);
      expect(MockedCardLoading).toHaveBeenCalledTimes(1);
    });

    it("should call CardError when error provided", () => {
      render(<Card error="Error">Content</Card>);
      expect(MockedCardError).toHaveBeenCalledTimes(1);
    });

    it("should not call any child components when only children", () => {
      render(<Card>Content</Card>);
      expect(MockedCardTitle).not.toHaveBeenCalled();
      expect(MockedCardLoading).not.toHaveBeenCalled();
      expect(MockedCardError).not.toHaveBeenCalled();
    });
  });

  describe("Multiple instances", () => {
    it("should render multiple Card components", () => {
      render(
        <>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </>
      );
      expect(screen.getByText("Card 1")).toBeInTheDocument();
      expect(screen.getByText("Card 2")).toBeInTheDocument();
    });

    it("should keep instances independent", () => {
      const { container } = render(
        <>
          <Card title="First">Content 1</Card>
          <Card error="Error">Content 2</Card>
        </>
      );
      const cards = container.querySelectorAll(".card");
      expect(cards).toHaveLength(2);
    });
  });
});
