import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The studio behind Penarchy — handcrafted metalwork, one piece at a time.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 md:px-8">
      <p className="eyebrow mb-4">About the Studio</p>
      <h1 className="font-display text-4xl leading-tight text-[var(--color-text)] md:text-5xl">
        Objects made by hand,
        <br />
        for people who keep things.
      </h1>

      <div className="mt-12 space-y-6 text-sm leading-relaxed text-[var(--color-text-muted)]">
        <p>
          Penarchy Studio makes pens, bracelets and small metal objects from
          Damascus steel, brass, copper and titanium. Every piece is forged,
          shaped, finished and assembled by hand — nothing here is cast from
          a mold or produced on a line.
        </p>
        <p>
          The work draws on traditional metalworking techniques: pattern
          welding, hand hammering, Mokume Gane fusion, heat treatment and
          hand polishing. These are slow processes, and that is intentional
          — the variation between one piece and the next is part of what
          makes each one worth keeping.
        </p>
        <p>
          This page will be extended with more of the studio&apos;s story as
          content is added through the CMS. What stays constant is the
          approach: real materials, real hands, and no shortcuts that would
          change what the piece actually is.
        </p>
      </div>
    </div>
  );
}
