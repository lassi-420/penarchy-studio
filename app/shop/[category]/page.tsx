import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, listCategories, listProducts, type ProductQuery } from "@/lib/data/repository";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/product/shop-filters";
import { EmptyState } from "@/components/ui/empty-state";

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: cat.seoTitle ?? cat.name,
    description: cat.seoDescription ?? cat.description,
  };
}

export default async function ShopCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { category } = await params;
  const { sort } = await searchParams;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const [categories, products] = await Promise.all([
    listCategories(),
    listProducts({ categorySlug: category, sort: sort as ProductQuery["sort"] }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="mb-10">
        <p className="eyebrow mb-3">Shop</p>
        <h1 className="font-display text-4xl text-[var(--color-text)]">
          {cat.name}
        </h1>
        {cat.description && (
          <p className="mt-3 max-w-lg text-sm text-[var(--color-text-muted)]">
            {cat.description}
          </p>
        )}
      </div>

      <div className="flex gap-12">
        <ShopFilters categories={categories} />
        <div className="flex-1">
          {products.length === 0 ? (
            <EmptyState
              title="No products in this category yet"
              body="This category is ready in the catalog — pieces will appear here once imported or added via the admin dashboard."
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
