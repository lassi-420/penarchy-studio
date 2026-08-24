import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Craftsmanship",
  description: "How Penarchy Studio pieces are forged, shaped, finished and inspected by hand.",
};

const SECTIONS = [
  {
    title: "THE MATERIAL",
    body: "Every piece begins as raw stock — carbon steel billets for Damascus work, sheet brass and copper for Mokume Gane, solid bar stock for bracelets. The material dictates the process, not the other way around.",
    image:
      "https://i.etsystatic.com/55454115/r/il/f6aae4/7159277527/il_1080xN.7159277527_fb00.jpg",
  },
  {
    title: "THE FORGE",
    body: "Layers of steel are stacked, heated and forge-welded together, then folded and drawn out repeatedly. This is what builds the pattern inside Damascus steel — it isn't printed or etched on afterward.",
    image:
      "https://i.etsystatic.com/55454115/r/il/ab9564/7156622301/il_1080xN.7156622301_l2y0.jpg",
  },
  {
    title: "THE PATTERN",
    body: "Once the billet is drawn to size, the surface is ground and etched to reveal the pattern trapped inside the steel. No two billets forge exactly the same way, so no two patterns are identical.",
    image:
      "https://i.etsystatic.com/55454115/r/il/70b81d/7108810286/il_1080xN.7108810286_oycl.jpg",
  },
  {
    title: "THE FINISH",
    body: "Surfaces are hand-sanded through a series of grits, then polished or left with a hand-hammered texture depending on the piece. This stage alone can take longer than the forging itself.",
    image:
      "https://i.etsystatic.com/55454115/r/il/c53de9/7069203884/il_1080xN.7069203884_l50e.jpg",
  },
  {
    title: "THE DETAILS",
    body: "Clips, nibs, closures and fittings are shaped and fitted by hand to each individual piece — nothing is force-fit from a generic parts bin.",
    image:
      "https://i.etsystatic.com/55454115/r/il/64bcf6/7694923347/il_1080xN.7694923347_n284.jpg",
  },
  {
    title: "THE FINAL INSPECTION",
    body: "Before anything ships, each piece is checked by hand for finish, fit and function. What doesn&apos;t meet the standard doesn't go out.",
    image:
      "https://i.etsystatic.com/55454115/r/il/871a62/7117155875/il_1080xN.7117155875_9q2r.jpg",
  },
];

export default function CraftsmanshipPage() {
  return (
    <div>
      <div className="border-b border-[var(--color-border)] px-5 py-24 text-center md:px-8">
        <p className="eyebrow mb-4">How It&apos;s Made</p>
        <h1 className="font-display text-4xl text-[var(--color-text)] md:text-5xl">
          Craftsmanship
        </h1>
      </div>

      {SECTIONS.map((s, i) => (
        <section
          key={s.title}
          className={`grid grid-cols-1 md:grid-cols-2 ${
            i % 2 === 1 ? "md:[direction:rtl]" : ""
          }`}
        >
          <div className="relative aspect-square md:aspect-auto">
            <Image src={s.image} alt={s.title} fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center bg-[var(--color-ink-2)] px-8 py-16 md:px-16 md:[direction:ltr]">
            <span className="text-xs text-[var(--color-brass-light)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-2 font-display text-3xl text-[var(--color-text)]">
              {s.title}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--color-text-muted)]">
              {s.body}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}
