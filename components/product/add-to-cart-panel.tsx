"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Heart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { cn } from "@/lib/utils";

export function AddToCartPanel({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.id));
  const router = useRouter();

  const inStock = product.inventory.quantity > product.inventory.reserved;
  const lowStock =
    inStock &&
    product.inventory.quantity - product.inventory.reserved <=
      product.inventory.lowStockThreshold;

  return (
    <div className="space-y-6">
      <p
        className={cn(
          "text-xs tracking-wide",
          inStock ? "text-[var(--color-text-muted)]" : "text-red-400"
        )}
      >
        {!inStock
          ? "Out of stock"
          : lowStock
          ? `Low in stock — only ${product.inventory.quantity - product.inventory.reserved} left`
          : "In stock"}
      </p>

      {product.variants.length > 1 && (
        <div>
          <label className="eyebrow mb-3 block">Options</label>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                disabled={!v.inStock}
                className={cn(
                  "border px-4 py-2 text-xs transition-colors",
                  variantId === v.id
                    ? "border-[var(--color-brass)] text-[var(--color-brass-light)]"
                    : "border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:border-[var(--color-brass)]",
                  !v.inStock && "cursor-not-allowed opacity-40"
                )}
              >
                {v.name}
                {v.priceDiff > 0 ? ` (+$${v.priceDiff.toFixed(2)})` : ""}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-[var(--color-border-strong)]">
          <button
            className="p-3"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            className="p-3"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          disabled={!inStock}
          onClick={() => {
            addItem(product, quantity, variantId);
            toast(`Added ${product.name} to bag`);
          }}
          className="flex-1 bg-[var(--color-text)] py-3.5 text-xs tracking-widest text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brass-light)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ADD TO CART
        </button>

        <button
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => {
            toggleWishlist(product);
            toast(inWishlist ? "Removed from wishlist" : "Added to wishlist");
          }}
          className={cn(
            "border p-3.5 transition-colors",
            inWishlist
              ? "border-[var(--color-brass)] text-[var(--color-brass-light)]"
              : "border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:border-[var(--color-brass)] hover:text-[var(--color-brass-light)]"
          )}
        >
          <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
        </button>
      </div>

      <button
        disabled={!inStock}
        onClick={() => {
          addItem(product, quantity, variantId);
          router.push("/checkout");
        }}
        className="w-full border border-[var(--color-border-strong)] py-3.5 text-xs tracking-widest text-[var(--color-text)] transition-colors hover:border-[var(--color-brass)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        BUY NOW
      </button>
    </div>
  );
}
