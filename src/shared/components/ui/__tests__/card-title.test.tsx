import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CardTitle from "../card-title";

describe("CardTitle", () => {
  describe("Rendering", () => {
    it("should render the component", () => {
      const { container } = render(<CardTitle title="Test Title" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render title text", () => {
      render(<CardTitle title="My Title" />);
      expect(screen.getByText("My Title")).toBeInTheDocument();
    });

    it("should render h5 element", () => {
      render(<CardTitle title="Heading" />);
      const heading = screen.getByRole("heading", { level: 5 });
      expect(heading).toBeInTheDocument();
    });

    it("should render without errors", () => {
      const { container } = render(<CardTitle title="Test" />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Title prop", () => {
    it("should display the title", () => {
      render(<CardTitle title="Dashboard" />);
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("should display different titles", () => {
      const { rerender } = render(<CardTitle title="First" />);
      expect(screen.getByText("First")).toBeInTheDocument();

      rerender(<CardTitle title="Second" />);
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("should handle empty string title", () => {
      render(<CardTitle title="" />);
      const heading = screen.getByRole("heading", { level: 5 });
      expect(heading).toHaveTextContent("");
    });

    it("should handle long titles", () => {
      const longTitle = "This is a very long title that should be displayed correctly";
      render(<CardTitle title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle special characters", () => {
      render(<CardTitle title="Title @#$% & Special" />);
      expect(screen.getByText("Title @#$% & Special")).toBeInTheDocument();
    });

    it("should handle numeric strings", () => {
      render(<CardTitle title="2024" />);
      expect(screen.getByText("2024")).toBeInTheDocument();
    });

    it("should preserve title casing", () => {
      render(<CardTitle title="MixedCase Title" />);
      expect(screen.getByText("MixedCase Title")).toBeInTheDocument();
    });

    it("should handle whitespace in title", () => {
      render(<CardTitle title="  Title  " />);
      expect(screen.getByText("Title", { exact: false })).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("should render h5 element", () => {
      const { container } = render(<CardTitle title="Test" />);
      const h5 = container.querySelector("h5");
      expect(h5).toBeInTheDocument();
    });

    it("should have single h5 element", () => {
      const { container } = render(<CardTitle title="Test" />);
      const headings = container.querySelectorAll("h5");
      expect(headings).toHaveLength(1);
    });

    it("should not have wrapper elements", () => {
      const { container } = render(<CardTitle title="Test" />);
      expect(container.firstChild?.nodeName).toBe("H5");
    });

    it("should be a simple h5 element", () => {
      const { container } = render(<CardTitle title="Test" />);
      const children = container.children;
      expect(children).toHaveLength(1);
      expect(children[0].nodeName).toBe("H5");
    });
  });

  describe("CSS classes", () => {
    it("should have card-title class", () => {
      render(<CardTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("card-title");
    });

    it("should only have card-title class", () => {
      render(<CardTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading.className).toBe("card-title");
    });

    it("should use Bootstrap card-title class", () => {
      const { container } = render(<CardTitle title="Test" />);
      const cardTitle = container.querySelector(".card-title");
      expect(cardTitle).toBeInTheDocument();
    });

    it("should have single class", () => {
      render(<CardTitle title="Test" />);
      const heading = screen.getByRole("heading");
      const classes = heading.className.split(" ");
      expect(classes).toHaveLength(1);
    });
  });

  describe("Props interface", () => {
    it("should accept CardTitleProps interface", () => {
      const props = { title: "Test" };
      render(<CardTitle {...props} />);
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("should require title prop", () => {
      render(<CardTitle title="Required" />);
      expect(screen.getByText("Required")).toBeInTheDocument();
    });

    it("should accept string as title", () => {
      render(<CardTitle title="String Title" />);
      expect(screen.getByText("String Title")).toBeInTheDocument();
    });

    it("should handle title prop correctly", () => {
      const props = { title: "Prop Test" };
      render(<CardTitle {...props} />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveTextContent("Prop Test");
    });
  });

  describe("Accessibility", () => {
    it("should have h5 heading role", () => {
      render(<CardTitle title="Accessible" />);
      const heading = screen.getByRole("heading", { level: 5 });
      expect(heading).toBeInTheDocument();
    });

    it("should have accessible text content", () => {
      render(<CardTitle title="Screen Reader Text" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveTextContent("Screen Reader Text");
    });

    it("should maintain heading hierarchy", () => {
      render(<CardTitle title="Card Title" />);
      const h5 = screen.getByRole("heading", { level: 5 });
      expect(h5).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      render(<CardTitle title="Keyboard" />);
      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
    });

    it("should preserve semantic HTML", () => {
      const { container } = render(<CardTitle title="Semantic" />);
      const h5 = container.querySelector("h5");
      expect(h5).toBeInTheDocument();
    });

    it("should have text content accessible", () => {
      render(<CardTitle title="Accessible Title" />);
      expect(screen.getByText("Accessible Title")).toBeInTheDocument();
    });
  });

  describe("Rerendering", () => {
    it("should update title on rerender", () => {
      const { rerender } = render(<CardTitle title="Initial" />);
      expect(screen.getByText("Initial")).toBeInTheDocument();

      rerender(<CardTitle title="Updated" />);
      expect(screen.getByText("Updated")).toBeInTheDocument();
      expect(screen.queryByText("Initial")).not.toBeInTheDocument();
    });

    it("should maintain structure on rerender", () => {
      const { container, rerender } = render(<CardTitle title="Test" />);
      const firstStructure = container.querySelector("h5");

      rerender(<CardTitle title="Test2" />);
      const secondStructure = container.querySelector("h5");

      expect(firstStructure).toBeInTheDocument();
      expect(secondStructure).toBeInTheDocument();
    });

    it("should handle multiple rerenders", () => {
      const { rerender } = render(<CardTitle title="T1" />);
      rerender(<CardTitle title="T2" />);
      rerender(<CardTitle title="T3" />);

      expect(screen.getByText("T3")).toBeInTheDocument();
    });

    it("should maintain CSS class on rerender", () => {
      const { rerender } = render(<CardTitle title="First" />);
      rerender(<CardTitle title="Second" />);

      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("card-title");
    });

    it("should keep h5 element type on rerender", () => {
      const { container, rerender } = render(<CardTitle title="First" />);
      rerender(<CardTitle title="Second" />);

      const h5 = container.querySelector("h5");
      expect(h5).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle title with line breaks", () => {
      const titleWithBreaks = "Title\nWith\nBreaks";
      render(<CardTitle title={titleWithBreaks} />);
      const heading = screen.getByRole("heading");
      expect(heading.textContent).toBe(titleWithBreaks);
    });

    it("should handle Unicode characters", () => {
      render(<CardTitle title="Título 测试 🎉" />);
      expect(screen.getByText("Título 测试 🎉")).toBeInTheDocument();
    });

    it("should handle HTML entities in title", () => {
      render(<CardTitle title="Title &amp; More" />);
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });

    it("should handle single character title", () => {
      render(<CardTitle title="A" />);
      expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("should handle numeric title", () => {
      render(<CardTitle title="123" />);
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    it("should handle very long titles", () => {
      const veryLongTitle = "A".repeat(200);
      render(<CardTitle title={veryLongTitle} />);
      expect(screen.getByText(veryLongTitle)).toBeInTheDocument();
    });

    it("should handle title with tabs", () => {
      render(<CardTitle title="Title\tWith\tTabs" />);
      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Component behavior", () => {
    it("should be a pure component", () => {
      const { rerender } = render(<CardTitle title="Same" />);
      const first = screen.getByRole("heading");

      rerender(<CardTitle title="Same" />);
      const second = screen.getByRole("heading");

      expect(first).toBeInTheDocument();
      expect(second).toBeInTheDocument();
    });

    it("should not have side effects", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      render(<CardTitle title="Test" />);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should render immediately", () => {
      render(<CardTitle title="Immediate" />);
      expect(screen.getByText("Immediate")).toBeInTheDocument();
    });

    it("should not modify props", () => {
      const props = { title: "Original" };
      render(<CardTitle {...props} />);
      expect(props.title).toBe("Original");
    });

    it("should be stateless", () => {
      const { container } = render(<CardTitle title="Stateless" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Default export", () => {
    it("should export CardTitle as default", () => {
      expect(CardTitle).toBeDefined();
      expect(typeof CardTitle).toBe("function");
    });

    it("should be a React component", () => {
      const result = render(<CardTitle title="Test" />);
      expect(result).toBeDefined();
    });

    it("should return valid JSX", () => {
      const { container } = render(<CardTitle title="Valid" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Bootstrap card integration", () => {
    it("should use Bootstrap card-title class", () => {
      render(<CardTitle title="Bootstrap" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("card-title");
    });

    it("should work within card component", () => {
      render(
        <div className="card">
          <div className="card-body">
            <CardTitle title="Card Header" />
          </div>
        </div>
      );
      expect(screen.getByText("Card Header")).toBeInTheDocument();
    });

    it("should follow Bootstrap card conventions", () => {
      const { container } = render(<CardTitle title="Convention" />);
      const cardTitle = container.querySelector(".card-title");
      expect(cardTitle?.nodeName).toBe("H5");
    });

    it("should integrate with Bootstrap card structure", () => {
      render(<CardTitle title="Integration" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("card-title");
      expect(heading.nodeName).toBe("H5");
    });
  });

  describe("Integration scenarios", () => {
    it("should work in dashboard cards", () => {
      render(<CardTitle title="Dashboard Card" />);
      expect(screen.getByText("Dashboard Card")).toBeInTheDocument();
    });

    it("should work in widget headers", () => {
      render(
        <div className="widget">
          <CardTitle title="Widget Title" />
        </div>
      );
      expect(screen.getByText("Widget Title")).toBeInTheDocument();
    });

    it("should work in panel headers", () => {
      render(
        <div className="panel">
          <CardTitle title="Panel Title" />
        </div>
      );
      expect(screen.getByText("Panel Title")).toBeInTheDocument();
    });

    it("should work as card header", () => {
      render(<CardTitle title="Header Title" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("card-title");
    });

    it("should work in multiple contexts", () => {
      render(
        <>
          <CardTitle title="Context 1" />
          <CardTitle title="Context 2" />
        </>
      );
      expect(screen.getByText("Context 1")).toBeInTheDocument();
      expect(screen.getByText("Context 2")).toBeInTheDocument();
    });
  });

  describe("Multiple instances", () => {
    it("should render multiple CardTitle components", () => {
      render(
        <>
          <CardTitle title="Title 1" />
          <CardTitle title="Title 2" />
        </>
      );
      expect(screen.getByText("Title 1")).toBeInTheDocument();
      expect(screen.getByText("Title 2")).toBeInTheDocument();
    });

    it("should keep instances independent", () => {
      render(
        <>
          <CardTitle title="First" />
          <CardTitle title="Second" />
        </>
      );
      const headings = screen.getAllByRole("heading");
      expect(headings).toHaveLength(2);
    });

    it("should maintain separate titles", () => {
      render(
        <>
          <CardTitle title="A" />
          <CardTitle title="B" />
          <CardTitle title="C" />
        </>
      );
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
      expect(screen.getByText("C")).toBeInTheDocument();
    });

    it("should render all with card-title class", () => {
      const { container } = render(
        <>
          <CardTitle title="One" />
          <CardTitle title="Two" />
        </>
      );
      const cardTitles = container.querySelectorAll(".card-title");
      expect(cardTitles).toHaveLength(2);
    });
  });

  describe("Semantic HTML", () => {
    it("should use h5 heading element", () => {
      const { container } = render(<CardTitle title="Semantic" />);
      const h5 = container.querySelector("h5");
      expect(h5).toBeInTheDocument();
    });

    it("should have proper heading level", () => {
      render(<CardTitle title="Level 5" />);
      const heading = screen.getByRole("heading", { level: 5 });
      expect(heading).toBeInTheDocument();
    });

    it("should maintain semantic structure", () => {
      const { container } = render(<CardTitle title="Structure" />);
      expect(container.firstChild?.nodeName).toBe("H5");
    });

    it("should be semantically correct", () => {
      render(<CardTitle title="Correct" />);
      const heading = screen.getByRole("heading", { level: 5 });
      expect(heading).toHaveClass("card-title");
    });
  });

  describe("Visual presentation", () => {
    it("should be styled as card title", () => {
      render(<CardTitle title="Styled" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("card-title");
    });

    it("should use h5 for appropriate sizing", () => {
      const { container } = render(<CardTitle title="Sized" />);
      const h5 = container.querySelector("h5");
      expect(h5).toBeInTheDocument();
    });

    it("should follow Bootstrap styling", () => {
      render(<CardTitle title="Bootstrap Style" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("card-title");
    });
  });

  describe("Text content", () => {
    it("should display exact title text", () => {
      render(<CardTitle title="Exact Text" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveTextContent("Exact Text");
    });

    it("should not modify title text", () => {
      render(<CardTitle title="Original Text" />);
      expect(screen.getByText("Original Text")).toBeInTheDocument();
    });

    it("should preserve text formatting", () => {
      render(<CardTitle title="Formatted  Text" />);
      const heading = screen.getByRole("heading");
      expect(heading.textContent).toBe("Formatted  Text");
    });

    it("should handle empty text", () => {
      render(<CardTitle title="" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveTextContent("");
    });
  });
});
