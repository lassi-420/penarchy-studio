"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

export interface CartLine {
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  price: number;
  variantId?: string;
  variantName?: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  couponCode: string | null;
  open: () => void;
  close: () => void;
  addItem: (product: Product, quantity?: number, variantId?: string) => void;
  addRawLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      couponCode: null,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      addItem: (product, quantity = 1, variantId) => {
        const variant = product.variants.find((v) => v.id === variantId);
        set((state) => {
          const existing = state.lines.find(
            (l) => l.productId === product.id && l.variantId === variantId
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l === existing ? { ...l, quantity: l.quantity + quantity } : l
              ),
              isOpen: true,
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                productId: product.id,
                productSlug: product.slug,
                name: product.name,
                image: product.images[0]?.url ?? "",
                price: product.price + (variant?.priceDiff ?? 0),
                variantId,
                variantName: variant?.name,
                quantity,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, variantId) =>
        set((state) => ({
          lines: state.lines.filter(
            (l) => !(l.productId === productId && l.variantId === variantId)
          ),
        })),

      addRawLine: (line, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.productId === line.productId && l.variantId === line.variantId
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l === existing ? { ...l, quantity: l.quantity + quantity } : l
              ),
              isOpen: true,
            };
          }
          return {
            lines: [...state.lines, { ...line, quantity }],
            isOpen: true,
          };
        }),

      updateQuantity: (productId, quantity, variantId) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.productId === productId && l.variantId === variantId
                ? { ...l, quantity: Math.max(0, quantity) }
                : l
            )
            .filter((l) => l.quantity > 0),
        })),

      applyCoupon: (code) => set({ couponCode: code.toUpperCase() }),
      removeCoupon: () => set({ couponCode: null }),
      clear: () => set({ lines: [], couponCode: null }),

      subtotal: () =>
        get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      itemCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "penarchy-cart" }
  )
);
