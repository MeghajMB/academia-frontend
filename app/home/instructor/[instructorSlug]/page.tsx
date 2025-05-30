"use client";
import InstructorDetail from "@/features/users/components/instructor/InstructorDetail";
import useUserApi from "@/hooks/api/useUserApi";
import { GetInstructorProfileResponseDTO } from "@academia-dev/common";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { fetchInstructorProfileApi } = useUserApi();
  const [profile, setProfile] = useState<
    GetInstructorProfileResponseDTO["data"] | null
  >(null);
  const { instructorSlug } = useParams();
  useEffect(() => {
    async function getProfile() {
      try {
        if (!instructorSlug || typeof instructorSlug !== "string") return;
        const response = await fetchInstructorProfileApi(instructorSlug);
        if (response.status == "error") {
          throw new Error(response.message);
        }
        setProfile(response.data);
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
    <div className="mt-11">
      <InstructorDetail reviews={200} totalStudents={200} user={profile} />
    </div>
  );
}
