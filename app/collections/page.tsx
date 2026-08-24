import type { Metadata } from "next";
import Link from "next/link";
import { listCollections } from "@/lib/data/repository";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await listCollections();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <p className="eyebrow mb-3">Curated</p>
      <h1 className="font-display text-4xl text-[var(--color-text)]">
        Collections
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/collections/${c.slug}`}
            className="group border border-[var(--color-border)] p-8 transition-colors hover:border-[var(--color-brass)]"
          >
            <h2 className="font-display text-2xl text-[var(--color-text)] group-hover:text-[var(--color-brass-light)]">
              {c.name}
            </h2>
            {c.description && (
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                {c.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
