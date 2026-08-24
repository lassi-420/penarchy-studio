"use client";

import { useTransition } from "react";
import type { ShippingMethodRecord } from "@/lib/data/repository";
import { toggleShippingMethodAction, deleteShippingMethodAction } from "@/app/admin/shipping/actions";
import { formatPrice } from "@/lib/utils";

export function ShippingTable({ methods }: { methods: ShippingMethodRecord[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-text-faint)]">
          <th className="px-5 py-3 font-normal">Zone</th>
          <th className="px-5 py-3 font-normal">Method</th>
          <th className="px-5 py-3 font-normal">Price</th>
          <th className="px-5 py-3 font-normal">Free Over</th>
          <th className="px-5 py-3 font-normal">Estimate</th>
          <th className="px-5 py-3 font-normal">Active</th>
          <th className="px-5 py-3 font-normal text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {methods.map((m) => (
          <tr key={m.id} className="border-b border-[var(--color-border)] last:border-0">
            <td className="px-5 py-3">{m.zoneName}</td>
            <td className="px-5 py-3">{m.name}</td>
            <td className="px-5 py-3">{formatPrice(m.price)}</td>
            <td className="px-5 py-3">
              {m.freeShippingThreshold ? formatPrice(m.freeShippingThreshold) : "—"}
            </td>
            <td className="px-5 py-3">
              {m.estimatedDaysMin}–{m.estimatedDaysMax} days
            </td>
            <td className="px-5 py-3">
              <button
                disabled={isPending}
                onClick={() =>
                  startTransition(() => toggleShippingMethodAction(m.id, !m.active))
                }
                className={m.active ? "text-[var(--color-brass-light)]" : "text-[var(--color-text-faint)]"}
              >
                {m.active ? "Active" : "Inactive"}
              </button>
            </td>
            <td className="px-5 py-3 text-right">
              <button
                disabled={isPending}
                onClick={() => startTransition(() => deleteShippingMethodAction(m.id))}
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
