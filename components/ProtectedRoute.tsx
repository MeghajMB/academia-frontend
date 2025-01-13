"use client";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";

interface ProtectedRouteProps {
  role: "common" | "admin" | "student" | "instructor";
  children: ReactNode;
}

export default function ProtectedRoute({
  role,
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(role==='common'){
      if(user.role==='admin'){
        router.push('/admin')
      }
      if(!user.role){
        router.push('/')
      }
    }else if(role!==user.role){
      router.push('/')
    }
    setIsLoading(false)
  }, [user.role, role, router]);
  if (isLoading) {
    return null;
  }
  return <>{children}</>;
}
