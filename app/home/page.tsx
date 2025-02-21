"use client";
import ProtectedRoute from "@/hoc/ProtectedRoute";
import Section from "@/components/ui/Section";

export default function Home() {

  return (
    <>
      <ProtectedRoute role="common">
        <main className="pt-24 mx-10">
          <section>
            <h2>Carousel</h2>
          </section>
          <Section label={"Top Rated Courses"} status='top-rated'/>
          <Section label={"Featured Instructors"} status='instructor'/>
          <Section label={"New Courses"} status='new' />
        </main>
      </ProtectedRoute>
    </>
  );
}
