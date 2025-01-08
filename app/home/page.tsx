import EventsSection from "@/components/EventCard";
import CoursesSection from "@/components/Course";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <>

        <ProtectedRoute role="student">
          <CoursesSection />
          <EventsSection />
        </ProtectedRoute>

    </>
  );
}
