"use client";

import Card from "@/shared/components/ui/card";
import SimpleTable, { Column } from "@/shared/components/ui/simple-table";
import { useYearWinners } from "../hooks/use-year-winners";
import { YearWithMultipleWinners } from "../types";

const yearColumns: Column<YearWithMultipleWinners>[] = [
  {
    key: "year",
    label: "Year",
    sortable: true,
    filterable: false,
  },
  {
    key: "winnerCount",
    label: "Win Count",
    sortable: true,
    filterable: false,
  },
];

interface YearWinnersProps {
  colSize?: string;
}

export function YearWinners({ colSize = "col-md-6" }: YearWinnersProps) {
  const { years, loading, error } = useYearWinners();

  return (
    <Card
      title="List years with multiple winners"
      colSize={colSize}
      loading={loading}
      error={error}
    >
      <SimpleTable
        data={years}
        columns={yearColumns}
        showFilters={false}
        itemsPerPage={10}
        showPagination={false}
      />
    </Card>
  );
}
