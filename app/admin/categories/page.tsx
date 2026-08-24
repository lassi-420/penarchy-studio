import { listCategories } from "@/lib/data/repository";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Categories</h1>
      <div className="border border-[var(--color-border)] bg-[var(--color-ink-2)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-text-faint)]">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Slug</th>
              <th className="px-5 py-3 font-normal">Products</th>
              <th className="px-5 py-3 font-normal">Age Restricted</th>
              <th className="px-5 py-3 font-normal">Featured</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-5 py-3">{c.name}</td>
                <td className="px-5 py-3 text-[var(--color-text-faint)]">/{c.slug}</td>
                <td className="px-5 py-3">{c.productCount}</td>
                <td className="px-5 py-3">{c.ageRestricted ? "Yes" : "No"}</td>
                <td className="px-5 py-3">{c.featured ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-[var(--color-text-faint)]">
        Category create/rename/reorder forms follow the same server-action
        pattern as Products — see lib/data/repository.ts adminCreateCategory /
        adminUpdateCategory / adminDeleteCategory.
      </p>
    </div>
  );
}
