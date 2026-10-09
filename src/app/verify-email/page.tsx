"use client";

import { Suspense, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams?.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to verify email.");
        return;
      }

      router.push("/login?verified=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#2A1112] px-5 py-10 text-[#F8EEE2]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <section className="w-full rounded-2xl border border-[#C99A52]/45 bg-[#3A1A1B] p-7 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#C99A52] bg-[#914944]">
              <span className="font-serif text-3xl text-[#E1B765]">A</span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.35em] text-[#D6AA61]">
              Aura of Shree
            </p>

            <h1 className="mt-3 font-serif text-3xl text-[#FFF5E8]">
              Verify Your Email
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#D5C3B5]">
              Enter the 6-digit verification code sent to
            </p>

            <p className="mt-1 break-all text-sm text-[#D6AA61]">
              {email || "Your registered email"}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-5 rounded-lg border border-red-300/25 bg-red-950/30 px-4 py-3 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="otp"
                className="mb-2 block text-sm text-[#E8D8C9]"
              >
                Verification Code
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
                placeholder="Enter 6-digit OTP"
                className="w-full rounded-lg border border-[#A87555]/60 bg-[#2A1112] px-4 py-3 text-center text-xl tracking-[0.5em] text-[#FFF5E8] outline-none transition placeholder:text-sm placeholder:tracking-normal placeholder:text-[#9D8278] focus:border-[#D6AA61] focus:ring-1 focus:ring-[#D6AA61]/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || !email}
              className="w-full rounded-lg bg-[#C99A52] px-4 py-3 font-medium text-[#241011] transition hover:bg-[#D6AA61] focus:outline-none focus:ring-2 focus:ring-[#E1B765]/60 focus:ring-offset-2 focus:ring-offset-[#3A1A1B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#C8B5A7]">
            Already verified?{" "}
            <Link
              href="/login"
              className="text-[#D6AA61] transition hover:text-[#F0CB87]"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#2A1112] px-5 text-[#F8EEE2]">
          <p className="text-sm">Loading email verification...</p>
        </main>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
