import { Hero } from "@/components/home/hero";
import { CraftsmanshipSection } from "@/components/home/craftsmanship-section";
import {
  CategoryTiles,
  ProductGridSection,
  ProcessSteps,
  BrandStatement,
  NewsletterSection,
} from "@/components/home/sections";
import { listCategories, listProducts } from "@/lib/data/repository";

export default async function HomePage() {
  const [categories, featured, bestSellers, limited] = await Promise.all([
    listCategories(),
    listProducts({ featured: true }),
    listProducts({ bestSeller: true }),
    listProducts({ limitedEdition: true }),
  ]);

  return (
    <>
      <Hero />
      <ProductGridSection
        eyebrow="Featured Collection"
        title="Selected Pieces"
        products={featured}
        href="/shop"
      />
      <CraftsmanshipSection />
      <CategoryTiles categories={categories} />
      <ProductGridSection
        eyebrow="Best Sellers"
        title="Most Kept"
        products={bestSellers}
        href="/shop?sort=best-selling"
      />
      <ProductGridSection
        eyebrow="Scarcity by Design"
        title="Limited Edition"
        products={limited}
        href="/collections/limited-editions"
      />
      <ProcessSteps />
      <BrandStatement />
      <NewsletterSection />
    </>
  );
}
