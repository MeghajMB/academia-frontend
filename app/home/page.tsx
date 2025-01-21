

import ProtectedRoute from "@/components/ProtectedRoute";
import Section from "@/components/ui/Section";

export default function Home() {
  return (
    <>
      <ProtectedRoute role="common">
      <main className="pt-24 ml-10 mr-10">
        <section>
          <h2>Carousel</h2>
        </section>
        <Section label={"Top Rated Courses"} />
        <Section label={"Featured Instructors"} />
        <Section label={"New Courses"} />
      </main>
      </ProtectedRoute>
    </>
  );
}
