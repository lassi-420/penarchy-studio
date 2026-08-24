import { EmptyState } from "@/components/ui/empty-state";

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Customers</h1>
      <EmptyState
        title="No customers yet"
        body="Registered customers will appear here once the User model is backed by Postgres."
      />
    </div>
  );
}
