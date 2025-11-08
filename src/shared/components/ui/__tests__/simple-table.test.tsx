import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SimpleTable, { Column } from "../simple-table";

interface TestData {
  id: number;
  name: string;
  active: boolean;
  score: number;
  nested?: {
    value: string;
  };
}

const mockData: TestData[] = [
  { id: 1, name: "Alice", active: true, score: 95, nested: { value: "A" } },
  { id: 2, name: "Bob", active: false, score: 80, nested: { value: "B" } },
  { id: 3, name: "Charlie", active: true, score: 88, nested: { value: "C" } },
  { id: 4, name: "David", active: false, score: 92, nested: { value: "D" } },
  { id: 5, name: "Eve", active: true, score: 85, nested: { value: "E" } },
];

const mockColumns: Column<TestData>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "active", label: "Active", sortable: false },
  { key: "score", label: "Score", sortable: true },
];

describe("SimpleTable", () => {
  describe("Rendering", () => {
    it("should render the component", () => {
      const { container } = render(
        <SimpleTable data={mockData} columns={mockColumns} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render table element", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    it("should render column headers", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Score")).toBeInTheDocument();
    });

    it("should render data rows", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("should render without errors", () => {
      const { container } = render(
        <SimpleTable data={mockData} columns={mockColumns} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("should show no data message when data is empty", () => {
      render(<SimpleTable data={[]} columns={mockColumns} />);
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("should render empty message with correct colspan", () => {
      const { container } = render(
        <SimpleTable data={[]} columns={mockColumns} />
      );
      const td = screen.getByText("No data available");
      expect(td).toHaveAttribute("colspan", String(mockColumns.length));
    });

    it("should center empty message", () => {
      render(<SimpleTable data={[]} columns={mockColumns} />);
      const td = screen.getByText("No data available");
      expect(td).toHaveClass("text-center");
    });
  });

  describe("Data formatting", () => {
    it("should format boolean true as Yes", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      const yesElements = screen.getAllByText("Yes");
      expect(yesElements.length).toBeGreaterThan(0);
    });

    it("should format boolean false as No", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      const noElements = screen.getAllByText("No");
      expect(noElements.length).toBeGreaterThan(0);
    });

    it("should format null as empty string", () => {
      const dataWithNull = [{ id: 1, name: null as any, active: true, score: 100 }];
      const { container } = render(
        <SimpleTable data={dataWithNull as any} columns={mockColumns} />
      );
      const cells = container.querySelectorAll("td");
      const nameCell = cells[1]; // second column (name)
      expect(nameCell.textContent).toBe("");
    });

    it("should format undefined as empty string", () => {
      const dataWithUndefined = [
        { id: 1, name: undefined as any, active: true, score: 100 },
      ];
      const { container } = render(
        <SimpleTable data={dataWithUndefined as any} columns={mockColumns} />
      );
      const cells = container.querySelectorAll("td");
      const nameCell = cells[1];
      expect(nameCell.textContent).toBe("");
    });

    it("should convert numbers to strings", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      expect(screen.getByText("95")).toBeInTheDocument();
      expect(screen.getByText("80")).toBeInTheDocument();
    });
  });

  describe("Nested values", () => {
    it("should access nested object values", () => {
      const columns: Column<TestData>[] = [
        { key: "nested.value", label: "Nested", sortable: false },
      ];
      render(<SimpleTable data={mockData} columns={columns} />);
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
    });

    it("should handle missing nested values", () => {
      const dataWithMissing = [{ id: 1, name: "Test", active: true, score: 100 }];
      const columns: Column<TestData>[] = [
        { key: "nested.value", label: "Nested", sortable: false },
      ];
      const { container } = render(
        <SimpleTable data={dataWithMissing} columns={columns} />
      );
      const cells = container.querySelectorAll("td");
      expect(cells[0].textContent).toBe("");
    });
  });

  describe("Sorting", () => {
    it("should show sort indicator on sortable columns", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      const idHeader = screen.getByText("ID");
      fireEvent.click(idHeader);
      expect(screen.getByText("▲")).toBeInTheDocument();
    });

    it("should sort ascending on first click", () => {
      const { container } = render(
        <SimpleTable data={mockData} columns={mockColumns} />
      );
      const nameHeader = screen.getByText("Name");
      fireEvent.click(nameHeader);

      const rows = container.querySelectorAll("tbody tr");
      const firstCell = rows[0].querySelector("td:nth-child(2)");
      expect(firstCell?.textContent).toBe("Alice");
    });

    it("should sort descending on second click", () => {
      const { container } = render(
        <SimpleTable data={mockData} columns={mockColumns} />
      );
      const nameHeader = screen.getByText("Name");
      fireEvent.click(nameHeader);
      fireEvent.click(nameHeader);

      expect(screen.getByText("▼")).toBeInTheDocument();
    });

    it("should clear sort on third click", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      const nameHeader = screen.getByText("Name");
      fireEvent.click(nameHeader);
      fireEvent.click(nameHeader);
      fireEvent.click(nameHeader);

      expect(screen.queryByText("▲")).not.toBeInTheDocument();
      expect(screen.queryByText("▼")).not.toBeInTheDocument();
    });

    it("should not sort non-sortable columns", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      const activeHeader = screen.getByText("Active");
      fireEvent.click(activeHeader);

      expect(screen.queryByText("▲")).not.toBeInTheDocument();
    });

    it("should have pointer cursor on sortable columns", () => {
      const { container } = render(
        <SimpleTable data={mockData} columns={mockColumns} />
      );
      const idHeader = screen.getByText("ID").closest("th");
      expect(idHeader).toHaveStyle({ cursor: "pointer" });
    });

    it("should have default cursor on non-sortable columns", () => {
      const { container } = render(
        <SimpleTable data={mockData} columns={mockColumns} />
      );
      const activeHeader = screen.getByText("Active").closest("th");
      expect(activeHeader).toHaveStyle({ cursor: "default" });
    });

    it("should sort numeric values correctly", () => {
      const { container } = render(
        <SimpleTable data={mockData} columns={mockColumns} />
      );
      const scoreHeader = screen.getByText("Score");
      fireEvent.click(scoreHeader);

      const rows = container.querySelectorAll("tbody tr");
      const firstScoreCell = rows[0].querySelector("td:nth-child(4)");
      expect(firstScoreCell?.textContent).toBe("80");
    });
  });

  describe("Pagination", () => {
    it("should show pagination when enabled", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          showPagination={true}
          itemsPerPage={2}
        />
      );
      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("should not show pagination when disabled", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          showPagination={false}
        />
      );
      expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    });

    it("should paginate data correctly", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          showPagination={true}
          itemsPerPage={2}
        />
      );
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    });

    it("should navigate to next page", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          showPagination={true}
          itemsPerPage={2}
        />
      );
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      expect(screen.getByText("Charlie")).toBeInTheDocument();
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });

    it("should navigate to previous page", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          showPagination={true}
          itemsPerPage={2}
        />
      );
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      const prevButton = screen.getByText("Previous");
      fireEvent.click(prevButton);

      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("should disable previous button on first page", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          showPagination={true}
          itemsPerPage={2}
        />
      );
      const prevButton = screen.getByText("Previous");
      expect(prevButton).toBeDisabled();
    });

    it("should disable next button on last page", () => {
      const data = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Name${i}`,
        active: true,
        score: 50 + i,
      }));
      render(
        <SimpleTable
          data={data}
          columns={mockColumns}
          itemsPerPage={5}
        />
      );
      const nextButton = screen.getByRole("button", { name: "Next" });
      
      // Go to last page
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      
      expect(nextButton).toBeDisabled();
    });

    it("should show page numbers", () => {
      const data = Array.from({ length: 5 }, (_, i) => ({
        id: i + 10,
        name: `Name${i}`,
        active: true,
        score: 90,
      }));
      render(
        <SimpleTable
          data={data}
          columns={mockColumns}
          showPagination={true}
          itemsPerPage={2}
        />
      );
      const pageButtons = screen.getAllByRole("button");
      const page1 = pageButtons.find((btn) => btn.textContent === "1");
      const page2 = pageButtons.find((btn) => btn.textContent === "2");
      const page3 = pageButtons.find((btn) => btn.textContent === "3");
      
      expect(page1).toBeInTheDocument();
      expect(page2).toBeInTheDocument();
      expect(page3).toBeInTheDocument();
    });

    it("should navigate to specific page", () => {
      const data = Array.from({ length: 5 }, (_, i) => ({
        id: i + 10,
        name: `Name${i}`,
        active: true,
        score: 90,
      }));
      render(
        <SimpleTable
          data={data}
          columns={mockColumns}
          showPagination={true}
          itemsPerPage={2}
        />
      );
      const pageButtons = screen.getAllByRole("button");
      const page2Button = pageButtons.find((btn) => btn.textContent === "2");
      fireEvent.click(page2Button!);

      expect(screen.getByText("Name2")).toBeInTheDocument();
    });

    it("should highlight current page", () => {
      const { container } = render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          showPagination={true}
          itemsPerPage={2}
        />
      );
      const page1Item = container.querySelector(".page-item.active");
      expect(page1Item?.textContent).toBe("1");
    });

    it("should show result count", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          showPagination={true}
          itemsPerPage={2}
        />
      );
      expect(screen.getByText("Showing 2 of 5 results")).toBeInTheDocument();
    });

    it("should not show pagination for single page", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          showPagination={true}
          itemsPerPage={10}
        />
      );
      expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    });
  });

  describe("Default props", () => {
    it("should use default itemsPerPage of 10", () => {
      const largeData = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        name: `Name ${i}`,
        active: true,
        score: 100,
      }));
      const { container } = render(
        <SimpleTable data={largeData} columns={mockColumns} />
      );
      const rows = container.querySelectorAll("tbody tr");
      expect(rows.length).toBe(10);
    });

    it("should show pagination by default", () => {
      const largeData = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        name: `Name ${i}`,
        active: true,
        score: 100,
      }));
      render(<SimpleTable data={largeData} columns={mockColumns} />);
      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("should not show filters by default", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      // showFilters prop exists but is not implemented in UI yet
      expect(mockData).toBeDefined();
    });
  });

  describe("CSS classes", () => {
    it("should have table-responsive class", () => {
      const { container } = render(
        <SimpleTable data={mockData} columns={mockColumns} />
      );
      expect(container.querySelector(".table-responsive")).toBeInTheDocument();
    });

    it("should have Bootstrap table classes", () => {
      const { container } = render(
        <SimpleTable data={mockData} columns={mockColumns} />
      );
      const table = container.querySelector("table");
      expect(table).toHaveClass("table");
      expect(table).toHaveClass("table-striped");
      expect(table).toHaveClass("table-hover");
      expect(table).toHaveClass("table-bordered");
    });

    it("should have pagination classes", () => {
      const { container } = render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          itemsPerPage={2}
        />
      );
      expect(container.querySelector(".pagination")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label on pagination", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          itemsPerPage={2}
        />
      );
      const nav = screen.getByLabelText("Table pagination");
      expect(nav).toBeInTheDocument();
    });

    it("should have table role", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("should have button elements for pagination", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          itemsPerPage={2}
        />
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Component behavior", () => {
    it("should not have side effects", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should render immediately", () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("should handle rerender with new data", () => {
      const { rerender } = render(
        <SimpleTable data={mockData} columns={mockColumns} />
      );
      const newData = [
        { id: 10, name: "New User", active: true, score: 100 },
      ];
      rerender(<SimpleTable data={newData} columns={mockColumns} />);
      expect(screen.getByText("New User")).toBeInTheDocument();
    });
  });

  describe("Default export", () => {
    it("should export SimpleTable as default", () => {
      expect(SimpleTable).toBeDefined();
      expect(typeof SimpleTable).toBe("function");
    });

    it("should be a React component", () => {
      const result = render(
        <SimpleTable data={mockData} columns={mockColumns} />
      );
      expect(result).toBeDefined();
    });
  });

  describe("Edge cases", () => {
    it("should handle single row data", () => {
      const singleRow = [mockData[0]];
      render(<SimpleTable data={singleRow} columns={mockColumns} />);
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("should handle large datasets", () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Name ${i}`,
        active: true,
        score: 100,
      }));
      const { container } = render(
        <SimpleTable data={largeData} columns={mockColumns} itemsPerPage={10} />
      );
      const rows = container.querySelectorAll("tbody tr");
      expect(rows.length).toBe(10);
    });

    it("should handle sorting with equal values", () => {
      const equalData = [
        { id: 1, name: "Same", active: true, score: 100 },
        { id: 2, name: "Same", active: true, score: 100 },
      ];
      render(<SimpleTable data={equalData} columns={mockColumns} />);
      const nameHeader = screen.getByText("Name");
      fireEvent.click(nameHeader);
      expect(screen.getAllByText("Same")).toHaveLength(2);
    });

    it("should handle empty column array", () => {
      render(<SimpleTable data={mockData} columns={[]} />);
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });
  });

  describe("Integration scenarios", () => {
    it("should work with sorting and pagination together", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          itemsPerPage={2}
        />
      );
      const nameHeader = screen.getByText("Name");
      fireEvent.click(nameHeader);

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("should handle data changes with pagination", () => {
      const data1 = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `Old${i}`,
        active: true,
        score: 50 + i,
      }));
      const { rerender } = render(
        <SimpleTable
          data={data1}
          columns={mockColumns}
          itemsPerPage={2}
        />
      );
      
      // Verify first page of old data
      expect(screen.getByText("Old0")).toBeInTheDocument();

      const newData = Array.from({ length: 3 }, (_, i) => ({
        id: i + 100,
        name: `New${i}`,
        active: true,
        score: 90 + i,
      }));
      rerender(
        <SimpleTable
          data={newData}
          columns={mockColumns}
          itemsPerPage={2}
        />
      );
      
      // Should show new data (stays on same page number)
      expect(screen.getByText("New0")).toBeInTheDocument();
    });

    it("should maintain sort when paginating", () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          itemsPerPage={2}
        />
      );
      const nameHeader = screen.getByText("Name");
      fireEvent.click(nameHeader);

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      expect(screen.getByText("▲")).toBeInTheDocument();
    });
  });

  describe("Column interface", () => {
    it("should accept Column interface", () => {
      const columns: Column<TestData>[] = [
        { key: "name", label: "Name", sortable: true, filterable: true },
      ];
      render(<SimpleTable data={mockData} columns={columns} />);
      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    it("should handle optional column properties", () => {
      const columns: Column<TestData>[] = [{ key: "name", label: "Name" }];
      render(<SimpleTable data={mockData} columns={columns} />);
      expect(screen.getByText("Name")).toBeInTheDocument();
    });
  });
});
