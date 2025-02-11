import ProtectedRoute from "@/hoc/ProtectedRoute";
import LearningPage from "@/components/userpage/MyLearningPage";
import React from "react";

export default function page() {
  return (
    <ProtectedRoute role="common">
      <LearningPage />
    </ProtectedRoute>
  );
}
