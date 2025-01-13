"use client";
import React, { useEffect, useState } from "react";
import { LockKeyhole, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { customAxios } from "@/lib/axios";
import { login } from "@/lib/features/auth/authSlice";
import { AxiosError } from "axios";

interface UserCredentials {
  email: string;
  password: string;
}
interface authErrors {
  email?: string;
  password?: string;
  common?: string;
}

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [persist, setPersist] = useState(false);
  const [credentials, setCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
  });
    const [errors, setErrors] = useState<authErrors>({});
  const [isClient, setIsClient] = useState(false); // Track client-side mount
  const { user } = useAppSelector((state) => state.auth);
  const dispatch=useAppDispatch()

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    if (user.role) {
      if (user.role !== "admin") {
        router.push("/");
      } else {
        router.push("/admin/dashboard");
      }
    }
    const localPersist = localStorage.getItem("persist");
    if (localPersist == undefined) {
      localStorage.setItem("persist", "false");
    } else {
      setPersist(localPersist === "true");
    }
  }, []);
  if (!isClient) {
    // Prevent rendering client-side code during SSR
    return null;
  }

  function handleChangePersist() {
    localStorage.setItem("persist", "" + !persist);
    setPersist((prevState) => !prevState);
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
        setLoading(true)
        let error = false;
        setErrors({});
    
        if (!credentials.email.trim()) {
          error = true;
          setErrors((prevError: authErrors) => {
            return { ...prevError, email: "Email cannot be empty" };
          });
        }
        if (!credentials.password.trim()) {
          error = true;
          setErrors((prevError: authErrors) => {
            return { ...prevError, password: "Password cannot be empty" };
          });
        }
        if (error) {
          setLoading(false)
          return
        };
    
        try {
          const response = await customAxios.post("/api/auth/signin", credentials);
          const { id, accessToken, name, role,email } = response.data;
          dispatch(login({ id, accessToken, role, userName: name,email:email }));
    
          router.push("/admin/dashboard");
        } catch (err) {
          if (err instanceof AxiosError) {
            setErrors({ common: err.response?.data?.message || "Login failed" });
          } else {
            setErrors({ common: "An unexpected error occurred" });
          }
        }finally{
          setLoading(false)
        }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 rounded-lg bg-gradient-to-br from-[#000000] to-[rgb(50,66,102)] bg-opacity-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-[#ddd7e4]">Enter your credentials to continue</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
        {errors.common && <p className="text-red-600">{errors.common}</p>}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#8680ff]" />
              </div>
              <input
                type="text"
                name="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials((prevCredentials) => {
                    return { ...prevCredentials, email: e.target.value };
                  })
                }
                className="block w-full pl-10 pr-3 py-2 border rounded-lg bg-black border-[#3228e0] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8680ff] focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>
            {errors.email && <p className="text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockKeyhole className="h-5 w-5 text-[#8680ff]" />
              </div>
              <input
                name="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prevCredentials) => {
                    return { ...prevCredentials, password: e.target.value };
                  })
                }
                type="password"
                className="block w-full pl-10 pr-3 py-2 border rounded-lg bg-black border-[#3228e0] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8680ff] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <p className="text-red-600">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                onChange={handleChangePersist}
                checked={persist}
                className="h-4 w-4 rounded border-[#3228e0] bg-black text-[#8680ff] focus:ring-[#8680ff]"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-white"
              >
                Remember me
              </label>
            </div>
          </div>

          <button
          disabled={loading}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#312e5b] hover:bg-[#8680ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8680ff] transition-colors duration-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
