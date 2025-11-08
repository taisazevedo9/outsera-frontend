import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CardContent } from "../content";

describe("CardContent", () => {
  describe("Rendering", () => {
    it("should render the component", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render children", () => {
      render(<CardContent>Test Content</CardContent>);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should render without errors", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      expect(container).toBeInTheDocument();
    });

    it("should render with minimal props", () => {
      const { container } = render(<CardContent>{""}</CardContent>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Children prop", () => {
    it("should render text children", () => {
      render(<CardContent>Simple text</CardContent>);
      expect(screen.getByText("Simple text")).toBeInTheDocument();
    });

    it("should render JSX children", () => {
      render(
        <CardContent>
          <div data-testid="custom-child">Custom Component</div>
        </CardContent>
      );
      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <CardContent>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </CardContent>
      );
      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
      expect(screen.getByText("Child 3")).toBeInTheDocument();
    });

    it("should render complex nested children", () => {
      render(
        <CardContent>
          <div>
            <header>Header</header>
            <section>Section</section>
            <footer>Footer</footer>
          </div>
        </CardContent>
      );
      expect(screen.getByText("Header")).toBeInTheDocument();
      expect(screen.getByText("Section")).toBeInTheDocument();
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });

    it("should render React components as children", () => {
      const CustomComponent = () => <div>Custom Component</div>;
      render(
        <CardContent>
          <CustomComponent />
        </CardContent>
      );
      expect(screen.getByText("Custom Component")).toBeInTheDocument();
    });

    it("should preserve children structure", () => {
      render(
        <CardContent>
          <div className="test-class">Preserved</div>
        </CardContent>
      );
      const div = screen.getByText("Preserved");
      expect(div).toHaveClass("test-class");
    });

    it("should accept React.ReactNode as children", () => {
      render(
        <CardContent>
          <span>Node 1</span>
          <div>Node 2</div>
        </CardContent>
      );
      expect(screen.getByText("Node 1")).toBeInTheDocument();
      expect(screen.getByText("Node 2")).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("should render a div element", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("should have card-body class", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const div = container.querySelector(".card-body");
      expect(div).toBeInTheDocument();
    });

    it("should have single wrapper div", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const divs = container.querySelectorAll("div");
      expect(divs).toHaveLength(1);
    });

    it("should render children inside card-body div", () => {
      const { container } = render(<CardContent>Test</CardContent>);
      const cardBody = container.querySelector(".card-body");
      expect(cardBody).toHaveTextContent("Test");
    });

    it("should not have nested wrapper divs", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      expect(container.firstChild?.nodeName).toBe("DIV");
      expect(container.children).toHaveLength(1);
    });
  });

  describe("CSS classes", () => {
    it("should have card-body class", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const div = container.querySelector(".card-body");
      expect(div).toBeInTheDocument();
    });

    it("should only have card-body class", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const div = container.firstChild as HTMLElement;
      expect(div.className).toBe("card-body");
    });

    it("should use Bootstrap card-body class", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const cardBody = container.querySelector(".card-body");
      expect(cardBody).toBeInTheDocument();
    });

    it("should have single class", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const div = container.firstChild as HTMLElement;
      const classes = div.className.split(" ");
      expect(classes).toHaveLength(1);
    });
  });

  describe("Props interface", () => {
    it("should accept Props interface", () => {
      const props = { children: "Test Content" };
      render(<CardContent {...props} />);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should require children prop", () => {
      render(<CardContent>Required Children</CardContent>);
      expect(screen.getByText("Required Children")).toBeInTheDocument();
    });

    it("should accept Readonly React.ReactNode", () => {
      const content: Readonly<React.ReactNode> = <div>Readonly Content</div>;
      render(<CardContent>{content}</CardContent>);
      expect(screen.getByText("Readonly Content")).toBeInTheDocument();
    });

    it("should handle string children", () => {
      render(<CardContent>String child</CardContent>);
      expect(screen.getByText("String child")).toBeInTheDocument();
    });

    it("should handle element children", () => {
      render(
        <CardContent>
          <div>Element child</div>
        </CardContent>
      );
      expect(screen.getByText("Element child")).toBeInTheDocument();
    });
  });

  describe("Rerendering", () => {
    it("should update children on rerender", () => {
      const { rerender } = render(<CardContent>Initial</CardContent>);
      expect(screen.getByText("Initial")).toBeInTheDocument();

      rerender(<CardContent>Updated</CardContent>);
      expect(screen.getByText("Updated")).toBeInTheDocument();
      expect(screen.queryByText("Initial")).not.toBeInTheDocument();
    });

    it("should maintain structure on rerender", () => {
      const { container, rerender } = render(<CardContent>First</CardContent>);
      const firstStructure = container.querySelector(".card-body");

      rerender(<CardContent>Second</CardContent>);
      const secondStructure = container.querySelector(".card-body");

      expect(firstStructure).toBeInTheDocument();
      expect(secondStructure).toBeInTheDocument();
    });

    it("should handle multiple rerenders", () => {
      const { rerender } = render(<CardContent>C1</CardContent>);
      rerender(<CardContent>C2</CardContent>);
      rerender(<CardContent>C3</CardContent>);

      expect(screen.getByText("C3")).toBeInTheDocument();
    });

    it("should maintain CSS class on rerender", () => {
      const { container, rerender } = render(<CardContent>First</CardContent>);

      rerender(<CardContent>Second</CardContent>);

      expect(container.querySelector(".card-body")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle empty string children", () => {
      const { container } = render(<CardContent>{""}</CardContent>);
      expect(container.querySelector(".card-body")).toBeInTheDocument();
    });

    it("should handle null children", () => {
      const { container } = render(<CardContent>{null}</CardContent>);
      expect(container.querySelector(".card-body")).toBeInTheDocument();
    });

    it("should handle undefined children", () => {
      const { container } = render(<CardContent>{undefined}</CardContent>);
      expect(container.querySelector(".card-body")).toBeInTheDocument();
    });

    it("should handle numeric children", () => {
      render(<CardContent>{123}</CardContent>);
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    it("should handle boolean children", () => {
      const { container } = render(<CardContent>{true}</CardContent>);
      expect(container.querySelector(".card-body")).toBeInTheDocument();
    });

    it("should handle array of children", () => {
      render(
        <CardContent>
          {["Item 1", "Item 2", "Item 3"].map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </CardContent>
      );
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("should handle very long content", () => {
      const longContent = "A".repeat(1000);
      render(<CardContent>{longContent}</CardContent>);
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it("should handle special characters", () => {
      render(<CardContent>Special @#$% Characters</CardContent>);
      expect(screen.getByText("Special @#$% Characters")).toBeInTheDocument();
    });

    it("should handle Unicode characters", () => {
      render(<CardContent>Unicode 测试 🎉</CardContent>);
      expect(screen.getByText("Unicode 测试 🎉")).toBeInTheDocument();
    });
  });

  describe("Component behavior", () => {
    it("should be a pure component", () => {
      const { rerender } = render(<CardContent>Same</CardContent>);
      const first = screen.getByText("Same");

      rerender(<CardContent>Same</CardContent>);
      const second = screen.getByText("Same");

      expect(first).toBeInTheDocument();
      expect(second).toBeInTheDocument();
    });

    it("should not have side effects", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      render(<CardContent>Test</CardContent>);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should render immediately", () => {
      render(<CardContent>Immediate</CardContent>);
      expect(screen.getByText("Immediate")).toBeInTheDocument();
    });

    it("should not modify children", () => {
      const content = <div>Original</div>;
      render(<CardContent>{content}</CardContent>);
      expect(screen.getByText("Original")).toBeInTheDocument();
    });

    it("should be stateless", () => {
      const { container } = render(<CardContent>Stateless</CardContent>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Named export", () => {
    it("should export CardContent as named export", () => {
      expect(CardContent).toBeDefined();
      expect(typeof CardContent).toBe("function");
    });

    it("should be a React component", () => {
      const result = render(<CardContent>Test</CardContent>);
      expect(result).toBeDefined();
    });

    it("should return valid JSX", () => {
      const { container } = render(<CardContent>Valid</CardContent>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Bootstrap card integration", () => {
    it("should use Bootstrap card-body class", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      expect(container.querySelector(".card-body")).toBeInTheDocument();
    });

    it("should work within card component", () => {
      render(
        <div className="card">
          <CardContent>Card Body Content</CardContent>
        </div>
      );
      expect(screen.getByText("Card Body Content")).toBeInTheDocument();
    });

    it("should follow Bootstrap card conventions", () => {
      const { container } = render(<CardContent>Convention</CardContent>);
      const cardBody = container.querySelector(".card-body");
      expect(cardBody?.nodeName).toBe("DIV");
    });

    it("should integrate with Bootstrap card structure", () => {
      const { container } = render(<CardContent>Integration</CardContent>);
      const div = container.firstChild as HTMLElement;
      expect(div).toHaveClass("card-body");
      expect(div.nodeName).toBe("DIV");
    });
  });

  describe("Integration scenarios", () => {
    it("should work in card layout", () => {
      render(<CardContent>Card content</CardContent>);
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("should work with page layout", () => {
      render(
        <div className="card">
          <CardContent>Page content</CardContent>
        </div>
      );
      expect(screen.getByText("Page content")).toBeInTheDocument();
    });

    it("should work with dashboard widgets", () => {
      render(
        <CardContent>
          <div>Dashboard widget</div>
        </CardContent>
      );
      expect(screen.getByText("Dashboard widget")).toBeInTheDocument();
    });

    it("should work with list items", () => {
      render(
        <CardContent>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </CardContent>
      );
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("should work with tables", () => {
      render(
        <CardContent>
          <table>
            <tbody>
              <tr>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      );
      expect(screen.getByText("Cell")).toBeInTheDocument();
    });
  });

  describe("Multiple instances", () => {
    it("should render multiple CardContent components", () => {
      render(
        <>
          <CardContent>Content 1</CardContent>
          <CardContent>Content 2</CardContent>
        </>
      );
      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("should keep instances independent", () => {
      const { container } = render(
        <>
          <CardContent>First</CardContent>
          <CardContent>Second</CardContent>
        </>
      );
      const cardBodies = container.querySelectorAll(".card-body");
      expect(cardBodies).toHaveLength(2);
    });

    it("should maintain separate children", () => {
      render(
        <>
          <CardContent>
            <div>A</div>
          </CardContent>
          <CardContent>
            <div>B</div>
          </CardContent>
        </>
      );
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
    });

    it("should render all with card-body class", () => {
      const { container } = render(
        <>
          <CardContent>One</CardContent>
          <CardContent>Two</CardContent>
          <CardContent>Three</CardContent>
        </>
      );
      const cardBodies = container.querySelectorAll(".card-body");
      expect(cardBodies).toHaveLength(3);
    });
  });

  describe("Semantic HTML", () => {
    it("should use div element", () => {
      const { container } = render(<CardContent>Semantic</CardContent>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("should maintain semantic structure", () => {
      const { container } = render(<CardContent>Structure</CardContent>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("should preserve child semantics", () => {
      render(
        <CardContent>
          <h2>Heading</h2>
          <p>Paragraph</p>
        </CardContent>
      );
      expect(screen.getByText("Heading")).toBeInTheDocument();
      expect(screen.getByText("Paragraph")).toBeInTheDocument();
    });
  });

  describe("Readonly children", () => {
    it("should handle readonly children prop", () => {
      const readonlyContent: Readonly<React.ReactNode> = "Readonly text";
      render(<CardContent>{readonlyContent}</CardContent>);
      expect(screen.getByText("Readonly text")).toBeInTheDocument();
    });

    it("should not modify readonly children", () => {
      const readonlyContent: Readonly<React.ReactNode> = <div>Readonly JSX</div>;
      render(<CardContent>{readonlyContent}</CardContent>);
      expect(screen.getByText("Readonly JSX")).toBeInTheDocument();
    });

    it("should preserve readonly structure", () => {
      const readonlyContent: Readonly<React.ReactNode> = (
        <div className="readonly">Readonly</div>
      );
      render(<CardContent>{readonlyContent}</CardContent>);
      const div = screen.getByText("Readonly");
      expect(div).toHaveClass("readonly");
    });
  });

  describe("Content wrapper", () => {
    it("should wrap content in card-body", () => {
      const { container } = render(<CardContent>Wrapped</CardContent>);
      const cardBody = container.querySelector(".card-body");
      expect(cardBody).toHaveTextContent("Wrapped");
    });

    it("should be a simple wrapper", () => {
      const { container } = render(<CardContent>Simple</CardContent>);
      expect(container.children).toHaveLength(1);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("should not add extra elements", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const allDivs = container.querySelectorAll("div");
      expect(allDivs).toHaveLength(1);
    });
  });
});
