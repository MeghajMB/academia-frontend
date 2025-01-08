"use client";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";

interface ProtectedRouteProps {
  role: string;
  children: ReactNode;
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user.role !== role) {
      router.push(role === "admin" ? "/admin" : "/");
    }
  }, [user.role, role, router]);

  if (user.role === role) {
    return <>{children}</>;
  }


  return null;
}
