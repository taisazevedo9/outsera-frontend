"use client";

import PageTitle from "../page-title";
import PageContent from "../page-content";
import { CardContent } from "../ui/content";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <main>
      <div className="container py-5">
        <CardContent>
          <PageTitle title={title} />
          <PageContent>{children}</PageContent>
        </CardContent>
      </div>
    </main>
  );
}
