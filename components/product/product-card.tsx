"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { toast } from "sonner";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.id));
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];

  return (
    <div className={cn("group relative", className)}>
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-surface)]">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={cn(
                "object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]",
                secondaryImage && "group-hover:opacity-0"
              )}
            />
          )}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.altText || product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.limitedEdition && (
              <span className="bg-[var(--color-ink)]/80 px-2 py-1 text-[10px] tracking-widest text-[var(--color-brass-light)]">
                LIMITED
              </span>
            )}
            {product.newArrival && !product.limitedEdition && (
              <span className="bg-[var(--color-ink)]/80 px-2 py-1 text-[10px] tracking-widest text-[var(--color-text)]">
                NEW
              </span>
            )}
            {product.bestSeller && !product.newArrival && !product.limitedEdition && (
              <span className="bg-[var(--color-ink)]/80 px-2 py-1 text-[10px] tracking-widest text-[var(--color-text)]">
                BESTSELLER
              </span>
            )}
          </div>

          <button
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
              toast(inWishlist ? "Removed from wishlist" : "Added to wishlist");
            }}
            className={cn(
              "absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-[var(--color-ink)]/70 transition-opacity",
              inWishlist
                ? "text-[var(--color-brass-light)] opacity-100"
                : "text-[var(--color-text)] opacity-0 group-hover:opacity-100"
            )}
          >
            <Heart size={14} fill={inWishlist ? "currentColor" : "none"} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product, 1, product.variants[0]?.id);
              toast(`Added ${product.name} to bag`);
            }}
            className="absolute inset-x-3 bottom-3 translate-y-2 bg-[var(--color-text)] py-2.5 text-center text-xs tracking-widest text-[var(--color-ink)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            QUICK ADD
          </button>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-[11px] uppercase tracking-widest text-[var(--color-text-faint)]">
            {product.categorySlug.replace(/-/g, " ")}
          </p>
          <h3 className="text-sm text-[var(--color-text)] transition-colors group-hover:text-[var(--color-brass-light)]">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-text)]">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[var(--color-text-faint)] line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
