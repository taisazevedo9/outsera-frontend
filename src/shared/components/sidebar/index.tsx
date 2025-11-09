"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/list", label: "List" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="btn btn-dark d-md-none position-fixed"
        onClick={toggleMenu}
        style={{
          top: "10px",
          left: "10px",
          zIndex: 1050,
          borderRadius: "0.375rem",
        }}
        aria-label="Toggle menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="d-md-none position-fixed w-100 h-100 bg-dark"
          onClick={closeMenu}
          style={{
            top: 0,
            left: 0,
            zIndex: 1040,
            opacity: 0.5,
          }}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`bg-dark text-white d-flex flex-column p-3 ${
          isOpen ? "d-flex" : "d-none"
        } d-md-flex position-fixed`}
        style={{
          width: "250px",
          minHeight: "100vh",
          left: 0,
          top: 0,
          overflowY: "auto",
          zIndex: 1045,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <ul className="nav nav-pills flex-column mb-auto mt-5 mt-md-0">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item mb-2">
              <Link
                href={item.path}
                onClick={closeMenu}
                className={`nav-link d-flex align-items-center gap-2 ${
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-white-50"
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
    </>
  );
}
