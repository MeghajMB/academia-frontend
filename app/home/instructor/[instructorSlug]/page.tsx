"use client";
import InstructorDetail from "@/features/users/components/instructor/InstructorDetail";
import ProtectedRoute from "@/hoc/ProtectedRoute";
import useInstructorApi from "@/hooks/api/useInstructorApi";
import { useEffect, useState } from "react";

export default function Page() {
  const { fetchInstructorProfileApi } = useInstructorApi();
  const [profile, setProfile] = useState();
  useEffect(() => {
    async function getProfile() {
      try {
        const profile = await fetchInstructorProfileApi();
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
    <ProtectedRoute role={["instructor", "student", "admin"]}>
      <InstructorDetail reviews={200} totalStudents={200} user={profile} />
    </ProtectedRoute>
  );
}
