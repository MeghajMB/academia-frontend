import React from "react";
import AdminNavbar from "@/components/navbar/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex">
        <AdminNavbar />
        {children}
      </div>
    </>
  );
}
