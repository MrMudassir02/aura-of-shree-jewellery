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

      const data = await response.json();

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
    <main className="min-h-screen bg-[#2A1112] px-5 py-10 text-[#F8EEE2]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <section className="w-full rounded-2xl border border-[#C99A52]/45 bg-[#3A1A1B] p-7 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#C99A52] bg-[#914944] shadow-[0_0_35px_rgba(201,154,82,0.12)]">
              <span className="font-serif text-3xl text-[#E1B765]">A</span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.35em] text-[#D6AA61]">
              Aura of Shree
            </p>

            <h1 className="mt-3 font-serif text-3xl text-[#FFF5E8]">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-[#D5C3B5]">
              Begin your journey with Aura of Shree.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-5 rounded-xl border border-[#C99A52]/35 bg-[#2A1112] p-4"
            >
              <p className="text-sm leading-6 text-[#F8EEE2]">{error}</p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="rounded-lg bg-[#C99A52] px-4 py-2 text-sm font-medium text-[#241011] transition hover:bg-[#D6AA61]"
                >
                  Sign In
                </Link>

                <Link
                  href="/forgot-password"
                  className="rounded-lg border border-[#C99A52]/40 px-4 py-2 text-sm text-[#E1B765] transition hover:bg-[#3A1A1B]"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm text-[#E8D8C9]"
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
                placeholder="Your full name"
                className="w-full rounded-lg border border-[#A87555]/60 bg-[#2A1112] px-4 py-3 text-[#FFF5E8] outline-none transition placeholder:text-[#9D8278] focus:border-[#D6AA61] focus:ring-1 focus:ring-[#D6AA61]/50"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm text-[#E8D8C9]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#A87555]/60 bg-[#2A1112] px-4 py-3 text-[#FFF5E8] outline-none transition placeholder:text-[#9D8278] focus:border-[#D6AA61] focus:ring-1 focus:ring-[#D6AA61]/50"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-[#E8D8C9]"
              >
                Password
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
                placeholder="Create a password"
                className="w-full rounded-lg border border-[#A87555]/60 bg-[#2A1112] px-4 py-3 text-[#FFF5E8] outline-none transition placeholder:text-[#9D8278] focus:border-[#D6AA61] focus:ring-1 focus:ring-[#D6AA61]/50"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm text-[#E8D8C9]"
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
                className="w-full rounded-lg border border-[#A87555]/60 bg-[#2A1112] px-4 py-3 text-[#FFF5E8] outline-none transition placeholder:text-[#9D8278] focus:border-[#D6AA61] focus:ring-1 focus:ring-[#D6AA61]/50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#C99A52] px-4 py-3 font-medium text-[#241011] transition hover:bg-[#D6AA61] focus:outline-none focus:ring-2 focus:ring-[#E1B765]/60 focus:ring-offset-2 focus:ring-offset-[#3A1A1B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-[#C8B5A7]">
            Already have an account?{" "}
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
