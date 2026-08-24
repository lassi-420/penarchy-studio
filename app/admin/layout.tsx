import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Reviews", href: "/admin/reviews" },
  { label: "Coupons", href: "/admin/coupons" },
  { label: "Shipping", href: "/admin/shipping" },
  { label: "Media", href: "/admin/media" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session || role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-ink-3)] text-[var(--color-text)]">
      <aside className="hidden w-56 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-ink-2)] md:block">
        <div className="px-6 py-6">
          <span className="font-display text-lg tracking-widest">
            PENARCHY ADMIN
          </span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-6 py-6">
          <Link href="/" className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)]">
            ← Back to storefront
          </Link>
        </div>
      </aside>
      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
