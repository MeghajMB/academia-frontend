import React from "react";

import ProtectedRoute from "@/hoc/ProtectedRoute";

export default function Courseayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProtectedRoute role="instructor">{children}</ProtectedRoute>
    </>
  );
}
