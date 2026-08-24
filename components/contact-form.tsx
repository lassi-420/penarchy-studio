"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to send");
          toast("Message sent — we'll get back to you soon.");
          form.reset();
        } catch {
          toast.error("Something went wrong. Please email us directly.");
        } finally {
          setSubmitting(false);
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
        <label className="eyebrow mb-2 block">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border border-[var(--color-border-strong)] bg-transparent px-4 py-3 text-sm focus:border-[var(--color-brass)] focus:outline-none"
        />
      </div>
      <button
        disabled={submitting}
        className="bg-[var(--color-brass)] px-8 py-3 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)] disabled:opacity-50"
      >
        {submitting ? "SENDING…" : "SEND MESSAGE"}
      </button>
    </form>
  );
}
