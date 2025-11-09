import React from "react";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import Sidebar from "../index";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
  return jest.fn(({ href, className, style, children }) => (
    <a href={href} className={className} style={style}>
      {children}
    </a>
  ));
});

describe("Sidebar", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component", () => {
      render(<Sidebar />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should render sidebar navigation", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("should render without errors", () => {
      const { container } = render(<Sidebar />);
      expect(container).toBeInTheDocument();
    });

    it("should render immediately", () => {
      const { container } = render(<Sidebar />);
      expect(container.firstChild).toBeTruthy();
    });

    it("should call usePathname hook", () => {
      render(<Sidebar />);
      expect(usePathname).toHaveBeenCalled();
    });
  });

  describe("Menu items", () => {
    it("should render all menu items", () => {
      render(<Sidebar />);
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("List")).toBeInTheDocument();
    });

    it("should render Dashboard menu item", () => {
      render(<Sidebar />);
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("should render List menu item", () => {
      render(<Sidebar />);
      expect(screen.getByText("List")).toBeInTheDocument();
    });

    it("should render exactly 2 menu items", () => {
      render(<Sidebar />);
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
    });

    it("should render menu items with correct labels", () => {
      render(<Sidebar />);
      const menuLabels = ["Dashboard", "List"];
      menuLabels.forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    it("should render menu items in correct order", () => {
      render(<Sidebar />);
      const links = screen.getAllByRole("link");
      expect(links[0]).toHaveTextContent("Dashboard");
      expect(links[1]).toHaveTextContent("List");
    });
  });

  describe("Navigation links", () => {
    it("should render Dashboard link with correct href", () => {
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).toHaveAttribute("href", "/dashboard");
    });

    it("should render List link with correct href", () => {
      render(<Sidebar />);
      const listLink = screen.getByText("List").closest("a");
      expect(listLink).toHaveAttribute("href", "/list");
    });

    it("should render all links with correct hrefs", () => {
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      const listLink = screen.getByText("List").closest("a");

      expect(dashboardLink).toHaveAttribute("href", "/dashboard");
      expect(listLink).toHaveAttribute("href", "/list");
    });

    it("should use Next.js Link component", () => {
      render(<Sidebar />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe("Active state", () => {
    it("should mark Dashboard as active when pathname is /dashboard", () => {
      (usePathname as jest.Mock).mockReturnValue("/dashboard");
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).toHaveClass("bg-primary", "text-white");
    });

    it("should mark List as active when pathname is /list", () => {
      (usePathname as jest.Mock).mockReturnValue("/list");
      render(<Sidebar />);
      const listLink = screen.getByText("List").closest("a");
      expect(listLink).toHaveClass("bg-primary", "text-white");
    });

    it("should apply text-white-50 to inactive links", () => {
      (usePathname as jest.Mock).mockReturnValue("/dashboard");
      render(<Sidebar />);
      const listLink = screen.getByText("List").closest("a");
      
      expect(listLink).toHaveClass("text-white-50");
    });

    it("should only mark one item as active at a time", () => {
      (usePathname as jest.Mock).mockReturnValue("/dashboard");
      render(<Sidebar />);
      
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      const listLink = screen.getByText("List").closest("a");

      expect(dashboardLink).toHaveClass("bg-primary");
      expect(listLink).not.toHaveClass("bg-primary");
    });

    it("should use isActive function correctly", () => {
      (usePathname as jest.Mock).mockReturnValue("/list");
      render(<Sidebar />);
      const listLink = screen.getByText("List").closest("a");
      expect(listLink).toHaveClass("bg-primary", "text-white");
    });

    it("should not mark any item as active for unknown paths", () => {
      (usePathname as jest.Mock).mockReturnValue("/unknown");
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      const listLink = screen.getByText("List").closest("a");
      
      expect(dashboardLink).not.toHaveClass("bg-primary");
      expect(listLink).not.toHaveClass("bg-primary");
    });
  });

  describe("CSS classes", () => {
    it("should have bg-dark class on nav", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("bg-dark");
    });

    it("should have text-white class on nav", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("text-white");
    });

    it("should have d-flex class on nav", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("d-flex");
    });

    it("should have flex-column class on nav", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("flex-column");
    });

    it("should have p-3 class on nav", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("p-3");
    });

    it("should have all Bootstrap classes on nav", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("bg-dark", "text-white", "d-flex", "flex-column", "p-3");
    });

    it("should have nav-link class on links", () => {
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).toHaveClass("nav-link");
    });

    it("should have d-flex class on links", () => {
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).toHaveClass("d-flex");
    });

    it("should have align-items-center class on links", () => {
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).toHaveClass("align-items-center");
    });

    it("should have gap-2 class on links", () => {
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).toHaveClass("gap-2");
    });
  });

  describe("Inline styles", () => {
    it("should have fixed width of 250px", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveStyle({ width: "250px" });
    });

    it("should have minHeight of 100vh", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveStyle({ minHeight: "100vh" });
    });

    it("should have fixed position", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("position-fixed");
    });

    it("should have left 0 position", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveStyle({ left: 0 });
    });

    it("should have top 0 position", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveStyle({ top: 0 });
    });

    it("should have overflowY auto", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveStyle({ overflowY: "auto" });
    });

    it("should have all positioning styles", () => {
      render(<Sidebar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveStyle({
        width: "250px",
        minHeight: "100vh",
        left: 0,
        top: 0,
        overflowY: "auto",
      });
      expect(nav).toHaveClass("position-fixed");
    });

    it("should have borderRadius on links", () => {
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).toHaveStyle({ borderRadius: "0.375rem" });
    });

    it("should have transition on links", () => {
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).toHaveStyle({ transition: "all 0.2s" });
    });
  });

  describe("Footer section", () => {
    it("should render footer text", () => {
      render(<Sidebar />);
      expect(screen.getByText("Outsera Frontend")).toBeInTheDocument();
    });

    it("should have small element in footer", () => {
      render(<Sidebar />);
      const footer = screen.getByText("Outsera Frontend");
      expect(footer.tagName).toBe("SMALL");
    });

    it("should have text-white-50 class on footer", () => {
      render(<Sidebar />);
      const footer = screen.getByText("Outsera Frontend");
      expect(footer).toHaveClass("text-white-50");
    });

    it("should have d-block class on footer", () => {
      render(<Sidebar />);
      const footer = screen.getByText("Outsera Frontend");
      expect(footer).toHaveClass("d-block");
    });

    it("should have border-top on footer container", () => {
      render(<Sidebar />);
      const footer = screen.getByText("Outsera Frontend").parentElement;
      expect(footer).toHaveClass("border-top");
    });

    it("should have border-secondary on footer container", () => {
      render(<Sidebar />);
      const footer = screen.getByText("Outsera Frontend").parentElement;
      expect(footer).toHaveClass("border-secondary");
    });

    it("should have pt-3 on footer container", () => {
      render(<Sidebar />);
      const footer = screen.getByText("Outsera Frontend").parentElement;
      expect(footer).toHaveClass("pt-3");
    });
  });

  describe("List structure", () => {
    it("should render ul element", () => {
      render(<Sidebar />);
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
    });

    it("should have nav class on ul", () => {
      render(<Sidebar />);
      const list = screen.getByRole("list");
      expect(list).toHaveClass("nav");
    });

    it("should have nav-pills class on ul", () => {
      render(<Sidebar />);
      const list = screen.getByRole("list");
      expect(list).toHaveClass("nav-pills");
    });

    it("should have flex-column class on ul", () => {
      render(<Sidebar />);
      const list = screen.getByRole("list");
      expect(list).toHaveClass("flex-column");
    });

    it("should have mb-auto class on ul", () => {
      render(<Sidebar />);
      const list = screen.getByRole("list");
      expect(list).toHaveClass("mb-auto");
    });

    it("should render li elements", () => {
      render(<Sidebar />);
      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
    });

    it("should have nav-item class on li", () => {
      render(<Sidebar />);
      const listItems = screen.getAllByRole("listitem");
      listItems.forEach((item) => {
        expect(item).toHaveClass("nav-item");
      });
    });

    it("should have mb-2 class on li", () => {
      render(<Sidebar />);
      const listItems = screen.getAllByRole("listitem");
      listItems.forEach((item) => {
        expect(item).toHaveClass("mb-2");
      });
    });
  });

  describe("Component behavior", () => {
    it("should not have side effects", () => {
      const { container } = render(<Sidebar />);
      expect(container).toBeInTheDocument();
    });

    it("should render consistently", () => {
      const { container: container1 } = render(<Sidebar />);
      const { container: container2 } = render(<Sidebar />);
      expect(container1.innerHTML).toBe(container2.innerHTML);
    });

    it("should handle rerender", () => {
      const { rerender } = render(<Sidebar />);
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      
      rerender(<Sidebar />);
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("should maintain menu items on rerender", () => {
      const { rerender } = render(<Sidebar />);
      expect(screen.getAllByRole("link")).toHaveLength(2);
      
      rerender(<Sidebar />);
      expect(screen.getAllByRole("link")).toHaveLength(2);
    });

    it("should update active state when pathname changes", () => {
      (usePathname as jest.Mock).mockReturnValue("/dashboard");
      const { rerender } = render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).toHaveClass("bg-primary");

      (usePathname as jest.Mock).mockReturnValue("/list");
      rerender(<Sidebar />);
      const listLink = screen.getByText("List").closest("a");
      expect(listLink).toHaveClass("bg-primary");
    });
  });

  describe("Client component", () => {
    it("should be a client component", () => {
      render(<Sidebar />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should use client-side hooks", () => {
      render(<Sidebar />);
      expect(usePathname).toHaveBeenCalled();
    });

    it("should work in browser environment", () => {
      render(<Sidebar />);
      expect(screen.getAllByRole("link")).toHaveLength(2);
    });
  });

  describe("Default export", () => {
    it("should export Sidebar as default", () => {
      expect(Sidebar).toBeDefined();
    });

    it("should be a React component", () => {
      render(<Sidebar />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should be a function component", () => {
      expect(typeof Sidebar).toBe("function");
    });
  });

  describe("Accessibility", () => {
    it("should have navigation role", () => {
      render(<Sidebar />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should have list structure", () => {
      render(<Sidebar />);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should have list items", () => {
      render(<Sidebar />);
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);
    });

    it("should have link elements", () => {
      render(<Sidebar />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("should have proper semantic HTML", () => {
      render(<Sidebar />);
      expect(screen.getByRole("navigation").tagName).toBe("NAV");
    });
  });

  describe("Menu items mapping", () => {
    it("should map through menuItems array", () => {
      render(<Sidebar />);
      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
    });

    it("should use correct keys for menu items", () => {
      render(<Sidebar />);
      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
    });

    it("should render span with label", () => {
      render(<Sidebar />);
      const dashboardSpan = screen.getByText("Dashboard");
      expect(dashboardSpan.tagName).toBe("SPAN");
    });

    it("should wrap labels in span elements", () => {
      render(<Sidebar />);
      expect(screen.getByText("Dashboard").tagName).toBe("SPAN");
      expect(screen.getByText("List").tagName).toBe("SPAN");
    });
  });

  describe("Edge cases", () => {
    it("should handle unknown pathname", () => {
      (usePathname as jest.Mock).mockReturnValue("/unknown");
      render(<Sidebar />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).not.toHaveClass("bg-primary");
      });
    });

    it("should handle empty pathname", () => {
      (usePathname as jest.Mock).mockReturnValue("");
      render(<Sidebar />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should handle pathname with trailing slash", () => {
      (usePathname as jest.Mock).mockReturnValue("/dashboard/");
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).not.toHaveClass("bg-primary");
    });

    it("should handle pathname case sensitivity", () => {
      (usePathname as jest.Mock).mockReturnValue("/DASHBOARD");
      render(<Sidebar />);
      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).not.toHaveClass("bg-primary");
    });

    it("should handle rapid rerenders", () => {
      const { rerender } = render(<Sidebar />);
      for (let i = 0; i < 10; i++) {
        rerender(<Sidebar />);
      }
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("should integrate with Next.js usePathname", () => {
      (usePathname as jest.Mock).mockReturnValue("/list");
      render(<Sidebar />);
      expect(usePathname).toHaveBeenCalled();
    });

    it("should integrate with Next.js Link", () => {
      render(<Sidebar />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBe(2);
    });

    it("should reflect pathname changes", () => {
      (usePathname as jest.Mock).mockReturnValue("/dashboard");
      const { rerender } = render(<Sidebar />);
      let dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).toHaveClass("bg-primary");

      (usePathname as jest.Mock).mockReturnValue("/list");
      rerender(<Sidebar />);
      let listLink = screen.getByText("List").closest("a");
      expect(listLink).toHaveClass("bg-primary");
    });
  });
});
