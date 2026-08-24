import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:px-8">
      <p className="eyebrow mb-3">Account</p>
      <h1 className="font-display text-3xl text-[var(--color-text)]">
        {session.user?.name ?? session.user?.email}
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/account/orders"
          className="border border-[var(--color-border)] p-6 hover:border-[var(--color-brass)]"
        >
          <h2 className="font-display text-lg">Orders</h2>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">
            View order history
          </p>
        </Link>
        <Link
          href="/account/wishlist"
          className="border border-[var(--color-border)] p-6 hover:border-[var(--color-brass)]"
        >
          <h2 className="font-display text-lg">Wishlist</h2>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">
            Saved pieces
          </p>
        </Link>
        <div className="border border-[var(--color-border)] p-6">
          <h2 className="font-display text-lg">Addresses</h2>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">
            Manage shipping addresses
          </p>
        </div>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
        className="mt-12"
      >
        <button className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)]">
          Sign out
        </button>
      </form>
    </div>
  );
}
