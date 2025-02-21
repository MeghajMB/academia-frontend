"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import Timer from "../Timer";
import useAuthApi from "@/hooks/api/useAuthApi";
import { toast } from "react-toastify";

const OTPVerification: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resend,setResend]=useState(false)
  const [isClient, setIsClient] = useState(false);
  const email = useRef("");
  const {verifyOtpApi,resendOtpApi}=useAuthApi()


  // Initialize refs array
  useEffect(() => {
    console.log("Hello")
    inputRefs.current = inputRefs.current.slice(0, 6);
    setIsClient(true);
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
      router.push("/login");
    } else {
      email.current = userEmail;
    }
    // Uncomment this code in production.In development as we are running on strictmode,unmounts the component twice
    // return () => {
    //   sessionStorage.removeItem("userEmail");
    // };
  }, [router]);
  if (!isClient) {
    return null;
  }

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // Move to previous input on backspace if current input is empty
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all digits");
      setLoading(false);
      return;
    }

    try {
      // Replace this with your actual OTP verification API call
      const response = await verifyOtpApi(otpString,email.current)
      if (response) {
        sessionStorage.removeItem("userEmail");
        router.push("/login");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { errors } = err.response?.data;
        setError(errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };
  async function handleResendOtp(){
    try {
      // Replace this with your actual OTP verification API call
      const response = await resendOtpApi(email.current)
      if (response) {
        toast('New Otp Send!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });

      } else {
        setError("Cannot Set Otp. Login Again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { errors } = err.response?.data;
        setError(errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="mt-2 text-gray-400">
            Enter the 6-digit code sent to your email
          </p>
          <Timer onChangeResend={setResend} />
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {resend && <p className="text-center text-sm text-gray-400">
            Didn&apos;t receive the code?
            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-300"
              onClick={handleResendOtp}
            >
              Resend
            </button>
          </p>}
        </form>
      </motion.div>
    </main>
  );
};

export default OTPVerification;
