"use client";
import InstructorDetail from "@/features/users/components/instructor/InstructorDetail";
import ProtectedRoute from "@/hoc/ProtectedRoute";
import useUserApi from "@/hooks/api/useUserApi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { fetchInstructorProfileApi } = useUserApi();
  const [profile, setProfile] = useState();
  const { instructorSlug } = useParams();
  useEffect(() => {
    async function getProfile() {
      try {
        if (!instructorSlug || typeof instructorSlug !== "string") return;
        const profile = await fetchInstructorProfileApi(instructorSlug);
        setProfile(profile);
      } catch (error) {
        console.log(error);
      }
    }
    getProfile();
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <ProtectedRoute role={["instructor", "student"]}>
      <InstructorDetail reviews={200} totalStudents={200} user={profile} />
    </ProtectedRoute>
  );
}
