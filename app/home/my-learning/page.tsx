import ProtectedRoute from "@/hoc/ProtectedRoute";
import LearningPage from "@/features/course/components/MyLearningPage";
import React from "react";

export default function page() {
  return (
    <ProtectedRoute role={["instructor","student"]}>
      <LearningPage />
    </ProtectedRoute>
  );
}
