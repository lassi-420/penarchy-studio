"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-24 md:px-8">
      <h1 className="font-display text-3xl text-[var(--color-text)] mb-8">
        Create Account
      </h1>
      <form
        className="space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const data = Object.fromEntries(new FormData(e.currentTarget).entries());
          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          setLoading(false);
          if (res.ok) {
            toast("Account created — sign in to continue");
            router.push("/login");
          } else {
            const body = await res.json();
            toast.error(body.error ?? "Could not create account");
          }
        }}
      >
        <div>
          <label className="eyebrow mb-2 block">Name</label>
          <input
            name="name"
            required
            className="w-full border border-[var(--color-border-strong)] bg-transparent px-4 py-3 text-sm focus:border-[var(--color-brass)] focus:outline-none"
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-[var(--color-border-strong)] bg-transparent px-4 py-3 text-sm focus:border-[var(--color-brass)] focus:outline-none"
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full border border-[var(--color-border-strong)] bg-transparent px-4 py-3 text-sm focus:border-[var(--color-brass)] focus:outline-none"
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-[var(--color-brass)] py-3 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)] disabled:opacity-50"
        >
          {loading ? "CREATING…" : "CREATE ACCOUNT"}
        </button>
      </form>
      <p className="mt-6 text-xs text-[var(--color-text-faint)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--color-brass-light)] link-underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
