"use client";
import { RootState } from "@/store/store";
import { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import Unauthorized from "@/components/common/UnAuthorized";
import LoadingPage from "@/components/common/LoadingPage";

interface ProtectedRouteProps {
  role: string[];
  children: ReactNode;
}

export default function ProtectedRoute({
  role,
  children,
}: ProtectedRouteProps) {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (role.includes(user.role as string)) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setError(true);
    }
  }, [user.role, role]);

  if (isLoading) {
    return <LoadingPage />;
  }
  if (error) {
    return <Unauthorized />;
  }
  return <>{children}</>;
}
