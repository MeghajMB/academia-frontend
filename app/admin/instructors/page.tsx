import UsersTable from "@/components/pages/Admin/UsersTable";
import ProtectedRoute from "@/components/ProtectedRoute";

import React from "react";

export default function Page() {
  return (
    <>
      <ProtectedRoute role="admin">
        <main className="overflow-x-auto p-20 flex-1">
          <UsersTable role="instructor" />
        </main>
      </ProtectedRoute>
    </>
  );
}
