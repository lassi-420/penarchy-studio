"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Review } from "@/lib/types";
import { EmptyState } from "@/components/ui/empty-state";

export function ProductReviews({
  productSlug,
  initialReviews,
}: {
  productSlug: string;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const approved = reviews.filter((r) => r.status === "APPROVED");
  const avgRating =
    approved.length > 0
      ? (approved.reduce((s, r) => s + r.rating, 0) / approved.length).toFixed(1)
      : null;

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-2">Reviews</p>
          <h2 className="font-display text-2xl text-[var(--color-text)]">
            {avgRating ? `${avgRating} out of 5` : "No reviews yet"}
            {approved.length > 0 && (
              <span className="ml-2 text-sm text-[var(--color-text-faint)]">
                ({approved.length})
              </span>
            )}
          </h2>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="border border-[var(--color-border-strong)] px-5 py-2.5 text-xs tracking-widest hover:border-[var(--color-brass)]"
        >
          WRITE A REVIEW
        </button>
      </div>

      {showForm && (
        <form
          className="mb-10 space-y-4 border border-[var(--color-border)] p-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            const form = e.currentTarget;
            const data = Object.fromEntries(new FormData(form).entries());
            try {
              const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, productSlug, rating }),
              });
              if (!res.ok) throw new Error("Failed to submit");
              const result = await res.json();
              setReviews((prev) => [...prev, { ...result.review, status: "PENDING" }]);
              toast("Review submitted — it will appear once approved.");
              form.reset();
              setShowForm(false);
            } catch {
              toast.error("Something went wrong submitting your review.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div>
            <label className="eyebrow mb-2 block">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  className={
                    n <= rating
                      ? "text-xl text-[var(--color-brass-light)]"
                      : "text-xl text-[var(--color-border-strong)]"
                  }
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <input
            name="title"
            placeholder="Review title (optional)"
            className="w-full border border-[var(--color-border-strong)] bg-transparent px-3 py-2.5 text-sm"
          />
          <textarea
            name="body"
            required
            rows={4}
            placeholder="Share your experience with this piece"
            className="w-full border border-[var(--color-border-strong)] bg-transparent px-3 py-2.5 text-sm"
          />
          <button
            disabled={submitting}
            className="bg-[var(--color-brass)] px-6 py-2.5 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)] disabled:opacity-50"
          >
            {submitting ? "SUBMITTING…" : "SUBMIT REVIEW"}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          body="Be the first to share your experience with this piece."
        />
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {reviews.map((r) => (
            <div key={r.id} className="py-5">
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-brass-light)]">
                  {"★".repeat(r.rating)}
                  <span className="text-[var(--color-border-strong)]">
                    {"★".repeat(5 - r.rating)}
                  </span>
                </span>
                {r.verifiedPurchase && (
                  <span className="text-xs text-[var(--color-text-faint)]">
                    Verified purchase
                  </span>
                )}
                {r.status === "PENDING" && (
                  <span className="text-xs text-[var(--color-text-faint)]">
                    Pending approval
                  </span>
                )}
              </div>
              {r.title && <p className="mt-2 text-sm text-[var(--color-text)]">{r.title}</p>}
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{r.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
