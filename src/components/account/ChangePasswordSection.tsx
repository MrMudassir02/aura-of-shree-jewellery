"use client";

import { useState, type FormEvent } from "react";

export default function ChangePasswordSection() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update password.");
      }

      setSuccess("✨ Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setOpen(false);
        setSuccess("");
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#E8DFD5] bg-[#FAF7F2]/40 p-5 transition duration-150">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-base font-bold text-[#2B1519]">
            Account Security &amp; Password
          </h3>
          <p className="mt-0.5 text-xs text-[#8A7879]">
            Update your account password regularly to keep your jewellery orders secure.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setOpen((prev) => !prev);
            setError("");
            setSuccess("");
          }}
          className="rounded-xl border border-[#DFD4C7] bg-white px-4 py-2 text-xs font-semibold text-[#6B1D2F] shadow-2xs transition hover:border-[#6B1D2F] hover:bg-[#FAF7F2] active:scale-95"
        >
          {open ? "Cancel" : "Change Password"}
        </button>
      </div>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-4 border-t border-[#F0E6DC] pt-5 animate-in fade-in slide-in-from-top-2"
        >
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs font-medium text-red-800"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-medium text-emerald-800"
            >
              {success}
            </div>
          )}

          <div>
            <label
              htmlFor="currentPassword"
              className="mb-1 block text-xs font-semibold text-[#524043]"
            >
              Current Password *
            </label>
            <input
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter your current password"
              className="w-full rounded-xl border border-[#DFD4C7] bg-white px-3.5 py-2.5 text-xs text-[#2B1519] outline-none transition focus:border-[#6B1D2F]"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="accNewPassword"
                className="mb-1 block text-xs font-semibold text-[#524043]"
              >
                New Password (min 8 chars) *
              </label>
              <input
                id="accNewPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Enter new password"
                className="w-full rounded-xl border border-[#DFD4C7] bg-white px-3.5 py-2.5 text-xs text-[#2B1519] outline-none transition focus:border-[#6B1D2F]"
              />
            </div>

            <div>
              <label
                htmlFor="accConfirmPassword"
                className="mb-1 block text-xs font-semibold text-[#524043]"
              >
                Confirm New Password *
              </label>
              <input
                id="accConfirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-[#DFD4C7] bg-white px-3.5 py-2.5 text-xs text-[#2B1519] outline-none transition focus:border-[#6B1D2F]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-xs text-[#8A7879] hover:text-[#2B1519]"
            >
              {showPassword ? "Hide password characters" : "Show password characters"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#6B1D2F] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524] disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
            >
              {loading ? "Updating…" : "Save New Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

