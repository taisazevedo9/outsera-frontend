import { MovieList } from "@/features/movies";
import { PageLayout } from "@/shared/components/layout";

export default function ListPage() {
  return (
    <PageLayout title="List">
      <MovieList />
    </PageLayout>
  );
}
