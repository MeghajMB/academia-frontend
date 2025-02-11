import ProtectedRoute from "@/hoc/ProtectedRoute"


export default function Page() {
  return (
    <>
  <ProtectedRoute role="admin">
    <h1>This is the dashboard</h1>
  </ProtectedRoute>
        

    </>
  );
}
