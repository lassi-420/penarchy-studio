import Image from "next/image";
import Link from "next/link";

const IMG =
  "https://i.etsystatic.com/55454115/r/il/70b81d/7108810286/il_1080xN.7108810286_oycl.jpg";

export function CraftsmanshipSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="relative aspect-square md:aspect-auto">
        <Image
          src={IMG}
          alt="Close detail of hand-forged layered metal pattern"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center bg-[var(--color-ink-2)] px-8 py-16 md:px-16">
        <p className="eyebrow mb-4">The Process</p>
        <h2 className="font-display text-3xl leading-tight text-[var(--color-text)] md:text-4xl">
          Forged, not printed.
        </h2>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--color-text-muted)]">
          Every pattern in the metal begins as raw billet — layered, forged,
          folded and hammered by hand until the grain emerges. What follows is
          heat treatment, shaping, hand finishing, polishing and a final
          inspection before anything leaves the bench. No two pieces are
          identical, because none of them were made by machine.
        </p>
        <Link
          href="/craftsmanship"
          className="link-underline mt-8 inline-block w-fit text-xs tracking-widest text-[var(--color-brass-light)]"
        >
          READ ABOUT OUR CRAFT
        </Link>
      </div>
    </section>
  );
}
