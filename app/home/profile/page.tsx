import ProtectedRoute from "@/hoc/ProtectedRoute";
import ProfilePage from "@/features/users/components/Profile/UserProfile";
import React from "react";

export default function page() {
  return (
    <ProtectedRoute role={["instructor","student"]}>
      <ProfilePage />
    </ProtectedRoute>
  );
}
