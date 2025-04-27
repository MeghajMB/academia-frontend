"use client";
import InstructorDetail, { IInstructorDetail } from "@/features/users/components/instructor/InstructorDetail";
import ProtectedRoute from "@/hoc/ProtectedRoute";
import useUserApi from "@/hooks/api/useUserApi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { fetchInstructorProfileApi } = useUserApi();
  const [profile, setProfile] = useState<IInstructorDetail | null>(null);
  const { instructorSlug } = useParams();
  useEffect(() => {
    async function getProfile() {
      try {
        if (!instructorSlug || typeof instructorSlug !== "string") return;
        const response = await fetchInstructorProfileApi(instructorSlug);
        if (response.status == "error") {
          console.log(response.message);
          return;
        }
        setProfile(response.data as unknown as IInstructorDetail);
      } catch (error) {
        console.log(error);
      }
    }
    getProfile();
  }, [instructorSlug]);

  if (!profile) {
    return null;
  }

  return (
    <ProtectedRoute role={["instructor", "student"]}>
      <InstructorDetail reviews={200} totalStudents={200} user={profile} />
    </ProtectedRoute>
  );
}
