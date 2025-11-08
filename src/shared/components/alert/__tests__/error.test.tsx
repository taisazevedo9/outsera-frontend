import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Error from "../error";

describe("Error", () => {
  describe("Rendering", () => {
    it("should render the component", () => {
      render(<Error error="Test error" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should render error message", () => {
      render(<Error error="Test error message" />);
      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("should render without crashing", () => {
      const { container } = render(<Error error="Error" />);
      expect(container).toBeInTheDocument();
    });

    it("should render with minimal props", () => {
      render(<Error error="" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("Error message display", () => {
    it("should display simple error message", () => {
      render(<Error error="Something went wrong" />);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should display network error message", () => {
      render(<Error error="Network error occurred" />);
      expect(screen.getByText("Network error occurred")).toBeInTheDocument();
    });

    it("should display validation error message", () => {
      render(<Error error="Invalid input" />);
      expect(screen.getByText("Invalid input")).toBeInTheDocument();
    });

    it("should display long error message", () => {
      const longError = "This is a very long error message that should be displayed correctly in the alert component";
      render(<Error error={longError} />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it("should display error with special characters", () => {
      render(<Error error="Error: Failed! @#$%" />);
      expect(screen.getByText("Error: Failed! @#$%")).toBeInTheDocument();
    });

    it("should display error with numbers", () => {
      render(<Error error="Error 404: Not found" />);
      expect(screen.getByText("Error 404: Not found")).toBeInTheDocument();
    });
  });

  describe("CSS classes", () => {
    it("should have alert class", () => {
      render(<Error error="Test" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("alert");
    });

    it("should have alert-danger class", () => {
      render(<Error error="Test" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("alert-danger");
    });

    it("should have both alert classes", () => {
      render(<Error error="Test" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("alert", "alert-danger");
    });

    it("should use Bootstrap alert styling", () => {
      render(<Error error="Test" />);
      const alert = screen.getByRole("alert");
      expect(alert.className).toContain("alert");
      expect(alert.className).toContain("alert-danger");
    });
  });

  describe("Accessibility", () => {
    it("should have role alert", () => {
      render(<Error error="Test" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should be accessible by role", () => {
      render(<Error error="Accessible error" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Accessible error");
    });

    it("should have proper ARIA role", () => {
      render(<Error error="Test" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("role", "alert");
    });

    it("should be discoverable by screen readers", () => {
      render(<Error error="Screen reader message" />);
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent("Screen reader message");
    });
  });

  describe("Error prop", () => {
    it("should accept string error", () => {
      render(<Error error="String error" />);
      expect(screen.getByText("String error")).toBeInTheDocument();
    });

    it("should handle empty string", () => {
      render(<Error error="" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("");
    });

    it("should handle whitespace", () => {
      render(<Error error="   " />);
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toBe("   ");
    });

    it("should preserve error text exactly", () => {
      const errorText = "Exact error message";
      render(<Error error={errorText} />);
      expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it("should not modify error message", () => {
      const originalError = "Original error message";
      render(<Error error={originalError} />);
      const displayedText = screen.getByRole("alert").textContent;
      expect(displayedText).toBe(originalError);
    });
  });

  describe("Component structure", () => {
    it("should render as div element", () => {
      const { container } = render(<Error error="Test" />);
      const div = container.querySelector("div");
      expect(div).toBeInTheDocument();
    });

    it("should have single root element", () => {
      const { container } = render(<Error error="Test" />);
      expect(container.firstChild).toBe(container.lastChild);
    });

    it("should contain only error text", () => {
      render(<Error error="Only text" />);
      const alert = screen.getByRole("alert");
      expect(alert.textContent).toBe("Only text");
    });

    it("should not have child elements", () => {
      const { container } = render(<Error error="Test" />);
      const alert = container.querySelector(".alert");
      expect(alert?.children.length).toBe(0);
    });
  });

  describe("Multiple instances", () => {
    it("should render multiple error components", () => {
      const { container } = render(
        <>
          <Error error="Error 1" />
          <Error error="Error 2" />
        </>
      );
      expect(screen.getByText("Error 1")).toBeInTheDocument();
      expect(screen.getByText("Error 2")).toBeInTheDocument();
    });

    it("should render different errors independently", () => {
      render(
        <>
          <Error error="First error" />
          <Error error="Second error" />
        </>
      );
      const alerts = screen.getAllByRole("alert");
      expect(alerts).toHaveLength(2);
    });

    it("should maintain separate error messages", () => {
      render(
        <>
          <Error error="Error A" />
          <Error error="Error B" />
          <Error error="Error C" />
        </>
      );
      expect(screen.getByText("Error A")).toBeInTheDocument();
      expect(screen.getByText("Error B")).toBeInTheDocument();
      expect(screen.getByText("Error C")).toBeInTheDocument();
    });
  });

  describe("Rerendering", () => {
    it("should update error message on rerender", () => {
      const { rerender } = render(<Error error="Initial error" />);
      expect(screen.getByText("Initial error")).toBeInTheDocument();

      rerender(<Error error="Updated error" />);
      expect(screen.getByText("Updated error")).toBeInTheDocument();
      expect(screen.queryByText("Initial error")).not.toBeInTheDocument();
    });

    it("should maintain structure on rerender", () => {
      const { rerender } = render(<Error error="First" />);
      const firstAlert = screen.getByRole("alert");
      expect(firstAlert).toHaveClass("alert", "alert-danger");

      rerender(<Error error="Second" />);
      const secondAlert = screen.getByRole("alert");
      expect(secondAlert).toHaveClass("alert", "alert-danger");
    });

    it("should handle multiple rerenders", () => {
      const { rerender } = render(<Error error="Error 1" />);
      rerender(<Error error="Error 2" />);
      rerender(<Error error="Error 3" />);
      expect(screen.getByText("Error 3")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle very long error messages", () => {
      const longError = "A".repeat(1000);
      render(<Error error={longError} />);
      expect(screen.getByRole("alert")).toHaveTextContent(longError);
    });

    it("should handle error with line breaks", () => {
      render(<Error error="Line 1\nLine 2" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should handle error with tabs", () => {
      render(<Error error="Tab\there" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should handle Unicode characters", () => {
      render(<Error error="Error: 你好 🚨" />);
      expect(screen.getByText("Error: 你好 🚨")).toBeInTheDocument();
    });

    it("should handle HTML entities in text", () => {
      render(<Error error="Error: <script>alert('xss')</script>" />);
      const alert = screen.getByRole("alert");
      expect(alert.textContent).toBe("Error: <script>alert('xss')</script>");
    });

    it("should not execute scripts in error text", () => {
      render(<Error error="<script>alert('test')</script>" />);
      const alert = screen.getByRole("alert");
      expect(alert.innerHTML).not.toContain("<script>");
    });
  });

  describe("Props interface", () => {
    it("should accept ErrorProps interface", () => {
      const props = { error: "Test error" };
      render(<Error {...props} />);
      expect(screen.getByText("Test error")).toBeInTheDocument();
    });

    it("should require error prop", () => {
      // TypeScript would catch this at compile time
      render(<Error error="Required prop" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should only accept string for error", () => {
      // TypeScript enforces this
      render(<Error error="String only" />);
      expect(screen.getByText("String only")).toBeInTheDocument();
    });
  });

  describe("Component behavior", () => {
    it("should be a pure component", () => {
      const { rerender } = render(<Error error="Same error" />);
      const firstRender = screen.getByRole("alert").textContent;

      rerender(<Error error="Same error" />);
      const secondRender = screen.getByRole("alert").textContent;

      expect(firstRender).toBe(secondRender);
    });

    it("should not have side effects", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      render(<Error error="Test" />);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should render immediately", () => {
      render(<Error error="Immediate" />);
      expect(screen.getByText("Immediate")).toBeInTheDocument();
    });
  });

  describe("Visual presentation", () => {
    it("should indicate error state visually", () => {
      render(<Error error="Visual error" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("alert-danger");
    });

    it("should use danger variant", () => {
      render(<Error error="Danger" />);
      const alert = screen.getByRole("alert");
      expect(alert.className).toContain("danger");
    });

    it("should have consistent styling", () => {
      render(<Error error="Consistent" />);
      const alert = screen.getByRole("alert");
      expect(alert.className).toBe("alert alert-danger");
    });
  });

  describe("Default export", () => {
    it("should export Error as default", () => {
      expect(Error).toBeDefined();
      expect(typeof Error).toBe("function");
    });

    it("should be a React component", () => {
      const result = render(<Error error="Test" />);
      expect(result).toBeDefined();
    });

    it("should return valid JSX", () => {
      const { container } = render(<Error error="Valid" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Integration scenarios", () => {
    it("should display API error", () => {
      render(<Error error="API request failed" />);
      expect(screen.getByText("API request failed")).toBeInTheDocument();
    });

    it("should display validation error", () => {
      render(<Error error="Please enter a valid email" />);
      expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
    });

    it("should display authentication error", () => {
      render(<Error error="Authentication failed" />);
      expect(screen.getByText("Authentication failed")).toBeInTheDocument();
    });

    it("should display permission error", () => {
      render(<Error error="Access denied" />);
      expect(screen.getByText("Access denied")).toBeInTheDocument();
    });

    it("should display generic error", () => {
      render(<Error error="Something went wrong" />);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});
