"use client";

import { useTransition } from "react";
import type { Review } from "@/lib/types";
import { approveReviewAction, rejectReviewAction, deleteReviewAction } from "@/app/admin/reviews/actions";

export function ReviewsTable({ reviews }: { reviews: Review[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="divide-y divide-[var(--color-border)]">
      {reviews.map((r) => (
        <div key={r.id} className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-[var(--color-text-faint)]">
                {r.productSlug}
              </span>
              <span className="ml-3 text-[var(--color-brass-light)]">
                {"★".repeat(r.rating)}
                <span className="text-[var(--color-border-strong)]">
                  {"★".repeat(5 - r.rating)}
                </span>
              </span>
              {r.verifiedPurchase && (
                <span className="ml-3 text-xs text-[var(--color-text-faint)]">
                  Verified purchase
                </span>
              )}
            </div>
            <span
              className={
                r.status === "APPROVED"
                  ? "text-xs text-[var(--color-brass-light)]"
                  : r.status === "REJECTED"
                  ? "text-xs text-red-400"
                  : "text-xs text-[var(--color-text-faint)]"
              }
            >
              {r.status}
            </span>
          </div>
          {r.title && <p className="mt-2 text-sm">{r.title}</p>}
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{r.body}</p>
          <div className="mt-3 flex gap-4 text-xs">
            <button
              disabled={isPending}
              onClick={() => startTransition(() => approveReviewAction(r.id))}
              className="text-[var(--color-brass-light)] hover:underline"
            >
              Approve
            </button>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => rejectReviewAction(r.id))}
              className="text-[var(--color-text-muted)] hover:underline"
            >
              Reject
            </button>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => deleteReviewAction(r.id))}
              className="text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
