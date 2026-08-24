"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

export interface WishlistLine {
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  addedAt: number;
}

interface WishlistState {
  items: WishlistLine[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  toggle: (product: Product) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product) =>
        set((state) => {
          if (state.items.some((i) => i.productId === product.id)) return state;
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                productSlug: product.slug,
                name: product.name,
                image: product.images[0]?.url ?? "",
                price: product.price,
                currency: product.currency,
                addedAt: Date.now(),
              },
            ],
          };
        }),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      toggle: (product) => {
        if (get().has(product.id)) {
          get().remove(product.id);
        } else {
          get().add(product);
        }
      },

      has: (productId) => get().items.some((i) => i.productId === productId),

      clear: () => set({ items: [] }),
    }),
    { name: "penarchy-wishlist" }
  )
);
