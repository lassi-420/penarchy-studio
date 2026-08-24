import type { Metadata } from "next";
import { listCategories, listProducts, type ProductQuery } from "@/lib/data/repository";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/product/shop-filters";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Shop All",
  description: "The full Penarchy Studio catalog of handcrafted metalwork.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const [categories, products] = await Promise.all([
    listCategories(),
    listProducts({ sort: sort as ProductQuery["sort"] }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="mb-10">
        <p className="eyebrow mb-3">Shop All</p>
        <h1 className="font-display text-4xl text-[var(--color-text)]">
          {products.length} {products.length === 1 ? "Piece" : "Pieces"}
        </h1>
      </div>

      <div className="flex gap-12">
        <ShopFilters categories={categories} />
        <div className="flex-1">
          {products.length === 0 ? (
            <EmptyState
              title="No products yet"
              body="The catalog is being migrated from BladesAndBeyonds. Check back soon, or view the admin import tool."
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
