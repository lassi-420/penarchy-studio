import Link from "next/link";
import { adminListProducts } from "@/lib/data/repository";
import { AdminProductsTable } from "@/components/admin/products-table";

export default async function AdminProductsPage() {
  const products = await adminListProducts();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-[var(--color-brass)] px-5 py-2.5 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)]"
        >
          + NEW PRODUCT
        </Link>
      </div>

      <div className="border border-[var(--color-border)] bg-[var(--color-ink-2)] overflow-x-auto">
        {products.length === 0 ? (
          <p className="px-5 py-8 text-sm text-[var(--color-text-faint)]">
            No products yet.
          </p>
        ) : (
          <AdminProductsTable products={products} />
        )}
      </div>
    </div>
  );
}
