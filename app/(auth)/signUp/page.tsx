"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import type { SignupCredentials } from "@/types/auth";
import GoogleSvg from "@/components/icons/GoogleSvg";
import { login } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { customAxios } from "@/api/axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/react";

interface IFormError{
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupPage = () => {
  const [credentials, setCredentials] = useState<SignupCredentials>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track client-side mount
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<IFormError>({});
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // To prevent hydration error
  useEffect(() => {
    if (user.role) {
      router.push("/home");
    }
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({})
    const validationErrors = validateForm(credentials);
    if (Object.values(validationErrors).some((error) => error !== "")) {
      setIsLoading(false);
      setErrors(validationErrors);
      return;
    }

    try {
      await customAxios.post("/api/auth/signup", credentials);
      sessionStorage.setItem("userEmail", credentials.email);
      router.push("/signUp/otp");
    } catch (error) {
      console.log(error);
      const errorMessage= error.response.data.errors[0].message || 'Something went wrong!Try again later.'
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
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

        router.push("/home");
      }

      // Clean up the listener
      window.removeEventListener("message", receiveMessage);
    };

    // Attach the event listener
    window.addEventListener("message", receiveMessage);
    setIsLoading(false);
  };

  return (
    <>
      <div className="min-h-full bg-black text-white flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-5 bg-gray-900 p-5 rounded-xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold">Create an account</h2>
            <p className="mt-2 text-gray-400">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your name"
                  value={credentials.name}
                  onChange={(e) =>
                    setCredentials({ ...credentials, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Create a password"
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
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Confirm your password"
                    value={credentials.confirmPassword}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
              >
                {isLoading ? <Spinner /> :"Create account"}
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
              className="w-full py-3 px-4 bg-white text-black rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <GoogleSvg />
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;

const validateForm = (credentials: SignupCredentials) => {
  const errors: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  } = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  if (!credentials.name.trim()) {
    errors.name = "Name is required";
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!credentials.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(credentials.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!credentials.password.trim()) {
    errors.password = "Password is required";
  } else if (credentials.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (credentials.password !== credentials.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
