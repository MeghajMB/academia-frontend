"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import RobotCanvas from "@/components/canvas/RobotCanvas";
import LoginComponent from "@/features/auth/components/loginPage";
import SignupPage from "@/features/auth/components/SignUpPage";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [persist, setPersist] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [page, setPage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const param = useSearchParams();

  useEffect(() => {
    if (user.role == "admin") {
      router.push("/admin-login");
    }
    if (user.role == "student" || user.role == "instructor") {
      router.push("/");
    }
    const localPersist = localStorage.getItem("persist");
    if (localPersist == undefined) {
      localStorage.setItem("persist", "false");
    } else {
      setPersist(localPersist === "true");
    }
  }, [user.role]);

  useEffect(() => {
    setPage(param.get("page") || "");
  }, [param]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`,
      "_blank",
      "width=500,height=600"
    );
    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_BACKEND_URL) return; // Validate the origin

      const data = event.data; // Extract token from the message
      if (data) {
        dispatch(login(data));

        // Redirect to dashboard or show logged-in content
        router.push("/home");
      }

      // Clean up the listener
      window.removeEventListener("message", receiveMessage);
    };

    // Attach the event listener
    window.addEventListener("message", receiveMessage);
  };

  function handleChangePersist() {
    localStorage.setItem("persist", "" + !persist);
    setPersist((prevState) => !prevState);
  }

  return (
    <>
      <main className=" bg-black text-white grid grid-cols-1 md:grid-cols-5">
        <div className="hidden md:block  h-[calc(100vh-70px)] w-full col-span-3">
          <RobotCanvas />
        </div>

        <div className="flex items-center justify-center col-span-2">
          {page == "sign-up" ? (
            <SignupPage
              loading={loading}
              handleGoogleSignIn={handleGoogleSignIn}
            />
          ) : (
            <LoginComponent
              handleChangePersist={handleChangePersist}
              handleGoogleSignIn={handleGoogleSignIn}
              persist={persist}
              isLoading={loading}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default LoginPage;
