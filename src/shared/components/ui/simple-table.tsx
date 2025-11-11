"use client";

import { useState, useMemo } from "react";
import CardTitle from "./card-title";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

interface SimpleTableProps<T> {
  data: T[];
  columns: Column<T>[];
  showFilters?: boolean;
  itemsPerPage?: number;
  showPagination?: boolean;
  title?: string;
  // Props for remote pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function SimpleTable<T extends Record<string, any>>({
  data,
  columns,
  showFilters = false,
  itemsPerPage = 10,
  showPagination = true,
  title,
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  onPageChange,
}: SimpleTableProps<T>) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Use external pagination if provided, otherwise use internal
  const isRemotePagination = onPageChange !== undefined;
  const currentPage = isRemotePagination ? (externalCurrentPage || 0) + 1 : internalCurrentPage;
  const setCurrentPage = isRemotePagination
    ? (page: number | ((prev: number) => number)) => {
        const newPage = typeof page === "function" ? page(currentPage) : page;
        onPageChange?.(newPage - 1);
      }
    : setInternalCurrentPage;

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  const formatCellValue = (value: any): string => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (value === null || value === undefined) {
      return "";
    }
    return String(value);
  };

  const sortedData = useMemo(() => {
    if (!sortConfig || isRemotePagination) return data;

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig, isRemotePagination]);

  const totalPages = isRemotePagination
    ? externalTotalPages || 1
    : Math.ceil(sortedData.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    if (!showPagination || isRemotePagination) return sortedData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, showPagination, isRemotePagination]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  return (
    <div>
      <div className="table-responsive">
        {title && <CardTitle title={title} />}
        <table className="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  onClick={() =>
                    column.sortable && handleSort(String(column.key))
                  }
                  style={{
                    cursor: column.sortable ? "pointer" : "default",
                    userSelect: "none",
                  }}
                >
                  {column.label}
                  {sortConfig?.key === column.key && (
                    <span className="ms-1">
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={String(column.key)}>
                      {formatCellValue(getNestedValue(row, String(column.key)))}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <nav aria-label="Table pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {showPagination && (
        <div className="text-center text-muted small">
          Showing {paginatedData.length} of {sortedData.length} results
        </div>
      )}
    </div>
  );
}
