export function EmptyState({
  title,
  body,
}: {
  title: string;
  body?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-[var(--color-border)] px-8 py-24 text-center">
      <p className="font-display text-2xl text-[var(--color-text)]">{title}</p>
      {body && (
        <p className="mt-3 max-w-sm text-sm text-[var(--color-text-faint)]">
          {body}
        </p>
      )}
    </div>
  );
}
