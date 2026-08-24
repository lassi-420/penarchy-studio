import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts, listProducts, listApprovedReviews } from "@/lib/data/repository";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCartPanel } from "@/components/product/add-to-cart-panel";
import { Accordion } from "@/components/product/accordion";
import { ProductGridSection } from "@/components/home/sections";
import { ProductReviews } from "@/components/product/product-reviews";
import { formatPrice } from "@/lib/utils";

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription,
    openGraph: {
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const approvedReviews = await listApprovedReviews(product.slug);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    sku: product.sku,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: "Penarchy Studio" },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability:
        product.inventory.quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/product/${product.slug}`,
    },
  };

  // Only include AggregateRating when real, approved reviews exist — never
  // fabricated per the "no fake reviews/ratings" requirement.
  if (approvedReviews.length > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (
        approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length
      ).toFixed(1),
      reviewCount: approvedReviews.length,
    };
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-8 text-xs text-[var(--color-text-faint)]">
        <Link href="/shop" className="hover:text-[var(--color-text)]">
          Shop
        </Link>{" "}
        /{" "}
        <Link
          href={`/shop/${product.categorySlug}`}
          className="hover:text-[var(--color-text)]"
        >
          {product.categorySlug.replace(/-/g, " ")}
        </Link>{" "}
        / <span className="text-[var(--color-text-muted)]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <p className="eyebrow mb-3">
            {product.categorySlug.replace(/-/g, " ")}
          </p>
          <h1 className="font-display text-3xl text-[var(--color-text)] md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xl text-[var(--color-text)]">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-[var(--color-text-faint)] line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-8">
            <AddToCartPanel product={product} />
          </div>

          <div className="mt-10">
            <Accordion
              items={[
                { title: "DESCRIPTION", body: product.description },
                {
                  title: "MATERIALS",
                  body: product.materials ?? "Details available on request.",
                },
                {
                  title: "DIMENSIONS",
                  body: [product.dimensions, product.weight]
                    .filter(Boolean)
                    .join(" · ") || "Details available on request.",
                },
                {
                  title: "CARE",
                  body:
                    product.careInstructions ??
                    "Wipe clean with a soft cloth. Store away from moisture.",
                },
                {
                  title: "SHIPPING & RETURNS",
                  body: "Free shipping on orders over the studio threshold. Returns accepted within 14 days on non-personalized items — see our Returns page for full policy.",
                },
              ]}
            />
          </div>

          {product.sourceUrl && (
            <p className="mt-6 text-xs text-[var(--color-text-faint)]">
              Migrated from the original BladesAndBeyonds listing.
            </p>
          )}
        </div>
      </div>

      <ProductGridSection
        eyebrow="You May Also Like"
        title="Related Pieces"
        products={related}
      />

      <ProductReviews productSlug={product.slug} initialReviews={approvedReviews} />
    </div>
  );
}
