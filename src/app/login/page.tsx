"use client";

import { Suspense, FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawCallbackUrl = searchParams?.get("callbackUrl");

  const callbackUrl =
    rawCallbackUrl &&
    rawCallbackUrl.startsWith("/") &&
    !rawCallbackUrl.startsWith("//")
      ? rawCallbackUrl
      : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
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
              Welcome Back
            </h1>

            <p className="mt-1.5 text-xs text-[#8A7879]">
              Sign in to manage your bag, wishlist, and orders.
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

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#2B1519]"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#C5A059] transition hover:text-[#6B1D2F]"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Enter your password"
                className="w-full rounded-md border border-[#DFD4C7] bg-[#FAF7F2]/40 px-3.5 py-2.5 text-xs text-[#2B1519] outline-none transition placeholder:text-[#9C8B8E] focus:border-[#6B1D2F] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#6B1D2F] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#8A7879]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#6B1D2F] hover:underline"
            >
              Create Account
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 text-[#8A7879]">
          <p className="text-xs">Loading sign in...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
