import ProtectedRoute from "@/layouts/ProtectedRoute";
import React from "react";

function TeachingLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute role={["student"]}>{children}</ProtectedRoute>;
}

export default TeachingLayout;
