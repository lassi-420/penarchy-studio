"use client";

import { useTransition } from "react";
import type { CouponRecord } from "@/lib/data/repository";
import { toggleCouponAction, deleteCouponAction } from "@/app/admin/coupons/actions";

export function CouponsTable({ coupons }: { coupons: CouponRecord[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-text-faint)]">
          <th className="px-5 py-3 font-normal">Code</th>
          <th className="px-5 py-3 font-normal">Type</th>
          <th className="px-5 py-3 font-normal">Value</th>
          <th className="px-5 py-3 font-normal">Active</th>
          <th className="px-5 py-3 font-normal text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {coupons.map((c) => (
          <tr key={c.id} className="border-b border-[var(--color-border)] last:border-0">
            <td className="px-5 py-3 text-[var(--color-brass-light)]">{c.code}</td>
            <td className="px-5 py-3">{c.type.replace("_", " ")}</td>
            <td className="px-5 py-3">
              {c.type === "PERCENTAGE" ? `${c.value}%` : `$${c.value}`}
            </td>
            <td className="px-5 py-3">
              <button
                disabled={isPending}
                onClick={() =>
                  startTransition(() => toggleCouponAction(c.id, !c.active))
                }
                className={c.active ? "text-[var(--color-brass-light)]" : "text-[var(--color-text-faint)]"}
              >
                {c.active ? "Active" : "Inactive"}
              </button>
            </td>
            <td className="px-5 py-3 text-right">
              <button
                disabled={isPending}
                onClick={() => startTransition(() => deleteCouponAction(c.id))}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
