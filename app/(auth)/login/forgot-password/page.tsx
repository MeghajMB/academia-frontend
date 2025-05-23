"use client";

import Timer from "@/components/common/Timer";
import useAuthApi from "@/hooks/api/useAuthApi";
import { Button, Input, InputOtp } from "@heroui/react";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const [email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<null | string>(null);

  const { forgotPasswordApi, verifyResetPasswordApi, resetPasswordApi } =
    useAuthApi();

  const handleEmailSubmit = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCanResend(false);

      const response = await forgotPasswordApi(email);
      if (response.status == "error") {
        setError(response.message);
        return;
      }
      setShowOtp(true);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otpValue.length !== 6) {
      setError("Please enter a valid OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await verifyResetPasswordApi({ email, otp: otpValue });
      if (response.status == "error") {
        setError(response.message);
        return;
      }
      setToken(response.data.resetToken);
      setShowPasswordFields(true);
      console.log("OTP verified successfully");
    } catch (err) {
      setError("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Retry again");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await resetPasswordApi({
        email: email,
        password: newPassword,
        token: token,
      });
      if (response.status == "error") {
        setError(response.message);
        return;
      }

      toast.success("Password reset successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtpValue("");
    setCanResend(false);
    handleEmailSubmit();
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 pt-16">
      <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-md space-y-6">
        {!showOtp ? (
          <>
            <h1 className="text-2xl font-bold mb-6">
              Enter Your Email For Sending Verification Code
            </h1>
            <Input
              name="email"
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              labelPlacement="outside"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              type="email"
            />
            <Button
              color="secondary"
              isLoading={loading}
              onPress={handleEmailSubmit}
              className="w-full"
            >
              Send OTP
            </Button>
          </>
        ) : !showPasswordFields ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Enter OTP</h2>
            <Timer onChangeResend={setCanResend} />
            <InputOtp
              length={6}
              value={otpValue}
              onValueChange={setOtpValue}
              className="mb-4"
            />
            <Button
              color="primary"
              isLoading={loading}
              onPress={handleOtpSubmit}
              className="w-full"
              isDisabled={otpValue.length !== 6}
            >
              Verify OTP
            </Button>
            <Button
              variant="light"
              onPress={handleResendOtp}
              isDisabled={!canResend}
              className="w-full"
            >
              Resend OTP
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Reset Password</h2>
            <Input
              name="newPassword"
              label="New Password"
              placeholder="Enter your new password"
              variant="bordered"
              labelPlacement="outside"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-4"
              type="password"
            />
            <Input
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your new password"
              variant="bordered"
              labelPlacement="outside"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-4"
              type="password"
            />
            <Button
              color="primary"
              isLoading={loading}
              onPress={handlePasswordSubmit}
              className="w-full"
            >
              Reset Password
            </Button>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </main>
  );
}
