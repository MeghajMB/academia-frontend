import ProtectedRoute from "@/hoc/ProtectedRoute";
import React from "react";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProtectedRoute role={["instructor", "student"]}>
        <div className="mx-10">{children}</div>
      </ProtectedRoute>
    </>
  );
}

export default HomeLayout;
