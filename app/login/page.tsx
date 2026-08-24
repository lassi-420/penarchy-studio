"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-24 md:px-8">
      <h1 className="font-display text-3xl text-[var(--color-text)] mb-8">
        Sign In
      </h1>
      <form
        className="space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });
          setLoading(false);
          if (res?.error) {
            toast.error("Invalid email or password");
          } else {
            toast("Signed in");
            router.push("/account");
          }
        }}
      >
        <div>
          <label className="eyebrow mb-2 block">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[var(--color-border-strong)] bg-transparent px-4 py-3 text-sm focus:border-[var(--color-brass)] focus:outline-none"
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[var(--color-border-strong)] bg-transparent px-4 py-3 text-sm focus:border-[var(--color-brass)] focus:outline-none"
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-[var(--color-brass)] py-3 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)] disabled:opacity-50"
        >
          {loading ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>
      <div className="mt-6 flex justify-between text-xs text-[var(--color-text-faint)]">
        <Link href="/forgot-password" className="hover:text-[var(--color-text)]">
          Forgot password?
        </Link>
        <Link href="/register" className="hover:text-[var(--color-text)]">
          Create an account
        </Link>
      </div>
    </div>
  );
}
