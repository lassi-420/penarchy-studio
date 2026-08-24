"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import type { Category } from "@/lib/types";

export function ShopFilters({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeSort = searchParams.get("sort") ?? "featured";

  const withParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <aside className="hidden w-56 flex-shrink-0 md:block">
      <div className="mb-10">
        <h3 className="eyebrow mb-4">Category</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/shop"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brass-light)]"
            >
              All
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/shop/${c.slug}`}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brass-light)]"
              >
                {c.name} ({c.productCount})
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="eyebrow mb-4">Sort</h3>
        <ul className="space-y-2">
          {[
            ["featured", "Featured"],
            ["newest", "Newest"],
            ["price-asc", "Price: Low to High"],
            ["price-desc", "Price: High to Low"],
            ["name-asc", "A–Z"],
          ].map(([value, label]) => (
            <li key={value}>
              <Link
                href={withParam("sort", value)}
                className={
                  activeSort === value
                    ? "text-sm text-[var(--color-brass-light)]"
                    : "text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brass-light)]"
                }
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
