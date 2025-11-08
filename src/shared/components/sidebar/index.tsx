"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/list", label: "List" },
  ];

  return (
    <nav
      className="bg-dark text-white d-flex flex-column p-3"
      style={{
        width: "250px",
        minHeight: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
      }}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item) => (
          <li key={item.path} className="nav-item mb-2">
            <Link
              href={item.path}
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive(item.path) ? "bg-primary text-white" : "text-white-50"
              }`}
              style={{
                borderRadius: "0.375rem",
                transition: "all 0.2s",
              }}
            >
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="pt-3 border-top border-secondary">
        <small className="text-white-50 d-block">Outsera Frontend</small>
      </div>
    </nav>
  );
}
