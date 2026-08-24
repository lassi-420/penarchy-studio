import { listCoupons } from "@/lib/data/repository";
import { CouponsTable } from "@/components/admin/coupons-table";
import { createCouponAction } from "@/app/admin/coupons/actions";

export default async function AdminCouponsPage() {
  const coupons = await listCoupons();

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Coupons</h1>

      <div className="mb-10 border border-[var(--color-border)] bg-[var(--color-ink-2)] p-6">
        <h2 className="eyebrow mb-4">Create Coupon</h2>
        <form action={createCouponAction} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <input
            name="code"
            placeholder="CODE"
            required
            className="border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm uppercase"
          />
          <select
            name="type"
            className="border border-[var(--color-border-strong)] bg-[var(--color-ink)] px-3 py-2 text-sm"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount</option>
            <option value="FREE_SHIPPING">Free Shipping</option>
          </select>
          <input
            name="value"
            type="number"
            step="0.01"
            placeholder="Value"
            required
            className="border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm"
          />
          <button className="bg-[var(--color-brass)] px-4 py-2 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)]">
            CREATE
          </button>
        </form>
      </div>

      <div className="border border-[var(--color-border)] bg-[var(--color-ink-2)] overflow-x-auto">
        <CouponsTable coupons={coupons} />
      </div>
    </div>
  );
}
