import { adminListReviews } from "@/lib/data/repository";
import { ReviewsTable } from "@/components/admin/reviews-table";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AdminReviewsPage() {
  const reviews = await adminListReviews();

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Reviews</h1>
      <div className="border border-[var(--color-border)] bg-[var(--color-ink-2)]">
        {reviews.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No reviews yet"
              body="Reviews submitted by customers will appear here for moderation — none are seeded, since fabricated reviews aren't permitted."
            />
          </div>
        ) : (
          <ReviewsTable reviews={reviews} />
        )}
      </div>
    </div>
  );
}
