import { adminListProducts, listCategories } from "@/lib/data/repository";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([
    adminListProducts(),
    listCategories(),
  ]);

  const published = products.filter((p) => p.status === "PUBLISHED");
  const lowStock = products.filter(
    (p) => p.inventory.quantity <= p.inventory.lowStockThreshold
  );
  const catalogValue = published.reduce(
    (sum, p) => sum + p.price * p.inventory.quantity,
    0
  );

  const cards = [
    { label: "Published Products", value: published.length },
    { label: "Draft Products", value: products.length - published.length },
    { label: "Categories", value: categories.length },
    { label: "Low Stock Items", value: lowStock.length },
    { label: "Inventory Value", value: formatPrice(catalogValue) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className="border border-[var(--color-border)] bg-[var(--color-ink-2)] p-5"
          >
            <p className="text-xs text-[var(--color-text-faint)]">{c.label}</p>
            <p className="mt-2 text-2xl font-display">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 border border-[var(--color-border)] bg-[var(--color-ink-2)]">
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="text-sm tracking-widest text-[var(--color-text-faint)]">
            LOW STOCK
          </h2>
        </div>
        {lowStock.length === 0 ? (
          <p className="px-5 py-8 text-sm text-[var(--color-text-faint)]">
            Nothing is currently low on stock.
          </p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {lowStock.map((p) => (
                <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-5 py-3">{p.name}</td>
                  <td className="px-5 py-3 text-[var(--color-text-faint)]">{p.sku}</td>
                  <td className="px-5 py-3 text-right text-red-400">
                    {p.inventory.quantity} left
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-8 text-xs text-[var(--color-text-faint)]">
        Sales, revenue-by-period and order-status charts populate once the
        order pipeline is connected to a live database — see README for the
        Prisma migration path.
      </p>
    </div>
  );
}
