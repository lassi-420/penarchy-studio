import { EmptyState } from "@/components/ui/empty-state";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Orders</h1>
      <EmptyState
        title="No orders yet"
        body="Orders will appear here once checkout is connected to the live database — the Order, OrderItem and Payment models are already defined in prisma/schema.prisma."
      />
    </div>
  );
}
