"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const HERO_IMAGE =
  "https://i.etsystatic.com/55454115/r/il/ab9564/7156622301/il_1080xN.7156622301_l2y0.jpg";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-[var(--color-ink)]">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Hand-forged Damascus steel fountain pen"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/40 to-[var(--color-ink)]/10" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow mb-5"
        >
          Handcrafted Metalwork
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl leading-[1.05] text-[var(--color-text)] sm:text-6xl md:text-7xl"
        >
          Engineered by hand.
          <br />
          Built to last.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--color-text-muted)]"
        >
          Objects made from steel, brass and copper — shaped by hand, finished
          with precision, and designed to be kept.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Link
            href="/shop"
            className="bg-[var(--color-brass)] px-8 py-3.5 text-xs tracking-[0.15em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-brass-light)]"
          >
            EXPLORE COLLECTION
          </Link>
          <Link
            href="/craftsmanship"
            className="link-underline border border-[var(--color-border-strong)] px-8 py-3.5 text-xs tracking-[0.15em] text-[var(--color-text)]"
          >
            OUR CRAFT
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
