import HomePage from "@/components/pages/HomePage";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <>
      <ProtectedRoute role="common">
        <HomePage />
      </ProtectedRoute>
    </>
  );
}
