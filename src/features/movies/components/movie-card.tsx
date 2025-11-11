"use client";

import { useState, useEffect } from "react";
import Card from "@/shared/components/ui/card";
import SimpleTable, { Column } from "@/shared/components/ui/simple-table";
import { useMovies } from "../hooks/use-movies";
import { Movie } from "@/features/dashboard/types";

interface MovieCardProps {
  title: string;
  colSize?: string;
  showFilters?: boolean;
  itemsPerPage?: number;
  initialFilters?: {
    page?: number;
    size?: number;
    year?: number;
    winner?: boolean;
  };
}

const movieColumns: Column<Movie>[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    filterable: false,
  },
  {
    key: "year",
    label: "Year",
    sortable: true,
    filterable: false,
  },
  {
    key: "title",
    label: "Title",
    sortable: true,
    filterable: false,
  },
  {
    key: "winner",
    label: "Winner?",
    sortable: true,
    filterable: false,
  },
];

export function MovieCard({
  title,
  colSize,
  showFilters = false,
  itemsPerPage = 15,
  initialFilters,
}: MovieCardProps) {
  const [yearFilter, setYearFilter] = useState<string>("");
  const [winnerFilter, setWinnerFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(initialFilters?.page || 0);
  const [appliedFilters, setAppliedFilters] = useState({
    ...initialFilters,
    page: initialFilters?.page || 0,
    size: initialFilters?.size || itemsPerPage,
  });
  const { movies, totalPages, loading, error, refetch } = useMovies(appliedFilters);

  useEffect(() => {
    refetch();
  }, [appliedFilters, refetch]);

  const handleApplyFilters = () => {
    const filters: any = {
      page: 0,
      size: initialFilters?.size || itemsPerPage,
    };

    if (yearFilter) {
      filters.year = parseInt(yearFilter, 10);
    }

    if (winnerFilter) {
      filters.winner = winnerFilter === "true";
    }

    setCurrentPage(0);
    setAppliedFilters(filters);
  };

  const handleClearFilters = () => {
    setYearFilter("");
    setWinnerFilter("");
    setCurrentPage(0);
    setAppliedFilters({
      page: 0,
      size: initialFilters?.size || itemsPerPage,
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setAppliedFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <Card title={title} colSize={colSize} loading={loading} error={error}>
      {showFilters && (
        <div className="mb-3">
          <div className="row g-2">
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Filter by year"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                min="1900"
                max="2100"
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={winnerFilter}
                onChange={(e) => setWinnerFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-primary"
                onClick={handleApplyFilters}
                disabled={loading}
              >
                <i className="bi bi-search me-1"></i>
                Filter
              </button>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-secondary"
                onClick={handleClearFilters}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-1"></i>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <SimpleTable
        data={movies}
        columns={movieColumns}
        showFilters={false}
        itemsPerPage={itemsPerPage}
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Card>
  );
}
