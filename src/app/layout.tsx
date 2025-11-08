import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Sidebar from "@/shared/components/sidebar";

export const metadata = {
  title: "Movie Dashboard",
  description: "Outsera Front-end test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <div className="d-flex">
          <Sidebar />
          <main
            style={{
              marginLeft: "250px",
              width: "calc(100% - 250px)",
              minHeight: "100vh",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
