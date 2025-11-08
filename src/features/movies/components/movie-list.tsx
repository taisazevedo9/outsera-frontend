"use client";

import { MovieCard } from "./movie-card";

export function MovieList() {
  return (
    <>
      <MovieCard
        title="Movie List"
        colSize="col-12"
        showFilters={true}
        initialFilters={{ page: 0, size: 99 }}
      />
    </>
  );
}
