import InstructorIntroductionPage from "@/components/pages/InstructorIntroductionPage";
import ProtectedRoute from "@/components/ProtectedRoute";
export default function Page() {
  return (
    <ProtectedRoute role="student">
      <InstructorIntroductionPage />
    </ProtectedRoute>
  );
}
