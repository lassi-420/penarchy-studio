export function ProsePage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-8">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h1 className="font-display text-4xl text-[var(--color-text)] mb-10">
        {title}
      </h1>
      <div className="space-y-6 text-sm leading-relaxed text-[var(--color-text-muted)] [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-[var(--color-text)] [&_h2]:pt-4">
        {children}
      </div>
    </div>
  );
}
