import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilePage from "@/components/UserProfile";
import React from "react";

export default function page() {
  return (
    <ProtectedRoute role="common">
      <ProfilePage />
    </ProtectedRoute>
  );
}
