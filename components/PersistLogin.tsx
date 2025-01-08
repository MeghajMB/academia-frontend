"use client"
import { useState, useEffect } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks";

interface PersistLoginProps {
  children: React.ReactNode;
}

const PersistLogin: React.FC<PersistLoginProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();

  const { accessToken } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    const storedValue=localStorage.getItem("persist");
    const persistedValue=storedValue ? JSON.parse(storedValue) : false;
    
    if (!accessToken && persistedValue) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);
 
  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};

export default PersistLogin;
