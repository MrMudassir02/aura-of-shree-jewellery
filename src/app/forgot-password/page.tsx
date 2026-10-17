"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Timer for OTP resend cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Step 1: Send OTP to Email
  async function handleRequestOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to send reset code. Please try again.");
      }

      setStep("verify");
      setCountdown(60);
      setSuccessMsg("We have sent a 6-digit verification code to your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset code.");
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP action
  async function handleResendOtp() {
    if (countdown > 0) return;
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to resend code.");
      }

      setCountdown(60);
      setSuccessMsg("A fresh 6-digit verification code has been sent!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP and Set New Password
  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: cleanOtp,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid or expired verification code.");
      }

      setSuccessMsg("✨ Password updated successfully! Signing you in…");

      // Auto-sign in with the new credentials for seamless UX
      const signInResult = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password: newPassword,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/account");
        router.refresh();
      } else {
        router.push("/login?reset=success");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-12 text-[#2B1519]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center justify-center">
        <section className="w-full rounded-3xl border border-[#E8DFD5] bg-white p-7 sm:p-9 shadow-md">
          {/* Brand Emblem */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block group" aria-label="Aura of Shree Home">
              <div className="mx-auto mb-3.5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#C5A059] bg-[#FAF7F2] shadow-xs transition-transform duration-300 group-hover:scale-105">
                <span className="font-serif text-2xl font-bold text-[#6B1D2F]">A</span>
              </div>
            </Link>

            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">
              Aura of Shree Jewellery
            </span>

            <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#2B1519]">
              {step === "request" ? "Reset Your Password" : "Set New Password"}
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#8A7879] leading-relaxed">
              {step === "request"
                ? "Enter your registered email address and we'll send you a 6-digit verification code to reset your password."
                : `Enter the 6-digit code sent to ${email} and create your new password.`}
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs font-medium text-red-800 animate-in fade-in"
            >
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="text-base font-bold text-red-800 hover:text-red-950"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          {successMsg && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 animate-in fade-in"
            >
              {successMsg}
            </div>
          )}

          {/* STEP 1 FORM: Email Request */}
          {step === "request" && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold text-[#2B1519]"
                >
                  Registered Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoFocus
                  className="w-full rounded-xl border border-[#DFD4C7] bg-[#FAF7F2]/50 px-4 py-3 text-xs sm:text-sm text-[#2B1519] outline-none transition placeholder:text-[#9C8B8E] focus:border-[#6B1D2F] focus:bg-white focus:ring-2 focus:ring-[#6B1D2F]/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#6B1D2F] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524] disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
              >
                {loading ? "Sending Code…" : "Send Reset Code →"}
              </button>
            </form>
          )}

          {/* STEP 2 FORM: OTP & New Password */}
          {step === "verify" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Change email shortcut */}
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-[#8A7879] truncate max-w-[200px]">{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("request");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="font-semibold text-[#6B1D2F] hover:underline"
                >
                  Change email
                </button>
              </div>

              {/* 6-Digit OTP Input */}
              <div>
                <label
                  htmlFor="otp"
                  className="mb-1.5 block text-xs font-semibold text-[#2B1519]"
                >
                  6-Digit Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-[#DFD4C7] bg-[#FAF7F2]/50 px-4 py-3 text-center font-mono text-xl font-bold tracking-[0.4em] text-[#6B1D2F] outline-none transition focus:border-[#6B1D2F] focus:bg-white focus:ring-2 focus:ring-[#6B1D2F]/10"
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-1.5 block text-xs font-semibold text-[#2B1519]"
                >
                  New Password (min 8 characters)
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-[#DFD4C7] bg-[#FAF7F2]/50 px-4 py-3 pr-10 text-xs sm:text-sm text-[#2B1519] outline-none transition placeholder:text-[#9C8B8E] focus:border-[#6B1D2F] focus:bg-white focus:ring-2 focus:ring-[#6B1D2F]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A7879] hover:text-[#2B1519]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-semibold text-[#2B1519]"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-[#DFD4C7] bg-[#FAF7F2]/50 px-4 py-3 text-xs sm:text-sm text-[#2B1519] outline-none transition placeholder:text-[#9C8B8E] focus:border-[#6B1D2F] focus:bg-white focus:ring-2 focus:ring-[#6B1D2F]/10"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#6B1D2F] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524] disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
              >
                {loading ? "Updating Password…" : "Update Password & Sign In →"}
              </button>

              {/* Resend OTP Link */}
              <div className="pt-2 text-center text-xs text-[#8A7879]">
                {countdown > 0 ? (
                  <span>Resend code in <strong className="text-[#6B1D2F]">{countdown}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="font-semibold text-[#6B1D2F] hover:underline"
                  >
                    Didn&apos;t receive code? Resend Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Footer Back to Login */}
          <div className="mt-8 border-t border-[#F0E6DC] pt-5 text-center text-xs">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 font-semibold text-[#6B1D2F] hover:underline"
            >
              <span>← Return to Sign In</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

