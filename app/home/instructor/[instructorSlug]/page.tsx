"use client";
import InstructorDetail from "@/features/instructor/profile/InstructorDetail";
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

  return <InstructorDetail reviews={200} totalStudents={200} user={profile} />;
}
