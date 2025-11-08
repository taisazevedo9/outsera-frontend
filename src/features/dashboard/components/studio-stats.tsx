"use client";

import Card from "@/shared/components/ui/card";
import SimpleTable, { Column } from "@/shared/components/ui/simple-table";
import { useStudioStats } from "../hooks/use-studio-stats";
import { StudioCountPerWin } from "../types";

const studioColumns: Column<StudioCountPerWin>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    filterable: false,
  },
  {
    key: "winCount",
    label: "Win Count",
    sortable: true,
    filterable: false,
  },
];

interface StudioStatsProps {
  colSize?: string;
  limit?: number;
}

export function StudioStats({
  colSize = "col-md-6",
  limit = 3,
}: StudioStatsProps) {
  const { studios, loading, error } = useStudioStats(limit);

  return (
    <Card
      title="Top 3 studios with winners"
      colSize={colSize}
      loading={loading}
      error={error}
    >
      <SimpleTable
        data={studios}
        columns={studioColumns}
        showFilters={false}
        itemsPerPage={limit}
        showPagination={false}
      />
    </Card>
  );
}
