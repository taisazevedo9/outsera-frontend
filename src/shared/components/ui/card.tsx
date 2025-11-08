import React from "react";
import CardTitle from "./card-title";
import CardLoading from "./card-loading";
import CardError from "../alert/error";

interface CardProps {
  title?: string;
  colSize?: string;
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
}

export function Card({
  title,
  colSize = "col-md-6",
  loading = false,
  error = null,
  children,
  className = "",
}: CardProps) {
  return (
    <div className={`${colSize} mb-3 ${className}`}>
      <div className="card h-100">
        <div className="card-body">
          {title && <CardTitle title={title} />}

          {loading && <CardLoading />}

          {error && !loading && <CardError error={error} />}

          {!loading && !error && children}
        </div>
      </div>
    </div>
  );
}

export default Card;
