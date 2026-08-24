"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-24 md:px-8">
      <h1 className="font-display text-3xl text-[var(--color-text)] mb-4">
        Reset Password
      </h1>
      <p className="mb-8 text-sm text-[var(--color-text-muted)]">
        Enter your email and, if an account exists, we&apos;ll send a reset link.
      </p>
      {sent ? (
        <p className="text-sm text-[var(--color-brass-light)]">
          If an account exists for that email, a reset link is on its way.
        </p>
      ) : (
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO(prisma + email): generate a VerificationToken, email a
            // reset link via lib/email (emailTemplates.passwordReset).
            setSent(true);
            toast("Reset link requested");
          }}
        >
          <div>
            <label className="eyebrow mb-2 block">Email</label>
            <input
              type="email"
              required
              className="w-full border border-[var(--color-border-strong)] bg-transparent px-4 py-3 text-sm focus:border-[var(--color-brass)] focus:outline-none"
            />
          </div>
          <button className="w-full bg-[var(--color-brass)] py-3 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)]">
            SEND RESET LINK
          </button>
        </form>
      )}
    </div>
  );
}
