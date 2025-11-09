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
    <main
      style={{
        marginLeft: "0",
        transition: "margin-left 0.3s ease-in-out",
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        className="w-100 py-3 py-md-4 px-2 px-sm-3 px-md-4"
        style={{
          maxWidth: "100%",
        }}
      >
        <style jsx>{`
          main {
            min-height: 100vh;
            margin-left: 30px;
            width: calc(100% - 30px);
            padding-top: 60px;
          }
          
          @media (min-width: 768px) {
            main {
              margin-left: 250px;
              width: calc(100% - 250px);
              padding-top: 0;
            }
          }
          
          @media (max-width: 576px) {
            main {
              padding-top: 55px;
            }
          }
        `}</style>
        <CardContent>
          <PageTitle title={title} />
          <PageContent>{children}</PageContent>
        </CardContent>
      </div>
    </main>
  );
}
