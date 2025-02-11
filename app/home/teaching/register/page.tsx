import ProtectedRoute from "@/hoc/ProtectedRoute";
import InstructorRegister from "./InstructorRegister";

export default function Page() {
  return (
    <ProtectedRoute role="student">
      <InstructorRegister />
    </ProtectedRoute>
  );
}
