"use client";

import { YearWinners } from "./year-winners";
import { StudioStats } from "./studio-stats";
import { ProducerInterval } from "./producer-interval";
import { MoviesPreview } from "./movies-preview";

export function DashboardStats() {
  return (
    <>
      <YearWinners colSize="col-md-6" />
      <StudioStats colSize="col-md-6" limit={3} />
      <ProducerInterval colSize="col-md-6" />
      <MoviesPreview colSize="col-md-6" />
    </>
  );
}

export default DashboardStats;
