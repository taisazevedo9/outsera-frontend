"use client";

import Card from "@/shared/components/ui/card";
import SimpleTable, { Column } from "@/shared/components/ui/simple-table";
import { useProducerInterval } from "../hooks/use-producer-interval";
import { ProducerWithInterval } from "../types";

const producerColumns: Column<ProducerWithInterval>[] = [
  {
    key: "producer",
    label: "Producer",
    sortable: true,
    filterable: false,
  },
  {
    key: "interval",
    label: "Interval",
    sortable: true,
    filterable: false,
  },
  {
    key: "previousWin",
    label: "Previous Year",
    sortable: true,
    filterable: false,
  },
  {
    key: "followingWin",
    label: "Following Year",
    sortable: true,
    filterable: false,
  },
];

interface ProducerIntervalProps {
  colSize?: string;
}

export function ProducerInterval({
  colSize = "col-md-6",
}: ProducerIntervalProps) {
  const { producers, loading, error } = useProducerInterval();

  return (
    <Card
      title="Producers with longest and shortest interval between wins"
      colSize={colSize}
      loading={loading}
      error={error}
    >
      <SimpleTable
        data={producers}
        columns={producerColumns}
        showFilters={false}
        itemsPerPage={10}
        showPagination={false}
      />
    </Card>
  );
}
