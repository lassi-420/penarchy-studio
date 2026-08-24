import { listShippingMethods } from "@/lib/data/repository";
import { ShippingTable } from "@/components/admin/shipping-table";
import { createShippingMethodAction } from "@/app/admin/shipping/actions";

export default async function AdminShippingPage() {
  const methods = await listShippingMethods();

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Shipping</h1>

      <div className="mb-10 border border-[var(--color-border)] bg-[var(--color-ink-2)] p-6">
        <h2 className="eyebrow mb-4">Add Shipping Method</h2>
        <form
          action={createShippingMethodAction}
          className="grid grid-cols-2 gap-4 sm:grid-cols-6"
        >
          <input
            name="zoneName"
            placeholder="Zone (e.g. United States)"
            required
            className="border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm sm:col-span-2"
          />
          <input
            name="name"
            placeholder="Method name"
            required
            className="border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm"
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            required
            className="border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm"
          />
          <input
            name="estimatedDaysMin"
            type="number"
            placeholder="Min days"
            required
            className="border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm"
          />
          <input
            name="estimatedDaysMax"
            type="number"
            placeholder="Max days"
            required
            className="border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm"
          />
          <button className="col-span-2 bg-[var(--color-brass)] px-4 py-2 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)] sm:col-span-1">
            ADD
          </button>
        </form>
      </div>

      <div className="border border-[var(--color-border)] bg-[var(--color-ink-2)] overflow-x-auto">
        <ShippingTable methods={methods} />
      </div>
    </div>
  );
}
