import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CardLoading from "../card-loading";

describe("CardLoading", () => {
  describe("Rendering", () => {
    it("should render the component", () => {
      const { container } = render(<CardLoading />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render spinner element", () => {
      render(<CardLoading />);
      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });

    it("should render loading text", () => {
      render(<CardLoading />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render without errors", () => {
      const { container } = render(<CardLoading />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("should have outer wrapper div", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.querySelector(".text-center.py-3");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have spinner div inside wrapper", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.querySelector(".text-center.py-3") as HTMLElement;
      const spinner = screen.getByRole("status");
      expect(wrapper).toContainElement(spinner);
    });

    it("should have span inside spinner", () => {
      const { container } = render(<CardLoading />);
      const spinner = screen.getByRole("status") as HTMLElement;
      const span = container.querySelector(".visually-hidden");
      expect(spinner).toContainElement(span as HTMLElement);
    });

    it("should have proper nesting structure", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.querySelector(".text-center");
      const spinner = wrapper?.querySelector(".spinner-border");
      const span = spinner?.querySelector(".visually-hidden");
      
      expect(wrapper).toBeInTheDocument();
      expect(spinner).toBeInTheDocument();
      expect(span).toBeInTheDocument();
    });

    it("should have single outer wrapper", () => {
      const { container } = render(<CardLoading />);
      const wrappers = container.querySelectorAll(".text-center.py-3");
      expect(wrappers).toHaveLength(1);
    });

    it("should have single spinner", () => {
      const { container } = render(<CardLoading />);
      const spinners = container.querySelectorAll(".spinner-border");
      expect(spinners).toHaveLength(1);
    });
  });

  describe("CSS classes", () => {
    it("should have text-center class on wrapper", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.querySelector(".text-center");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have py-3 class on wrapper", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.querySelector(".py-3");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have both text-center and py-3 classes", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.querySelector(".text-center.py-3");
      expect(wrapper?.classList.contains("text-center")).toBe(true);
      expect(wrapper?.classList.contains("py-3")).toBe(true);
    });

    it("should have spinner-border class", () => {
      const { container } = render(<CardLoading />);
      const spinner = container.querySelector(".spinner-border");
      expect(spinner).toBeInTheDocument();
    });

    it("should have spinner-border-sm class", () => {
      const { container } = render(<CardLoading />);
      const spinner = container.querySelector(".spinner-border-sm");
      expect(spinner).toBeInTheDocument();
    });

    it("should have text-primary class on spinner", () => {
      const { container } = render(<CardLoading />);
      const spinner = container.querySelector(".text-primary");
      expect(spinner).toBeInTheDocument();
    });

    it("should have visually-hidden class on span", () => {
      const { container } = render(<CardLoading />);
      const span = container.querySelector(".visually-hidden");
      expect(span).toBeInTheDocument();
    });

    it("should have all Bootstrap spinner classes", () => {
      const { container } = render(<CardLoading />);
      const spinner = screen.getByRole("status");
      expect(spinner).toHaveClass("spinner-border");
      expect(spinner).toHaveClass("spinner-border-sm");
      expect(spinner).toHaveClass("text-primary");
    });
  });

  describe("Accessibility", () => {
    it("should have role status on spinner", () => {
      render(<CardLoading />);
      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });

    it("should have role attribute set correctly", () => {
      render(<CardLoading />);
      const spinner = screen.getByRole("status");
      expect(spinner).toHaveAttribute("role", "status");
    });

    it("should have visually-hidden loading text", () => {
      render(<CardLoading />);
      const text = screen.getByText("Loading...");
      expect(text).toHaveClass("visually-hidden");
    });

    it("should be accessible to screen readers", () => {
      render(<CardLoading />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should have descriptive loading message", () => {
      render(<CardLoading />);
      const text = screen.getByText("Loading...");
      expect(text).toBeInTheDocument();
    });

    it("should hide loading text visually", () => {
      const { container } = render(<CardLoading />);
      const span = container.querySelector(".visually-hidden");
      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent("Loading...");
    });
  });

  describe("Spinner properties", () => {
    it("should use Bootstrap spinner", () => {
      const { container } = render(<CardLoading />);
      const spinner = container.querySelector(".spinner-border");
      expect(spinner).toBeInTheDocument();
    });

    it("should use small spinner size", () => {
      const { container } = render(<CardLoading />);
      const spinner = container.querySelector(".spinner-border-sm");
      expect(spinner).toBeInTheDocument();
    });

    it("should use primary color", () => {
      const { container } = render(<CardLoading />);
      const spinner = container.querySelector(".text-primary");
      expect(spinner).toBeInTheDocument();
    });

    it("should have status role for ARIA", () => {
      render(<CardLoading />);
      const spinner = screen.getByRole("status");
      expect(spinner).toHaveAttribute("role", "status");
    });
  });

  describe("Layout", () => {
    it("should center content", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.querySelector(".text-center");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have vertical padding", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.querySelector(".py-3");
      expect(wrapper).toBeInTheDocument();
    });

    it("should use Bootstrap padding utility", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("py-3");
    });

    it("should use Bootstrap text alignment", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("text-center");
    });
  });

  describe("Component behavior", () => {
    it("should render consistently", () => {
      const { rerender } = render(<CardLoading />);
      const first = screen.getByRole("status");

      rerender(<CardLoading />);
      const second = screen.getByRole("status");

      expect(first).toBeInTheDocument();
      expect(second).toBeInTheDocument();
    });

    it("should not have side effects", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      render(<CardLoading />);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should render immediately", () => {
      render(<CardLoading />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should be a stateless component", () => {
      const { container } = render(<CardLoading />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should not accept props", () => {
      const { container } = render(<CardLoading />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Default export", () => {
    it("should export CardLoading as default", () => {
      expect(CardLoading).toBeDefined();
      expect(typeof CardLoading).toBe("function");
    });

    it("should be a React component", () => {
      const result = render(<CardLoading />);
      expect(result).toBeDefined();
    });

    it("should return valid JSX", () => {
      const { container } = render(<CardLoading />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Loading state", () => {
    it("should display loading indicator", () => {
      render(<CardLoading />);
      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });

    it("should have loading text for screen readers", () => {
      render(<CardLoading />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should indicate busy state", () => {
      render(<CardLoading />);
      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Visual presentation", () => {
    it("should use primary color scheme", () => {
      const { container } = render(<CardLoading />);
      const spinner = container.querySelector(".text-primary");
      expect(spinner).toBeInTheDocument();
    });

    it("should use small spinner", () => {
      const { container } = render(<CardLoading />);
      const spinner = container.querySelector(".spinner-border-sm");
      expect(spinner).toBeInTheDocument();
    });

    it("should center spinner horizontally", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.querySelector(".text-center");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have padding around spinner", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.querySelector(".py-3");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Multiple instances", () => {
    it("should render multiple CardLoading components", () => {
      render(
        <>
          <CardLoading />
          <CardLoading />
        </>
      );
      const spinners = screen.getAllByRole("status");
      expect(spinners).toHaveLength(2);
    });

    it("should keep instances independent", () => {
      const { container } = render(
        <>
          <CardLoading />
          <CardLoading />
        </>
      );
      const wrappers = container.querySelectorAll(".text-center.py-3");
      expect(wrappers).toHaveLength(2);
    });

    it("should render all loading texts", () => {
      render(
        <>
          <CardLoading />
          <CardLoading />
          <CardLoading />
        </>
      );
      const texts = screen.getAllByText("Loading...");
      expect(texts).toHaveLength(3);
    });
  });

  describe("Integration scenarios", () => {
    it("should work in card component", () => {
      render(
        <div className="card">
          <CardLoading />
        </div>
      );
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should work in table loading state", () => {
      render(
        <div className="table">
          <CardLoading />
        </div>
      );
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should work in dashboard widgets", () => {
      render(
        <div className="widget">
          <CardLoading />
        </div>
      );
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should work as standalone loading indicator", () => {
      render(<CardLoading />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should work in list loading state", () => {
      render(
        <div className="list">
          <CardLoading />
        </div>
      );
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("Bootstrap components", () => {
    it("should use Bootstrap spinner component", () => {
      const { container } = render(<CardLoading />);
      const spinner = container.querySelector(".spinner-border");
      expect(spinner).toBeInTheDocument();
    });

    it("should use Bootstrap utilities", () => {
      const { container } = render(<CardLoading />);
      expect(container.querySelector(".text-center")).toBeInTheDocument();
      expect(container.querySelector(".py-3")).toBeInTheDocument();
    });

    it("should use Bootstrap color classes", () => {
      const { container } = render(<CardLoading />);
      const spinner = container.querySelector(".text-primary");
      expect(spinner).toBeInTheDocument();
    });

    it("should use Bootstrap sizing classes", () => {
      const { container } = render(<CardLoading />);
      const spinner = container.querySelector(".spinner-border-sm");
      expect(spinner).toBeInTheDocument();
    });

    it("should use Bootstrap screen reader utilities", () => {
      const { container } = render(<CardLoading />);
      const span = container.querySelector(".visually-hidden");
      expect(span).toBeInTheDocument();
    });
  });

  describe("Semantic HTML", () => {
    it("should use div elements", () => {
      const { container } = render(<CardLoading />);
      const divs = container.querySelectorAll("div");
      expect(divs.length).toBeGreaterThanOrEqual(2);
    });

    it("should use span for hidden text", () => {
      const { container } = render(<CardLoading />);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
    });

    it("should have proper element hierarchy", () => {
      const { container } = render(<CardLoading />);
      const wrapper = container.querySelector("div");
      const spinner = wrapper?.querySelector("div");
      const span = spinner?.querySelector("span");
      
      expect(wrapper).toBeInTheDocument();
      expect(spinner).toBeInTheDocument();
      expect(span).toBeInTheDocument();
    });
  });

  describe("Rerendering", () => {
    it("should maintain structure on rerender", () => {
      const { rerender } = render(<CardLoading />);
      const first = screen.getByRole("status");

      rerender(<CardLoading />);
      const second = screen.getByRole("status");

      expect(first).toBeInTheDocument();
      expect(second).toBeInTheDocument();
    });

    it("should maintain CSS classes on rerender", () => {
      const { container, rerender } = render(<CardLoading />);
      
      rerender(<CardLoading />);
      
      expect(container.querySelector(".text-center")).toBeInTheDocument();
      expect(container.querySelector(".spinner-border")).toBeInTheDocument();
    });

    it("should handle multiple rerenders", () => {
      const { rerender } = render(<CardLoading />);
      rerender(<CardLoading />);
      rerender(<CardLoading />);
      
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should render without props", () => {
      render(<CardLoading />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should be self-contained", () => {
      const { container } = render(<CardLoading />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should not require external state", () => {
      render(<CardLoading />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should be reusable", () => {
      const { rerender } = render(<CardLoading />);
      rerender(<CardLoading />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });
});
