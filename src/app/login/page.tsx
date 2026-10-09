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
    <main className="min-h-screen bg-[#2A1112] px-5 py-10 text-[#F8EEE2]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <section className="w-full rounded-2xl border border-[#C99A52]/45 bg-[#3A1A1B] p-7 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#C99A52] bg-[#914944] shadow-[0_0_35px_rgba(201,154,82,0.12)]">
              <span className="font-serif text-3xl text-[#E1B765]">A</span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.35em] text-[#D6AA61]">
              Aura of Shree
            </p>

            <h1 className="mt-3 font-serif text-3xl text-[#FFF5E8]">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-[#D5C3B5]">
              Sign in to continue your journey.
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

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm text-[#E8D8C9]"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-[#D6AA61] transition hover:text-[#F0CB87]"
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
                className="w-full rounded-lg border border-[#A87555]/60 bg-[#2A1112] px-4 py-3 text-[#FFF5E8] outline-none transition placeholder:text-[#9D8278] focus:border-[#D6AA61] focus:ring-1 focus:ring-[#D6AA61]/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#C99A52] px-4 py-3 font-medium text-[#241011] transition hover:bg-[#D6AA61] focus:outline-none focus:ring-2 focus:ring-[#E1B765]/60 focus:ring-offset-2 focus:ring-offset-[#3A1A1B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#C8B5A7]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#D6AA61] transition hover:text-[#F0CB87]"
            >
              Create one
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#2A1112] px-5 text-[#F8EEE2]">
          <p className="text-sm">Loading sign in...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
