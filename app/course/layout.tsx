import React from "react";

import ProtectedRoute from "@/layouts/ProtectedRoute";

export default function Courseayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProtectedRoute role={["instructor", "student"]}>
        {children}
      </ProtectedRoute>
    </>
  );
}
