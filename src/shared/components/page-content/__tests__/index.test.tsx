import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PageContent from "../index";

describe("PageContent", () => {
  describe("Rendering", () => {
    it("should render the component", () => {
      const { container } = render(<PageContent>Test Content</PageContent>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render children", () => {
      render(<PageContent>Test Children</PageContent>);
      expect(screen.getByText("Test Children")).toBeInTheDocument();
    });

    it("should render without errors", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      expect(container).toBeInTheDocument();
    });

    it("should render with minimal props", () => {
      render(<PageContent>{""}</PageContent>);
      const { container } = render(<PageContent>Content</PageContent>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Children prop", () => {
    it("should render text children", () => {
      render(<PageContent>Simple text</PageContent>);
      expect(screen.getByText("Simple text")).toBeInTheDocument();
    });

    it("should render JSX children", () => {
      render(
        <PageContent>
          <div data-testid="custom-child">Custom Component</div>
        </PageContent>
      );
      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <PageContent>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </PageContent>
      );
      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
      expect(screen.getByText("Child 3")).toBeInTheDocument();
    });

    it("should render complex nested children", () => {
      render(
        <PageContent>
          <div>
            <header>Header</header>
            <section>Section</section>
            <footer>Footer</footer>
          </div>
        </PageContent>
      );
      expect(screen.getByText("Header")).toBeInTheDocument();
      expect(screen.getByText("Section")).toBeInTheDocument();
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });

    it("should render React components as children", () => {
      const CustomComponent = () => <div>Custom Component</div>;
      render(
        <PageContent>
          <CustomComponent />
        </PageContent>
      );
      expect(screen.getByText("Custom Component")).toBeInTheDocument();
    });

    it("should preserve children structure", () => {
      render(
        <PageContent>
          <div className="test-class">Preserved</div>
        </PageContent>
      );
      const div = screen.getByText("Preserved");
      expect(div).toHaveClass("test-class");
    });
  });

  describe("Component structure", () => {
    it("should have outer div with col-lg-12 class", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const outerDiv = container.querySelector(".col-lg-12");
      expect(outerDiv).toBeInTheDocument();
    });

    it("should have inner div with row class", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const innerDiv = container.querySelector(".row");
      expect(innerDiv).toBeInTheDocument();
    });

    it("should have inner div with mt-4 class", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const innerDiv = container.querySelector(".mt-4");
      expect(innerDiv).toBeInTheDocument();
    });

    it("should nest inner div inside outer div", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const outerDiv = container.querySelector(".col-lg-12") as HTMLElement;
      const innerDiv = container.querySelector(".row.mt-4") as HTMLElement;
      expect(outerDiv).toContainElement(innerDiv);
    });

    it("should have two nested divs", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const divs = container.querySelectorAll("div");
      expect(divs.length).toBeGreaterThanOrEqual(2);
    });

    it("should render children inside inner div", () => {
      const { container } = render(<PageContent>Test</PageContent>);
      const innerDiv = container.querySelector(".row.mt-4");
      expect(innerDiv).toHaveTextContent("Test");
    });
  });

  describe("CSS classes", () => {
    it("should have col-lg-12 class", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const div = container.querySelector(".col-lg-12");
      expect(div).toBeInTheDocument();
    });

    it("should have row class", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const div = container.querySelector(".row");
      expect(div).toBeInTheDocument();
    });

    it("should have mt-4 class", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const div = container.querySelector(".mt-4");
      expect(div).toBeInTheDocument();
    });

    it("should have both row and mt-4 classes on inner div", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const innerDiv = container.querySelector(".row.mt-4");
      expect(innerDiv).toBeInTheDocument();
      expect(innerDiv?.classList.contains("row")).toBe(true);
      expect(innerDiv?.classList.contains("mt-4")).toBe(true);
    });

    it("should use Bootstrap grid classes", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      expect(container.querySelector(".col-lg-12")).toBeInTheDocument();
      expect(container.querySelector(".row")).toBeInTheDocument();
    });

    it("should use Bootstrap spacing class", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const div = container.querySelector(".mt-4");
      expect(div).toBeInTheDocument();
    });
  });

  describe("Layout behavior", () => {
    it("should use full width column", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const col = container.querySelector(".col-lg-12");
      expect(col).toBeInTheDocument();
    });

    it("should create row for grid system", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const row = container.querySelector(".row");
      expect(row).toBeInTheDocument();
    });

    it("should apply top margin", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      const div = container.querySelector(".mt-4");
      expect(div).toBeInTheDocument();
    });

    it("should maintain responsive layout structure", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      expect(container.querySelector(".col-lg-12")).toBeInTheDocument();
      expect(container.querySelector(".row")).toBeInTheDocument();
    });
  });

  describe("Props interface", () => {
    it("should accept PageContentProps interface", () => {
      const props = { children: "Test Content" };
      render(<PageContent {...props} />);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should require children prop", () => {
      render(<PageContent>Required Children</PageContent>);
      expect(screen.getByText("Required Children")).toBeInTheDocument();
    });

    it("should accept React.ReactNode as children", () => {
      render(
        <PageContent>
          <span>Node 1</span>
          <div>Node 2</div>
        </PageContent>
      );
      expect(screen.getByText("Node 1")).toBeInTheDocument();
      expect(screen.getByText("Node 2")).toBeInTheDocument();
    });

    it("should accept string children", () => {
      render(<PageContent>String child</PageContent>);
      expect(screen.getByText("String child")).toBeInTheDocument();
    });

    it("should accept element children", () => {
      render(
        <PageContent>
          <div>Element child</div>
        </PageContent>
      );
      expect(screen.getByText("Element child")).toBeInTheDocument();
    });
  });

  describe("Rerendering", () => {
    it("should update children on rerender", () => {
      const { rerender } = render(<PageContent>Initial</PageContent>);
      expect(screen.getByText("Initial")).toBeInTheDocument();

      rerender(<PageContent>Updated</PageContent>);
      expect(screen.getByText("Updated")).toBeInTheDocument();
      expect(screen.queryByText("Initial")).not.toBeInTheDocument();
    });

    it("should maintain structure on rerender", () => {
      const { container, rerender } = render(<PageContent>First</PageContent>);
      const firstStructure = container.querySelector(".col-lg-12");

      rerender(<PageContent>Second</PageContent>);
      const secondStructure = container.querySelector(".col-lg-12");

      expect(firstStructure).toBeInTheDocument();
      expect(secondStructure).toBeInTheDocument();
    });

    it("should handle multiple rerenders", () => {
      const { rerender } = render(<PageContent>C1</PageContent>);
      rerender(<PageContent>C2</PageContent>);
      rerender(<PageContent>C3</PageContent>);
      
      expect(screen.getByText("C3")).toBeInTheDocument();
    });

    it("should maintain CSS classes on rerender", () => {
      const { container, rerender } = render(<PageContent>First</PageContent>);
      
      rerender(<PageContent>Second</PageContent>);
      
      expect(container.querySelector(".col-lg-12")).toBeInTheDocument();
      expect(container.querySelector(".row.mt-4")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle empty string children", () => {
      const { container } = render(<PageContent>{""}</PageContent>);
      expect(container.querySelector(".row.mt-4")).toBeInTheDocument();
    });

    it("should handle null children", () => {
      const { container } = render(<PageContent>{null}</PageContent>);
      expect(container.querySelector(".row.mt-4")).toBeInTheDocument();
    });

    it("should handle undefined children", () => {
      const { container } = render(<PageContent>{undefined}</PageContent>);
      expect(container.querySelector(".row.mt-4")).toBeInTheDocument();
    });

    it("should handle numeric children", () => {
      render(<PageContent>{123}</PageContent>);
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    it("should handle boolean children", () => {
      const { container } = render(<PageContent>{true}</PageContent>);
      expect(container.querySelector(".row.mt-4")).toBeInTheDocument();
    });

    it("should handle array of children", () => {
      render(
        <PageContent>
          {["Item 1", "Item 2", "Item 3"].map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </PageContent>
      );
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("should handle very long content", () => {
      const longContent = "A".repeat(1000);
      render(<PageContent>{longContent}</PageContent>);
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it("should handle special characters", () => {
      render(<PageContent>Special @#$% Characters</PageContent>);
      expect(screen.getByText("Special @#$% Characters")).toBeInTheDocument();
    });
  });

  describe("Component behavior", () => {
    it("should be a pure component", () => {
      const { rerender } = render(<PageContent>Same</PageContent>);
      const first = screen.getByText("Same");

      rerender(<PageContent>Same</PageContent>);
      const second = screen.getByText("Same");

      expect(first).toBeInTheDocument();
      expect(second).toBeInTheDocument();
    });

    it("should not have side effects", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      render(<PageContent>Test</PageContent>);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should render immediately", () => {
      render(<PageContent>Immediate</PageContent>);
      expect(screen.getByText("Immediate")).toBeInTheDocument();
    });

    it("should not modify children", () => {
      const content = <div>Original</div>;
      render(<PageContent>{content}</PageContent>);
      expect(screen.getByText("Original")).toBeInTheDocument();
    });
  });

  describe("Default export", () => {
    it("should export PageContent as default", () => {
      expect(PageContent).toBeDefined();
      expect(typeof PageContent).toBe("function");
    });

    it("should be a React component", () => {
      const result = render(<PageContent>Test</PageContent>);
      expect(result).toBeDefined();
    });

    it("should return valid JSX", () => {
      const { container } = render(<PageContent>Valid</PageContent>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should render accessible content", () => {
      render(<PageContent>Accessible content</PageContent>);
      expect(screen.getByText("Accessible content")).toBeInTheDocument();
    });

    it("should preserve child accessibility attributes", () => {
      render(
        <PageContent>
          <button aria-label="Test button">Click me</button>
        </PageContent>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Test button");
    });

    it("should maintain semantic structure", () => {
      render(
        <PageContent>
          <header>Header</header>
          <main>Main</main>
        </PageContent>
      );
      expect(screen.getByText("Header")).toBeInTheDocument();
      expect(screen.getByText("Main")).toBeInTheDocument();
    });
  });

  describe("Integration scenarios", () => {
    it("should work with dashboard content", () => {
      render(
        <PageContent>
          <div>Dashboard widgets</div>
        </PageContent>
      );
      expect(screen.getByText("Dashboard widgets")).toBeInTheDocument();
    });

    it("should work with list content", () => {
      render(
        <PageContent>
          <div>List items</div>
        </PageContent>
      );
      expect(screen.getByText("List items")).toBeInTheDocument();
    });

    it("should work with form content", () => {
      render(
        <PageContent>
          <form>
            <input type="text" placeholder="Name" />
          </form>
        </PageContent>
      );
      expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    });

    it("should work with table content", () => {
      render(
        <PageContent>
          <table>
            <tbody>
              <tr>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
        </PageContent>
      );
      expect(screen.getByText("Cell")).toBeInTheDocument();
    });

    it("should work with grid layout children", () => {
      render(
        <PageContent>
          <div className="col-md-6">Column 1</div>
          <div className="col-md-6">Column 2</div>
        </PageContent>
      );
      expect(screen.getByText("Column 1")).toBeInTheDocument();
      expect(screen.getByText("Column 2")).toBeInTheDocument();
    });
  });

  describe("Container structure", () => {
    it("should have proper nesting", () => {
      const { container } = render(<PageContent>Nested</PageContent>);
      const outer = container.querySelector(".col-lg-12") as HTMLElement;
      const inner = container.querySelector(".row.mt-4") as HTMLElement;
      
      expect(outer).toContainElement(inner);
    });

    it("should contain children in innermost div", () => {
      const { container } = render(
        <PageContent>
          <div data-testid="child">Child</div>
        </PageContent>
      );
      const inner = container.querySelector(".row.mt-4");
      const child = screen.getByTestId("child");
      
      expect(inner).toContainElement(child);
    });

    it("should maintain wrapper divs", () => {
      const { container } = render(<PageContent>Content</PageContent>);
      expect(container.querySelector(".col-lg-12")).toBeInTheDocument();
      expect(container.querySelector(".row")).toBeInTheDocument();
    });
  });

  describe("Multiple instances", () => {
    it("should render multiple PageContent components", () => {
      render(
        <>
          <PageContent>Content 1</PageContent>
          <PageContent>Content 2</PageContent>
        </>
      );
      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("should keep instances independent", () => {
      const { container } = render(
        <>
          <PageContent>First</PageContent>
          <PageContent>Second</PageContent>
        </>
      );
      const cols = container.querySelectorAll(".col-lg-12");
      expect(cols).toHaveLength(2);
    });

    it("should maintain separate children", () => {
      render(
        <>
          <PageContent>
            <div>A</div>
          </PageContent>
          <PageContent>
            <div>B</div>
          </PageContent>
        </>
      );
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
    });
  });
});
