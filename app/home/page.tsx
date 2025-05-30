"use client";
import ProtectedRoute from "@/hoc/ProtectedRoute";
import Section from "@/components/static/Section";
import Carousel from "@/components/static/Carousal";

export default function Home() {
  return (
    <>
      <ProtectedRoute role={["instructor","student"]}>
        <main>
          <Carousel />
          {/* <Section label={"Top Rated Courses"} status="top-rated" /> */}
          <Section label={"New Courses"} status="new" />
        </main>
      </ProtectedRoute>
    </>
  );
}
