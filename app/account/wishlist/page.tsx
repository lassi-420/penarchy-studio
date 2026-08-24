"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addToCart = useCartStore((s) => s.addRawLine);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <p className="eyebrow mb-3">Account</p>
      <h1 className="font-display text-3xl text-[var(--color-text)] mb-10">
        Wishlist
      </h1>

      {items.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          body="Tap the heart icon on any product to save it here."
        />
      ) : (
        <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-5 py-5">
              <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-[var(--color-surface)]">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <Link
                  href={`/product/${item.productSlug}`}
                  className="text-sm text-[var(--color-text)] hover:text-[var(--color-brass-light)]"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {formatPrice(item.price, item.currency)}
                </p>
              </div>
              <button
                onClick={() => {
                  addToCart({
                    productId: item.productId,
                    productSlug: item.productSlug,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                  });
                  remove(item.productId);
                  toast(`Moved ${item.name} to bag`);
                }}
                className="border border-[var(--color-border-strong)] px-4 py-2 text-xs tracking-widest hover:border-[var(--color-brass)]"
              >
                MOVE TO BAG
              </button>
              <button
                onClick={() => remove(item.productId)}
                aria-label="Remove from wishlist"
                className="text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
