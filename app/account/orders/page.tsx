import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AccountOrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:px-8">
      <p className="eyebrow mb-3">Account</p>
      <h1 className="font-display text-3xl text-[var(--color-text)] mb-10">
        Orders
      </h1>
      <EmptyState
        title="No orders yet"
        body="Once you place an order, it will show up here with status, tracking and item details."
      />
    </div>
  );
}
