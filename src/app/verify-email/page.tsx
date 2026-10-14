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
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-12 text-[#2B1519]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center justify-center">
        <section className="w-full rounded-2xl border border-[#E8DFD5] bg-white p-8 shadow-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#C5A059] bg-[#FAF7F2] shadow-xs">
                <span className="font-serif text-2xl font-bold text-[#6B1D2F]">A</span>
              </div>
            </Link>

            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#C5A059]">
              AURA OF SHREE
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold text-[#6B1D2F]">
              Verify Your Email
            </h1>

            <p className="mt-2 text-xs text-[#8A7879]">
              Enter the 6-digit verification code sent to
            </p>

            <p className="mt-1 break-all text-xs font-semibold text-[#6B1D2F]">
              {email || "your registered email"}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="otp"
                className="mb-1.5 block text-center text-xs font-semibold text-[#2B1519]"
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
                placeholder="000000"
                className="w-full rounded-md border border-[#DFD4C7] bg-[#FAF7F2]/40 px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono text-[#2B1519] outline-none transition placeholder:text-sm placeholder:tracking-normal placeholder:text-[#9C8B8E] focus:border-[#6B1D2F] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || !email}
              className="w-full rounded-md bg-[#6B1D2F] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#8A7879]">
            Already verified?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#6B1D2F] hover:underline"
            >
              Sign In
            </Link>
          </p>

          <div className="mt-6 border-t border-[#F0E6DC] pt-4 text-center">
            <Link href="/" className="text-xs text-[#8A7879] hover:text-[#2B1519]">
              ← Return to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 text-[#8A7879]">
          <p className="text-xs">Loading email verification...</p>
        </main>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
