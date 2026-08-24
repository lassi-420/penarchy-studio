import Link from "next/link";

export default async function CheckoutConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center md:px-8">
      <p className="eyebrow mb-4">Order Confirmed</p>
      <h1 className="font-display text-4xl text-[var(--color-text)]">
        Thank you.
      </h1>
      <p className="mt-4 text-sm text-[var(--color-text-muted)]">
        Your order{" "}
        <span className="text-[var(--color-brass-light)]">{order ?? "—"}</span>{" "}
        has been received. A confirmation email will follow once email
        delivery is configured.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/shop"
          className="bg-[var(--color-brass)] px-8 py-3 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)]"
        >
          CONTINUE SHOPPING
        </Link>
        <Link
          href="/account/orders"
          className="border border-[var(--color-border-strong)] px-8 py-3 text-xs tracking-widest hover:border-[var(--color-brass)]"
        >
          VIEW ORDERS
        </Link>
      </div>
    </div>
  );
}
