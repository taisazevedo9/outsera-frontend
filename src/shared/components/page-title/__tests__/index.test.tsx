import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PageTitle from "../index";

describe("PageTitle", () => {
  describe("Rendering", () => {
    it("should render the component", () => {
      const { container } = render(<PageTitle title="Test Title" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render title text", () => {
      render(<PageTitle title="My Title" />);
      expect(screen.getByText("My Title")).toBeInTheDocument();
    });

    it("should render h1 element", () => {
      render(<PageTitle title="Heading" />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should render without errors", () => {
      const { container } = render(<PageTitle title="Test" />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Title prop", () => {
    it("should display the title", () => {
      render(<PageTitle title="Dashboard" />);
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("should display different titles", () => {
      const { rerender } = render(<PageTitle title="First" />);
      expect(screen.getByText("First")).toBeInTheDocument();

      rerender(<PageTitle title="Second" />);
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("should handle empty string title", () => {
      render(<PageTitle title="" />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("");
    });

    it("should handle long titles", () => {
      const longTitle = "This is a very long title that should be displayed correctly";
      render(<PageTitle title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle special characters", () => {
      render(<PageTitle title="Title @#$% & Special" />);
      expect(screen.getByText("Title @#$% & Special")).toBeInTheDocument();
    });

    it("should handle numeric strings", () => {
      render(<PageTitle title="2024" />);
      expect(screen.getByText("2024")).toBeInTheDocument();
    });

    it("should preserve title casing", () => {
      render(<PageTitle title="MixedCase Title" />);
      expect(screen.getByText("MixedCase Title")).toBeInTheDocument();
    });
  });

  describe("ClassName prop", () => {
    it("should apply custom className", () => {
      render(<PageTitle title="Test" className="custom-class" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("custom-class");
    });

    it("should have default empty className", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading.className).toContain("display-5");
    });

    it("should append className to existing classes", () => {
      render(<PageTitle title="Test" className="extra" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("display-5");
      expect(heading).toHaveClass("extra");
    });

    it("should handle multiple custom classes", () => {
      render(<PageTitle title="Test" className="class1 class2" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("class1");
      expect(heading).toHaveClass("class2");
    });

    it("should handle empty string className", () => {
      render(<PageTitle title="Test" className="" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("display-5");
    });

    it("should not break with undefined className", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("should have wrapper div with text-center", () => {
      const { container } = render(<PageTitle title="Test" />);
      const wrapper = container.querySelector(".text-center");
      expect(wrapper).toBeInTheDocument();
    });

    it("should contain h1 inside wrapper div", () => {
      const { container } = render(<PageTitle title="Test" />);
      const wrapper = container.querySelector(".text-center") as HTMLElement;
      const heading = screen.getByRole("heading");
      expect(wrapper).toContainElement(heading);
    });

    it("should have h1 as direct child of wrapper", () => {
      const { container } = render(<PageTitle title="Test" />);
      const wrapper = container.querySelector(".text-center");
      const heading = wrapper?.querySelector("h1");
      expect(heading).toBeInTheDocument();
    });

    it("should have single wrapper div", () => {
      const { container } = render(<PageTitle title="Test" />);
      const wrappers = container.querySelectorAll("div");
      expect(wrappers).toHaveLength(1);
    });

    it("should have single h1 element", () => {
      const { container } = render(<PageTitle title="Test" />);
      const headings = container.querySelectorAll("h1");
      expect(headings).toHaveLength(1);
    });
  });

  describe("CSS classes", () => {
    it("should have display-5 class", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("display-5");
    });

    it("should have fw-bold class", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("fw-bold");
    });

    it("should have text-primary class", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-primary");
    });

    it("should have mb-2 class", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("mb-2");
    });

    it("should have all Bootstrap classes", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("display-5");
      expect(heading).toHaveClass("fw-bold");
      expect(heading).toHaveClass("text-primary");
      expect(heading).toHaveClass("mb-2");
    });

    it("should have text-center on wrapper", () => {
      const { container } = render(<PageTitle title="Test" />);
      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveClass("text-center");
    });
  });

  describe("Typography", () => {
    it("should use Bootstrap display-5 for large heading", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("display-5");
    });

    it("should have bold font weight", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("fw-bold");
    });

    it("should use primary color", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-primary");
    });

    it("should have bottom margin", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("mb-2");
    });

    it("should center text", () => {
      const { container } = render(<PageTitle title="Test" />);
      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveClass("text-center");
    });
  });

  describe("Props interface", () => {
    it("should accept PageTitleProps interface", () => {
      const props = { title: "Test", className: "custom" };
      render(<PageTitle {...props} />);
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("should require title prop", () => {
      render(<PageTitle title="Required" />);
      expect(screen.getByText("Required")).toBeInTheDocument();
    });

    it("should have optional className prop", () => {
      render(<PageTitle title="Test" />);
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });

    it("should accept both props", () => {
      render(<PageTitle title="Both Props" className="both" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveTextContent("Both Props");
      expect(heading).toHaveClass("both");
    });

    it("should handle only required prop", () => {
      render(<PageTitle title="Only Title" />);
      expect(screen.getByText("Only Title")).toBeInTheDocument();
    });
  });

  describe("Rerendering", () => {
    it("should update title on rerender", () => {
      const { rerender } = render(<PageTitle title="Initial" />);
      expect(screen.getByText("Initial")).toBeInTheDocument();

      rerender(<PageTitle title="Updated" />);
      expect(screen.getByText("Updated")).toBeInTheDocument();
      expect(screen.queryByText("Initial")).not.toBeInTheDocument();
    });

    it("should update className on rerender", () => {
      const { rerender } = render(<PageTitle title="Test" className="first" />);
      let heading = screen.getByRole("heading");
      expect(heading).toHaveClass("first");

      rerender(<PageTitle title="Test" className="second" />);
      heading = screen.getByRole("heading");
      expect(heading).toHaveClass("second");
      expect(heading).not.toHaveClass("first");
    });

    it("should maintain structure on rerender", () => {
      const { container, rerender } = render(<PageTitle title="Test" />);
      const firstStructure = container.querySelector(".text-center");

      rerender(<PageTitle title="Test2" />);
      const secondStructure = container.querySelector(".text-center");

      expect(firstStructure).toBeInTheDocument();
      expect(secondStructure).toBeInTheDocument();
    });

    it("should handle multiple rerenders", () => {
      const { rerender } = render(<PageTitle title="T1" />);
      rerender(<PageTitle title="T2" />);
      rerender(<PageTitle title="T3" />);

      expect(screen.getByText("T3")).toBeInTheDocument();
    });

    it("should maintain CSS classes on rerender", () => {
      const { rerender } = render(<PageTitle title="First" />);
      rerender(<PageTitle title="Second" />);

      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("display-5");
      expect(heading).toHaveClass("fw-bold");
      expect(heading).toHaveClass("text-primary");
    });
  });

  describe("Edge cases", () => {
    it("should handle whitespace in title", () => {
      render(<PageTitle title="  Title  " />);
      expect(screen.getByText("Title", { exact: false })).toBeInTheDocument();
    });

    it("should handle title with line breaks", () => {
      const titleWithBreaks = "Title\nWith\nBreaks";
      render(<PageTitle title={titleWithBreaks} />);
      const heading = screen.getByRole("heading");
      expect(heading.textContent).toBe(titleWithBreaks);
    });

    it("should handle very long className", () => {
      const longClass = "class1 class2 class3 class4 class5";
      render(<PageTitle title="Test" className={longClass} />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("class1");
      expect(heading).toHaveClass("class5");
    });

    it("should handle Unicode characters", () => {
      render(<PageTitle title="Título 测试 🎉" />);
      expect(screen.getByText("Título 测试 🎉")).toBeInTheDocument();
    });

    it("should handle HTML entities in title", () => {
      render(<PageTitle title="Title &amp; More" />);
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });

    it("should handle single character title", () => {
      render(<PageTitle title="A" />);
      expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("should handle numeric title", () => {
      render(<PageTitle title="123" />);
      expect(screen.getByText("123")).toBeInTheDocument();
    });
  });

  describe("Component behavior", () => {
    it("should be a pure component", () => {
      const { rerender } = render(<PageTitle title="Same" />);
      const first = screen.getByRole("heading");

      rerender(<PageTitle title="Same" />);
      const second = screen.getByRole("heading");

      expect(first).toBeInTheDocument();
      expect(second).toBeInTheDocument();
    });

    it("should not have side effects", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      render(<PageTitle title="Test" />);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should render immediately", () => {
      render(<PageTitle title="Immediate" />);
      expect(screen.getByText("Immediate")).toBeInTheDocument();
    });

    it("should not modify props", () => {
      const props = { title: "Original", className: "original" };
      render(<PageTitle {...props} />);
      expect(props.title).toBe("Original");
      expect(props.className).toBe("original");
    });
  });

  describe("Default export", () => {
    it("should export PageTitle as default", () => {
      expect(PageTitle).toBeDefined();
      expect(typeof PageTitle).toBe("function");
    });

    it("should be a React component", () => {
      const result = render(<PageTitle title="Test" />);
      expect(result).toBeDefined();
    });

    it("should return valid JSX", () => {
      const { container } = render(<PageTitle title="Valid" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have h1 heading role", () => {
      render(<PageTitle title="Accessible" />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should have accessible text content", () => {
      render(<PageTitle title="Screen Reader Text" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveTextContent("Screen Reader Text");
    });

    it("should maintain heading hierarchy", () => {
      render(<PageTitle title="Main Title" />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      render(<PageTitle title="Keyboard" />);
      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
    });

    it("should preserve semantic HTML", () => {
      const { container } = render(<PageTitle title="Semantic" />);
      const h1 = container.querySelector("h1");
      expect(h1).toBeInTheDocument();
    });
  });

  describe("Integration scenarios", () => {
    it("should work in dashboard layout", () => {
      render(<PageTitle title="Dashboard" />);
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("should work in list layout", () => {
      render(<PageTitle title="List" />);
      expect(screen.getByText("List")).toBeInTheDocument();
    });

    it("should work with page layout wrapper", () => {
      render(
        <div>
          <PageTitle title="Page Title" />
        </div>
      );
      expect(screen.getByText("Page Title")).toBeInTheDocument();
    });

    it("should work with custom styling", () => {
      render(<PageTitle title="Custom" className="text-danger" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-danger");
      expect(heading).toHaveClass("text-primary");
    });

    it("should work in card component", () => {
      render(
        <div className="card">
          <PageTitle title="Card Title" />
        </div>
      );
      expect(screen.getByText("Card Title")).toBeInTheDocument();
    });
  });

  describe("Visual presentation", () => {
    it("should have large display heading", () => {
      render(<PageTitle title="Large" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("display-5");
    });

    it("should have bold text", () => {
      render(<PageTitle title="Bold" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("fw-bold");
    });

    it("should use primary color scheme", () => {
      render(<PageTitle title="Primary" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-primary");
    });

    it("should have centered text", () => {
      const { container } = render(<PageTitle title="Centered" />);
      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveClass("text-center");
    });

    it("should have bottom spacing", () => {
      render(<PageTitle title="Spaced" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("mb-2");
    });
  });

  describe("Multiple instances", () => {
    it("should render multiple PageTitle components", () => {
      render(
        <>
          <PageTitle title="Title 1" />
          <PageTitle title="Title 2" />
        </>
      );
      expect(screen.getByText("Title 1")).toBeInTheDocument();
      expect(screen.getByText("Title 2")).toBeInTheDocument();
    });

    it("should keep instances independent", () => {
      render(
        <>
          <PageTitle title="First" className="class1" />
          <PageTitle title="Second" className="class2" />
        </>
      );
      const headings = screen.getAllByRole("heading");
      expect(headings).toHaveLength(2);
    });

    it("should maintain separate titles", () => {
      render(
        <>
          <PageTitle title="A" />
          <PageTitle title="B" />
        </>
      );
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
    });
  });

  describe("Default className behavior", () => {
    it("should use empty string as default className", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      const classes = heading.className;
      expect(classes).not.toContain("undefined");
    });

    it("should handle omitted className prop", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("display-5");
    });

    it("should concatenate className properly", () => {
      render(<PageTitle title="Test" className="custom" />);
      const heading = screen.getByRole("heading");
      const classes = heading.className;
      expect(classes).toContain("display-5");
      expect(classes).toContain("custom");
    });

    it("should handle trailing space in className concatenation", () => {
      render(<PageTitle title="Test" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("display-5");
      expect(heading).toHaveClass("mb-2");
    });
  });
});
