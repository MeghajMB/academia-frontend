"use client";
import GoogleSvg from "@/components/svg/GoogleSvg";
import useAuthApi from "@/hooks/api/useAuthApi";
import { useAppDispatch } from "@/lib/hooks";
import { login } from "@/lib/features/auth/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { UserCredentials } from "@/types/auth";
import { Input } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
interface authErrors {
  email?: string;
  password?: string;
  common?: string;
}
interface LoginComponentProps {
  handleChangePersist: () => void;
  persist: boolean;
  handleGoogleSignIn: () => Promise<void>;
  isLoading: boolean;
}

function LoginComponent({
  handleChangePersist,
  persist,
  handleGoogleSignIn,
  isLoading,
}: LoginComponentProps) {
  const [credentials, setCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<authErrors>({});
  const [loading, setLoading] = useState(isLoading);
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { signInApi } = useAuthApi();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await signInApi(credentials);
      if (response.status == "success") {
        dispatch(login(response.data));
        router.push("/home");
      } else {
        setErrors({ common: response.message || "Login failed" });
      }
    } catch (err) {
      console.log(err);
      setErrors({ common: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-md w-full space-y-8  p-8 rounded-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-gray-400">Please enter your details</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {errors.common && <p className="text-red-600">{errors.common}</p>}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                variant="bordered"
                placeholder="Enter your email"
                value={credentials.email}
                errorMessage={errors.email || ""}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  variant="bordered"
                  placeholder="Enter your password"
                  errorMessage={errors.password || ""}
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="remember-me"
                id="remember-me"
                onChange={handleChangePersist}
                checked={persist}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="block text-md font-medium "
              >
                Remember me
              </label>
            </div>
            <button
              className="text-sm hover:text-purple-500"
              onClick={() => router.push("/login/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 bg-white text-black rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleSvg />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?
            <Link
              href="/login?page=sign-up"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default LoginComponent;
