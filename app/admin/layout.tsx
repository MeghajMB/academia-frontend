import React from "react";
import AdminNavbar from "@/components/navbar/AdminNavbar";
import ProtectedRoute from "@/hoc/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProtectedRoute role="admin">
        <div className="flex">
          <AdminNavbar />
          {children}
        </div>
      </ProtectedRoute>
    </>
  );
}
