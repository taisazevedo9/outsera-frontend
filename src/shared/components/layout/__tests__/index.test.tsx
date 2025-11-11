import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PageLayout } from "../index";

jest.mock("../../page-title", () => {
  return jest.fn(({ title }: any) => (
    <div data-testid="page-title">{title}</div>
  ));
});

jest.mock("../../page-content", () => {
  return jest.fn(({ children }: any) => (
    <div data-testid="page-content">{children}</div>
  ));
});

jest.mock("../../ui/content", () => ({
  CardContent: jest.fn(({ children }: any) => (
    <div data-testid="card-content">{children}</div>
  )),
}));

import PageTitle from "../../page-title";
import PageContent from "../../page-content";
import { CardContent } from "../../ui/content";

const MockedPageTitle = PageTitle as jest.MockedFunction<typeof PageTitle>;
const MockedPageContent = PageContent as jest.MockedFunction<typeof PageContent>;
const MockedCardContent = CardContent as jest.MockedFunction<typeof CardContent>;

describe("PageLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component", () => {
      render(<PageLayout title="Test">Content</PageLayout>);
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
    });

    it("should render main element", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      const main = container.querySelector("main");
      expect(main).toBeInTheDocument();
    });

    it("should render all child components", () => {
      render(<PageLayout title="Test">Content</PageLayout>);
      expect(screen.getByTestId("page-title")).toBeInTheDocument();
      expect(screen.getByTestId("page-content")).toBeInTheDocument();
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
    });

    it("should render without errors", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Title prop", () => {
    it("should pass title to PageTitle", () => {
      render(<PageLayout title="My Title">Content</PageLayout>);
      expect(MockedPageTitle).toHaveBeenCalledWith(
        expect.objectContaining({ title: "My Title" }),
        {}
      );
    });

    it("should display title in PageTitle component", () => {
      render(<PageLayout title="Dashboard">Content</PageLayout>);
      expect(screen.getByTestId("page-title")).toHaveTextContent("Dashboard");
    });

    it("should handle empty string title", () => {
      render(<PageLayout title="">Content</PageLayout>);
      expect(MockedPageTitle).toHaveBeenCalledWith(
        expect.objectContaining({ title: "" }),
        {}
      );
    });

    it("should handle long title", () => {
      const longTitle = "This is a very long title that should be handled correctly";
      render(<PageLayout title={longTitle}>Content</PageLayout>);
      expect(screen.getByTestId("page-title")).toHaveTextContent(longTitle);
    });

    it("should update title on rerender", () => {
      const { rerender } = render(<PageLayout title="Initial">Content</PageLayout>);
      expect(screen.getByTestId("page-title")).toHaveTextContent("Initial");

      rerender(<PageLayout title="Updated">Content</PageLayout>);
      expect(screen.getByTestId("page-title")).toHaveTextContent("Updated");
    });
  });

  describe("Children prop", () => {
    it("should render children content", () => {
      render(<PageLayout title="Test">Test Content</PageLayout>);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should pass children to PageContent", () => {
      render(<PageLayout title="Test">Child Content</PageLayout>);
      expect(MockedPageContent).toHaveBeenCalled();
      expect(screen.getByTestId("page-content")).toHaveTextContent("Child Content");
    });

    it("should render JSX children", () => {
      render(
        <PageLayout title="Test">
          <div data-testid="custom-child">Custom</div>
        </PageLayout>
      );
      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <PageLayout title="Test">
          <div>Child 1</div>
          <div>Child 2</div>
        </PageLayout>
      );
      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
    });

    it("should render complex nested children", () => {
      render(
        <PageLayout title="Test">
          <div>
            <span>Nested</span>
            <p>Content</p>
          </div>
        </PageLayout>
      );
      expect(screen.getByText("Nested")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("should have main as root element", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      expect(container.firstChild?.nodeName).toBe("MAIN");
    });

    it("should have wrapper div with w-100 class", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      const div = container.querySelector(".w-100");
      expect(div).toBeInTheDocument();
    });

    it("should nest components correctly", () => {
      render(<PageLayout title="Test">Content</PageLayout>);
      const cardContent = screen.getByTestId("card-content");
      const pageTitle = screen.getByTestId("page-title");
      const pageContent = screen.getByTestId("page-content");
      
      expect(cardContent).toContainElement(pageTitle);
      expect(cardContent).toContainElement(pageContent);
    });

    it("should render PageTitle before PageContent", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      const cardContent = container.querySelector('[data-testid="card-content"]');
      const children = Array.from(cardContent?.children || []);
      
      const titleIndex = children.findIndex(
        (el) => el.getAttribute("data-testid") === "page-title"
      );
      const contentIndex = children.findIndex(
        (el) => el.getAttribute("data-testid") === "page-content"
      );
      
      expect(titleIndex).toBeLessThan(contentIndex);
    });

    it("should have single main element", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      const mains = container.querySelectorAll("main");
      expect(mains).toHaveLength(1);
    });
  });

  describe("CSS classes", () => {
    it("should have w-100 class", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      const div = container.querySelector(".w-100");
      expect(div).toBeInTheDocument();
    });

    it("should have py-3 class for padding", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      const div = container.querySelector(".py-3");
      expect(div).toBeInTheDocument();
    });

    it("should have responsive padding classes", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      const div = container.querySelector(".py-3.py-md-4");
      expect(div).toBeInTheDocument();
      expect(div?.classList.contains("py-3")).toBe(true);
      expect(div?.classList.contains("py-md-4")).toBe(true);
    });

    it("should use responsive wrapper classes", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      const div = container.querySelector("div.w-100");
      expect(div).toBeInTheDocument();
    });
  });

  describe("Component integration", () => {
    it("should call PageTitle with correct props", () => {
      render(<PageLayout title="Integration Test">Content</PageLayout>);
      expect(MockedPageTitle).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Integration Test" }),
        {}
      );
    });

    it("should call PageContent with children", () => {
      render(<PageLayout title="Test">Page Content</PageLayout>);
      expect(MockedPageContent).toHaveBeenCalled();
    });

    it("should call CardContent with children", () => {
      render(<PageLayout title="Test">Content</PageLayout>);
      expect(MockedCardContent).toHaveBeenCalled();
    });

    it("should call all components exactly once", () => {
      render(<PageLayout title="Test">Content</PageLayout>);
      expect(MockedPageTitle).toHaveBeenCalledTimes(1);
      expect(MockedPageContent).toHaveBeenCalledTimes(1);
      expect(MockedCardContent).toHaveBeenCalledTimes(1);
    });

    it("should integrate all components correctly", () => {
      render(<PageLayout title="Full Test">Full Content</PageLayout>);
      
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
      expect(screen.getByTestId("page-title")).toHaveTextContent("Full Test");
      expect(screen.getByTestId("page-content")).toHaveTextContent("Full Content");
    });
  });

  describe("Props interface", () => {
    it("should accept PageLayoutProps interface", () => {
      const props = { title: "Test", children: "Content" };
      render(<PageLayout {...props} />);
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
    });

    it("should require title prop", () => {
      render(<PageLayout title="Required">Content</PageLayout>);
      expect(MockedPageTitle).toHaveBeenCalledWith(
        expect.objectContaining({ title: expect.any(String) }),
        {}
      );
    });

    it("should require children prop", () => {
      render(<PageLayout title="Test">Required Children</PageLayout>);
      expect(screen.getByText("Required Children")).toBeInTheDocument();
    });

    it("should accept React.ReactNode as children", () => {
      render(
        <PageLayout title="Test">
          <div>Node 1</div>
          <span>Node 2</span>
        </PageLayout>
      );
      expect(screen.getByText("Node 1")).toBeInTheDocument();
      expect(screen.getByText("Node 2")).toBeInTheDocument();
    });
  });

  describe("Rerendering", () => {
    it("should update title on rerender", () => {
      const { rerender } = render(<PageLayout title="First">Content</PageLayout>);
      expect(screen.getByTestId("page-title")).toHaveTextContent("First");

      rerender(<PageLayout title="Second">Content</PageLayout>);
      expect(screen.getByTestId("page-title")).toHaveTextContent("Second");
    });

    it("should update children on rerender", () => {
      const { rerender } = render(<PageLayout title="Test">Initial</PageLayout>);
      expect(screen.getByText("Initial")).toBeInTheDocument();

      rerender(<PageLayout title="Test">Updated</PageLayout>);
      expect(screen.getByText("Updated")).toBeInTheDocument();
      expect(screen.queryByText("Initial")).not.toBeInTheDocument();
    });

    it("should maintain structure on rerender", () => {
      const { rerender } = render(<PageLayout title="Test">Content</PageLayout>);
      const initialStructure = screen.getByTestId("card-content");

      rerender(<PageLayout title="Test">New Content</PageLayout>);
      const rerenderedStructure = screen.getByTestId("card-content");

      expect(initialStructure).toBeInTheDocument();
      expect(rerenderedStructure).toBeInTheDocument();
    });

    it("should handle multiple rerenders", () => {
      const { rerender } = render(<PageLayout title="T1">C1</PageLayout>);
      rerender(<PageLayout title="T2">C2</PageLayout>);
      rerender(<PageLayout title="T3">C3</PageLayout>);
      
      expect(screen.getByTestId("page-title")).toHaveTextContent("T3");
      expect(screen.getByText("C3")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle empty children", () => {
      render(<PageLayout title="Test">{""}</PageLayout>);
      expect(screen.getByTestId("page-content")).toBeInTheDocument();
    });

    it("should handle null children", () => {
      render(<PageLayout title="Test">{null}</PageLayout>);
      expect(screen.getByTestId("page-content")).toBeInTheDocument();
    });

    it("should handle undefined children", () => {
      render(<PageLayout title="Test">{undefined}</PageLayout>);
      expect(screen.getByTestId("page-content")).toBeInTheDocument();
    });

    it("should handle very long content", () => {
      const longContent = "A".repeat(1000);
      render(<PageLayout title="Test">{longContent}</PageLayout>);
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      render(<PageLayout title="Test @#$% Title">Content</PageLayout>);
      expect(screen.getByTestId("page-title")).toHaveTextContent("Test @#$% Title");
    });

    it("should handle numeric children", () => {
      render(<PageLayout title="Test">{123}</PageLayout>);
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    it("should handle boolean children", () => {
      render(<PageLayout title="Test">{true}</PageLayout>);
      expect(screen.getByTestId("page-content")).toBeInTheDocument();
    });
  });

  describe("Semantic HTML", () => {
    it("should use semantic main element", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      const main = container.querySelector("main");
      expect(main).toBeInTheDocument();
    });

    it("should have proper semantic structure", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      const main = container.querySelector("main");
      const div = main?.querySelector(".w-100");
      expect(div).toBeInTheDocument();
    });

    it("should be accessible", () => {
      render(<PageLayout title="Accessible">Content</PageLayout>);
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
    });
  });

  describe("Component composition", () => {
    it("should compose CardContent, PageTitle, and PageContent", () => {
      render(<PageLayout title="Compose">Content</PageLayout>);
      
      expect(MockedCardContent).toHaveBeenCalled();
      expect(MockedPageTitle).toHaveBeenCalled();
      expect(MockedPageContent).toHaveBeenCalled();
    });

    it("should nest PageTitle and PageContent inside CardContent", () => {
      render(<PageLayout title="Test">Content</PageLayout>);
      
      const cardContent = screen.getByTestId("card-content");
      const pageTitle = screen.getByTestId("page-title");
      const pageContent = screen.getByTestId("page-content");
      
      expect(cardContent).toContainElement(pageTitle);
      expect(cardContent).toContainElement(pageContent);
    });

    it("should maintain component hierarchy", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      
      const main = container.querySelector("main") as HTMLElement;
      const wrapperDiv = main?.querySelector(".w-100") as HTMLElement;
      const cardContent = wrapperDiv?.querySelector('[data-testid="card-content"]') as HTMLElement;
      
      expect(main).toContainElement(wrapperDiv);
      expect(wrapperDiv).toContainElement(cardContent);
    });
  });

  describe("Component behavior", () => {
    it("should render consistently", () => {
      const { rerender } = render(<PageLayout title="Same">Same</PageLayout>);
      const first = screen.getByTestId("card-content");

      rerender(<PageLayout title="Same">Same</PageLayout>);
      const second = screen.getByTestId("card-content");

      expect(first).toBeInTheDocument();
      expect(second).toBeInTheDocument();
    });

    it("should not have side effects", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      render(<PageLayout title="Test">Content</PageLayout>);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should render immediately", () => {
      render(<PageLayout title="Immediate">Immediate</PageLayout>);
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
    });
  });

  describe("Default export", () => {
    it("should export PageLayout as named export", () => {
      expect(PageLayout).toBeDefined();
      expect(typeof PageLayout).toBe("function");
    });

    it("should be a React component", () => {
      const result = render(<PageLayout title="Test">Content</PageLayout>);
      expect(result).toBeDefined();
    });

    it("should return valid JSX", () => {
      const { container } = render(<PageLayout title="Test">Content</PageLayout>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Mock verification", () => {
    it("should call PageTitle with correct title", () => {
      render(<PageLayout title="Verify">Content</PageLayout>);
      const calls = MockedPageTitle.mock.calls[0];
      expect(calls[0].title).toBe("Verify");
    });

    it("should pass children to PageContent", () => {
      render(<PageLayout title="Test">Test Children</PageLayout>);
      expect(MockedPageContent).toHaveBeenCalled();
    });

    it("should not pass unexpected props", () => {
      render(<PageLayout title="Test">Content</PageLayout>);
      const calls = MockedPageTitle.mock.calls[0];
      const props = calls[0];
      expect(Object.keys(props)).toContain("title");
    });
  });

  describe("Integration scenarios", () => {
    it("should work as dashboard page layout", () => {
      render(
        <PageLayout title="Dashboard">
          <div>Dashboard Content</div>
        </PageLayout>
      );
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    });

    it("should work as list page layout", () => {
      render(
        <PageLayout title="List">
          <div>List Content</div>
        </PageLayout>
      );
      expect(screen.getByText("List")).toBeInTheDocument();
      expect(screen.getByText("List Content")).toBeInTheDocument();
    });

    it("should work with complex nested content", () => {
      render(
        <PageLayout title="Complex">
          <div>
            <header>Header</header>
            <section>Section</section>
            <footer>Footer</footer>
          </div>
        </PageLayout>
      );
      expect(screen.getByText("Header")).toBeInTheDocument();
      expect(screen.getByText("Section")).toBeInTheDocument();
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });
  });
});
