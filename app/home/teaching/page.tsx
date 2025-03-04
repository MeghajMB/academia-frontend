import InstructorIntroductionPage from "@/components/pages/InstructorIntroductionPage";
import ProtectedRoute from "@/hoc/ProtectedRoute";
export default function Page() {
  return (
    <ProtectedRoute role={["student"]}>
      <InstructorIntroductionPage />
    </ProtectedRoute>
  );
}
