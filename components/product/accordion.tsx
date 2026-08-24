"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
      {items.map((item, i) => (
        <div key={item.title}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-4 text-left"
          >
            <span className="text-xs tracking-widest text-[var(--color-text)]">
              {item.title}
            </span>
            <ChevronDown
              size={14}
              className={cn(
                "text-[var(--color-text-faint)] transition-transform",
                open === i && "rotate-180"
              )}
            />
          </button>
          {open === i && (
            <p className="pb-5 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {item.body}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
