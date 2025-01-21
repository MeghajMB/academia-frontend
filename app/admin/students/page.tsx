import React from "react";
import UsersTable from "@/components/Admin/UsersTable";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <>
      <ProtectedRoute role="admin">
        <main className="overflow-x-auto p-20 flex-1">
          <UsersTable role="student" />
        </main>
      </ProtectedRoute>
    </>
  );
}
