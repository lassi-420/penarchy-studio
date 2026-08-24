"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import type { SiteSettings } from "@/lib/types";
import { CartDrawer } from "@/components/cart/cart-drawer";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Craftsmanship", href: "/craftsmanship" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
];

export function Header({ settings }: { settings: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
          scrolled
            ? "bg-[var(--color-ink)]/95 backdrop-blur border-b border-[var(--color-border)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link
            href="/"
            className="font-display text-xl tracking-[0.15em] text-[var(--color-text)]"
          >
            {settings.brandName.toUpperCase()}
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-underline text-sm tracking-wide text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="hidden sm:inline-flex text-[var(--color-text-muted)] hover:text-[var(--color-brass-light)] transition-colors"
            >
              <Search size={18} />
            </button>
            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="hidden sm:inline-flex text-[var(--color-text-muted)] hover:text-[var(--color-brass-light)] transition-colors"
            >
              <Heart size={18} />
            </Link>
            <button
              aria-label="Cart"
              onClick={openCart}
              className="relative text-[var(--color-text-muted)] hover:text-[var(--color-brass-light)] transition-colors"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-brass)] text-[10px] font-medium text-[var(--color-ink)]">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              aria-label="Menu"
              className="md:hidden text-[var(--color-text)]"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--color-ink)] flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
            <span className="font-display text-lg tracking-[0.15em]">
              {settings.brandName.toUpperCase()}
            </span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-6 px-6 py-10">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-3xl text-[var(--color-text)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <CartDrawer />
    </>
  );
}
