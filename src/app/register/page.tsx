"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      await response.json();

      if (!response.ok) {
        setError(
          "We couldn't create your account. If you've registered before, sign in or reset your password.",
        );
        return;
      }

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
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
          {/* Brand */}
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
              Create Account
            </h1>

            <p className="mt-1.5 text-xs text-[#8A7879]">
              Join the Aura Privilege Circle for exclusive luxury benefits.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800"
            >
              <p>{error}</p>

              <div className="mt-2 flex items-center gap-3">
                <Link
                  href="/login"
                  className="font-semibold text-[#6B1D2F] underline"
                >
                  Sign In instead
                </Link>
                <Link
                  href="/forgot-password"
                  className="text-[#8A7879] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-semibold text-[#2B1519]"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
                maxLength={100}
                placeholder="e.g. Maya Roy"
                className="w-full rounded-md border border-[#DFD4C7] bg-[#FAF7F2]/40 px-3.5 py-2.5 text-xs text-[#2B1519] outline-none transition placeholder:text-[#9C8B8E] focus:border-[#6B1D2F] focus:bg-white"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-[#2B1519]"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-md border border-[#DFD4C7] bg-[#FAF7F2]/40 px-3.5 py-2.5 text-xs text-[#2B1519] outline-none transition placeholder:text-[#9C8B8E] focus:border-[#6B1D2F] focus:bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold text-[#2B1519]"
              >
                Password (min. 8 characters)
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                maxLength={128}
                placeholder="Create a strong password"
                className="w-full rounded-md border border-[#DFD4C7] bg-[#FAF7F2]/40 px-3.5 py-2.5 text-xs text-[#2B1519] outline-none transition placeholder:text-[#9C8B8E] focus:border-[#6B1D2F] focus:bg-white"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-xs font-semibold text-[#2B1519]"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                maxLength={128}
                placeholder="Confirm your password"
                className="w-full rounded-md border border-[#DFD4C7] bg-[#FAF7F2]/40 px-3.5 py-2.5 text-xs text-[#2B1519] outline-none transition placeholder:text-[#9C8B8E] focus:border-[#6B1D2F] focus:bg-white"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#6B1D2F] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-xs text-[#8A7879]">
            Already have an account?{" "}
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
