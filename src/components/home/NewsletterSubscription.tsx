"use client";

import { useState } from "react";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  }

  return (
    <div className="mt-8">
      {subscribed ? (
        <div className="mx-auto max-w-md rounded-xl border border-[#C5A059]/40 bg-[#FAF7F2] p-4 text-center shadow-xs">
          <p className="font-serif text-base font-bold text-[#6B1D2F]">
            ✓ Welcome to the Aura Privilege Circle!
          </p>
          <p className="mt-1 text-xs text-[#8A7879]">
            Your ₹1,500 welcome voucher code has been sent to your email.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:flex-row sm:justify-center"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full rounded-md border border-[#DFD4C7] bg-white px-4 py-3 text-xs text-[#2B1519] placeholder:text-[#9C8B8E] focus:border-[#6B1D2F] focus:outline-none sm:max-w-md"
          />
          <button
            type="submit"
            className="rounded-md bg-[#6B1D2F] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524] active:scale-95"
          >
            Join the Club
          </button>
        </form>
      )}
    </div>
  );
}

