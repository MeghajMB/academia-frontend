import React from "react";
import ProtectedRoute from "@/layouts/ProtectedRoute";

export default function CallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProtectedRoute role={["student", "instructor"]}>
        {children}
      </ProtectedRoute>
    </>
  );
}
