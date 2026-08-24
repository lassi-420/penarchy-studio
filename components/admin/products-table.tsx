"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import {
  deleteProductAction,
  duplicateProductAction,
  togglePublishAction,
} from "@/app/admin/products/actions";
import { toast } from "sonner";

export function AdminProductsTable({ products }: { products: Product[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-text-faint)]">
          <th className="px-5 py-3 font-normal">Product</th>
          <th className="px-5 py-3 font-normal">SKU</th>
          <th className="px-5 py-3 font-normal">Category</th>
          <th className="px-5 py-3 font-normal">Price</th>
          <th className="px-5 py-3 font-normal">Stock</th>
          <th className="px-5 py-3 font-normal">Status</th>
          <th className="px-5 py-3 font-normal text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0">
            <td className="px-5 py-3">
              <Link
                href={`/admin/products/${p.id}`}
                className="hover:text-[var(--color-brass-light)]"
              >
                {p.name}
              </Link>
            </td>
            <td className="px-5 py-3 text-[var(--color-text-faint)]">{p.sku}</td>
            <td className="px-5 py-3 text-[var(--color-text-faint)]">
              {p.categorySlug}
            </td>
            <td className="px-5 py-3">{formatPrice(p.price)}</td>
            <td className="px-5 py-3">{p.inventory.quantity}</td>
            <td className="px-5 py-3">
              <button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await togglePublishAction(p.id, p.status !== "PUBLISHED");
                    toast(
                      p.status === "PUBLISHED" ? "Unpublished" : "Published"
                    );
                  })
                }
                className={
                  p.status === "PUBLISHED"
                    ? "text-xs text-[var(--color-brass-light)]"
                    : "text-xs text-[var(--color-text-faint)]"
                }
              >
                {p.status}
              </button>
            </td>
            <td className="px-5 py-3 text-right">
              <div className="flex justify-end gap-3 text-xs">
                <button
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      await duplicateProductAction(p.id);
                      toast("Product duplicated");
                    })
                  }
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  Duplicate
                </button>
                <button
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      if (!confirm(`Delete "${p.name}"?`)) return;
                      await deleteProductAction(p.id);
                      toast("Product deleted");
                    })
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
