"use client";

import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";

export function SectionHeading({
  eyebrow,
  title,
  href,
  hrefLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-10 flex items-end justify-between">
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="font-display text-3xl text-[var(--color-text)] md:text-4xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="link-underline hidden text-xs tracking-widest text-[var(--color-brass-light)] sm:block"
        >
          {hrefLabel ?? "VIEW ALL"}
        </Link>
      )}
    </div>
  );
}

export function ProductGridSection({
  eyebrow,
  title,
  products,
  href,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
  href?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <SectionHeading eyebrow={eyebrow} title={title} href={href} />
      <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <SectionHeading eyebrow="Signature Categories" title="Shop by Craft" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}`}
            className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-brass)]"
          >
            <span className="text-xs tracking-widest text-[var(--color-text-faint)]">
              {String(cat.productCount).padStart(2, "0")} PIECES
            </span>
            <span className="mt-1 font-display text-lg text-[var(--color-text)] group-hover:text-[var(--color-brass-light)]">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ProcessSteps() {
  const steps = [
    { title: "FORGE", body: "Raw billet is layered and forged under heat." },
    { title: "SHAPE", body: "The form is drawn out and refined by hand." },
    { title: "FINISH", body: "Surfaces are polished, etched and treated." },
    { title: "ASSEMBLE", body: "Components are fitted and hand-assembled." },
    { title: "INSPECT", body: "Every piece is checked before it ships." },
  ];
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-ink-2)]">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionHeading eyebrow="From Bench to Box" title="The Process" />
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {steps.map((s, i) => (
            <div key={s.title} className="border-t border-[var(--color-border-strong)] pt-4">
              <span className="text-xs text-[var(--color-brass-light)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-xl text-[var(--color-text)]">
                {s.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-faint)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandStatement() {
  return (
    <section className="flex items-center justify-center px-5 py-32 text-center">
      <h2 className="font-display text-4xl leading-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">
        Made to be kept.
      </h2>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="border-t border-[var(--color-border)] px-5 py-20 md:px-8">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <p className="eyebrow mb-4">Stay Informed</p>
        <h3 className="font-display text-2xl text-[var(--color-text)]">
          New releases, rarely announced elsewhere.
        </h3>
        <form
          className="mt-8 flex w-full max-w-sm gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="Email address"
            className="flex-1 border border-[var(--color-border-strong)] bg-transparent px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-brass)] focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[var(--color-brass)] px-5 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)]"
          >
            JOIN
          </button>
        </form>
      </div>
    </section>
  );
}
