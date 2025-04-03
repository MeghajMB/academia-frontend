import CategoriesTable from "@/features/admin/CategoriesTable";
import ProtectedRoute from "@/hoc/ProtectedRoute";
import React from "react";

export default function page() {
  return (
    <ProtectedRoute role={["admin"]}>
      <main className="overflow-x-auto p-20 flex-1">
        <CategoriesTable />
      </main>
    </ProtectedRoute>
  );
}
