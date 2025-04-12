import UsersTable from "@/features/users/components/admin/UsersTable";
import React from "react";

export default function Page() {
  return (
    <>
      <main className="overflow-x-auto p-20 flex-1">
        <UsersTable role="instructor" />
      </main>
    </>
  );
}
