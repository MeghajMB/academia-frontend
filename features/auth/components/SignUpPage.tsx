"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import GoogleSvg from "@/components/svg/GoogleSvg";
import { useRouter } from "next/navigation";
import { customAxios } from "@/api/axios";
import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";
import { Input, Spinner } from "@heroui/react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupPage = ({
  handleGoogleSignIn,
  loading,
}: {
  handleGoogleSignIn: () => void;
  loading: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track client-side mount
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({ mode: "onChange" });

  // To prevent hydration error
  useEffect(() => {
    if (user.role) {
      router.push("/home");
    }
    setIsClient(true);
  }, []);
    useEffect(() => setIsLoading(loading), [loading]);
  if (!isClient) {
    return null;
  }
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await customAxios.post("/api/auth/signup", data);
      sessionStorage.setItem("userEmail", data.email);
      router.push("/signUp/otp");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response.data.errors[0].message ||
        "Something went wrong!Try again later.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="max-w-md w-full space-y-1 px-5 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create an account</h2>
          <p className="mt-2 text-gray-400">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name}
                {...register("name", {
                  required: "Must specify name",
                  validate: (value) => {
                    if (!value.trim())
                      return "Name cannot be empty or just spaces";
                    return true;
                  },
                })}
                variant="bordered"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                variant="bordered"
                placeholder="Enter your email"
                errorMessage={errors.email?.message}
                isInvalid={!!errors.email}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                variant="bordered"
                placeholder="Create a password"
                errorMessage={errors.password?.message}
                isInvalid={!!errors.password}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                }
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  variant="bordered"
                  placeholder="Confirm your password"
                  errorMessage={errors.confirmPassword?.message}
                  isInvalid={!!errors.confirmPassword}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
            >
              {isLoading ? <Spinner /> : "Create account"}
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
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-white text-black rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <GoogleSvg />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
