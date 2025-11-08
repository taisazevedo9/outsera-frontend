"use client";

import { useState, useEffect } from "react";
import Card from "@/shared/components/ui/card";
import SimpleTable, { Column } from "@/shared/components/ui/simple-table";
import { useMoviesPreview } from "../hooks/use-movies-preview";
import { Movie } from "../types";

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
];

interface MoviesPreviewProps {
  colSize?: string;
}

export function MoviesPreview({ colSize = "col-md-6" }: MoviesPreviewProps) {
  const [yearInput, setYearInput] = useState<string>("");
  const [searchYear, setSearchYear] = useState<number | undefined>(undefined);
  const [shouldSearch, setShouldSearch] = useState(false);
  const { movies, loading, error, refetch } = useMoviesPreview(searchYear);

  useEffect(() => {
    if (shouldSearch) {
      refetch();
      setShouldSearch(false);
    }
  }, [searchYear, shouldSearch, refetch]);

  const handleSearch = () => {
    const year = yearInput ? parseInt(yearInput, 10) : undefined;
    setSearchYear(year);
    setShouldSearch(true);
  };

  return (
    <Card
      title="List movie winners by year"
      colSize={colSize}
      loading={loading}
      error={error}
    >
      <div className="mb-3">
        <div className="row g-2">
          <div className="col-md-10">
            <input
              type="number"
              className="form-control"
              placeholder="Search by year"
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
              min="1900"
              max="2100"
            />
          </div>
          <div className="col-auto">
            <button
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              <i className="bi bi-search me-1"></i>
              Search
            </button>
          </div>
        </div>
      </div>

      <SimpleTable
        data={movies}
        columns={movieColumns}
        showFilters={false}
        itemsPerPage={15}
        showPagination={false}
      />
    </Card>
  );
}
