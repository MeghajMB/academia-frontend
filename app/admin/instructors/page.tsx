import UsersTable from "@/features/admin/UsersTable";
import ProtectedRoute from "@/hoc/ProtectedRoute";

import React from "react";

export default function Page() {
  return (
    <>
      <ProtectedRoute role={["admin"]}>
        <main className="overflow-x-auto p-20 flex-1">
          <UsersTable role="instructor" />
        </main>
      </ProtectedRoute>
    </>
  );
}
