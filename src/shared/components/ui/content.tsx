import React from "react";

interface Props {
  children: Readonly<React.ReactNode>;
}

export const CardContent = ({ children }: Props) => {
  return <div className="card-body">{children}</div>;
};
