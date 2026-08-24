import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { EmptyState } from "@/components/ui/empty-state";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  const { id } = await params;

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:px-8">
      <p className="eyebrow mb-3">Order {id}</p>
      <h1 className="font-display text-3xl text-[var(--color-text)] mb-10">
        Order Details
      </h1>
      <EmptyState
        title="Order lookup unavailable in this environment"
        body="Order timeline, items and tracking will render here once the Order model is connected to Postgres."
      />
    </div>
  );
}
