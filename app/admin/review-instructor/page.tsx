import ReviewInstructorTable from "@/features/users/components/admin/ReviewInstructorTable";
import React from "react";

export default function page() {
  return (
    <>
      <main className="overflow-x-auto p-20 flex-1">
        <ReviewInstructorTable />
      </main>
    </>
  );
}
