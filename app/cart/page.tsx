"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";

export default function CartPage() {
  const { lines, updateQuantity, removeItem, subtotal, couponCode, applyCoupon, removeCoupon } =
    useCartStore();
  const [couponInput, setCouponInput] = useState("");

  const shippingEstimate = subtotal() >= 150 || subtotal() === 0 ? 0 : 12;
  const discount = couponCode === "WELCOME10" ? subtotal() * 0.1 : 0;
  const total = subtotal() - discount + shippingEstimate;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 md:px-8">
        <EmptyState
          title="Your bag is empty"
          body="Explore the collection to find something worth keeping."
        />
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-block bg-[var(--color-brass)] px-8 py-3 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)]"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
      <h1 className="font-display text-4xl text-[var(--color-text)]">
        Shopping Bag
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {lines.map((line) => (
            <div
              key={`${line.productId}-${line.variantId ?? "base"}`}
              className="flex gap-5 py-6"
            >
              <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden bg-[var(--color-surface)]">
                {line.image && (
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <Link
                      href={`/product/${line.productSlug}`}
                      className="text-[var(--color-text)] hover:text-[var(--color-brass-light)]"
                    >
                      {line.name}
                    </Link>
                    {line.variantName && (
                      <p className="text-xs text-[var(--color-text-faint)] mt-1">
                        {line.variantName}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(line.productId, line.variantId)}
                    aria-label="Remove item"
                    className="text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-[var(--color-border-strong)]">
                    <button
                      className="p-2"
                      onClick={() =>
                        updateQuantity(line.productId, line.quantity - 1, line.variantId)
                      }
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm">{line.quantity}</span>
                    <button
                      className="p-2"
                      onClick={() =>
                        updateQuantity(line.productId, line.quantity + 1, line.variantId)
                      }
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm text-[var(--color-text)]">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="border border-[var(--color-border)] p-6">
            <h2 className="eyebrow mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Subtotal</span>
                <span>{formatPrice(subtotal())}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[var(--color-brass-light)]">
                  <span>Discount ({couponCode})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">
                  Estimated shipping
                </span>
                <span>{shippingEstimate === 0 ? "Free" : formatPrice(shippingEstimate)}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--color-border)] pt-3 text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 border border-[var(--color-border-strong)] bg-transparent px-3 py-2 text-sm focus:border-[var(--color-brass)] focus:outline-none"
              />
              <button
                onClick={() => {
                  if (!couponInput) return;
                  if (couponInput.toUpperCase() === "WELCOME10") {
                    applyCoupon(couponInput);
                    toast("Coupon applied");
                  } else {
                    toast.error("Invalid coupon code");
                  }
                }}
                className="border border-[var(--color-border-strong)] px-4 text-xs tracking-widest hover:border-[var(--color-brass)]"
              >
                APPLY
              </button>
            </div>
            {couponCode && (
              <button
                onClick={() => {
                  removeCoupon();
                  setCouponInput("");
                }}
                className="mt-2 text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
              >
                Remove coupon
              </button>
            )}

            <Link
              href="/checkout"
              className="mt-6 block w-full bg-[var(--color-brass)] py-3.5 text-center text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)]"
            >
              CHECKOUT
            </Link>
          </div>
          <Link
            href="/shop"
            className="link-underline block text-center text-xs tracking-widest text-[var(--color-text-muted)]"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
}
