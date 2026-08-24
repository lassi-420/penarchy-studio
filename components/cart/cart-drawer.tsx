"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, close, lines, updateQuantity, removeItem, subtotal } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={close}
        aria-hidden
      />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-[var(--color-ink-2)] border-l border-[var(--color-border)]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <h2 className="font-display text-xl">Your Bag</h2>
          <button onClick={close} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-[var(--color-text-muted)]">Your bag is empty.</p>
            <Link
              href="/shop"
              onClick={close}
              className="text-sm text-[var(--color-brass-light)] link-underline"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {lines.map((line) => (
                <div
                  key={`${line.productId}-${line.variantId ?? "base"}`}
                  className="flex gap-4"
                >
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-[var(--color-surface)]">
                    {line.image && (
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${line.productSlug}`}
                        onClick={close}
                        className="text-sm text-[var(--color-text)] hover:text-[var(--color-brass-light)]"
                      >
                        {line.name}
                      </Link>
                      {line.variantName && (
                        <p className="text-xs text-[var(--color-text-faint)]">
                          {line.variantName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-[var(--color-border)]">
                        <button
                          className="p-1.5"
                          onClick={() =>
                            updateQuantity(
                              line.productId,
                              line.quantity - 1,
                              line.variantId
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs w-4 text-center">
                          {line.quantity}
                        </span>
                        <button
                          className="p-1.5"
                          onClick={() =>
                            updateQuantity(
                              line.productId,
                              line.quantity + 1,
                              line.variantId
                            )
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm">
                        {formatPrice(line.price * line.quantity)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeItem(line.productId, line.variantId)}
                      className="self-start text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-border)] px-6 py-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Subtotal</span>
                <span>{formatPrice(subtotal())}</span>
              </div>
              <p className="text-xs text-[var(--color-text-faint)]">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={close}
                className="block w-full bg-[var(--color-brass)] py-3 text-center text-sm tracking-wide text-[var(--color-ink)] hover:bg-[var(--color-brass-light)] transition-colors"
              >
                CHECKOUT
              </Link>
              <Link
                href="/cart"
                onClick={close}
                className="block w-full border border-[var(--color-border-strong)] py-3 text-center text-sm tracking-wide hover:border-[var(--color-brass)] transition-colors"
              >
                VIEW BAG
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
