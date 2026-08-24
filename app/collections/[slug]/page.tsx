import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollectionBySlug, listCollections, listProducts } from "@/lib/data/repository";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";

export async function generateStaticParams() {
  const collections = await listCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};
  return { title: collection.name, description: collection.description };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = await listProducts({ collectionSlug: slug });

  return (
    <div>
      <div className="border-b border-[var(--color-border)] bg-[var(--color-ink-2)] px-5 py-20 text-center md:px-8">
        <p className="eyebrow mb-3">Collection</p>
        <h1 className="font-display text-4xl text-[var(--color-text)] md:text-5xl">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--color-text-muted)]">
            {collection.description}
          </p>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        {products.length === 0 ? (
          <EmptyState
            title="No pieces in this collection yet"
            body="Pieces are assigned to collections from the admin dashboard."
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
