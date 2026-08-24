"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import type { MediaItem } from "@/lib/data/repository";
import { updateMediaAltTextAction, deleteMediaAction } from "@/app/admin/media/actions";

export function MediaLibrary({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/media", { method: "POST", body: formData });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Upload failed");
        setItems((prev) => [body.media, ...prev]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      }
    }
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div>
      <div className="mb-8 border border-dashed border-[var(--color-border-strong)] p-8 text-center">
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
          id="media-upload"
        />
        <label
          htmlFor="media-upload"
          className="cursor-pointer text-xs tracking-widest text-[var(--color-brass-light)]"
        >
          {uploading ? "UPLOADING…" : "CLICK TO UPLOAD IMAGES"}
        </label>
        <p className="mt-2 text-xs text-[var(--color-text-faint)]">
          JPEG, PNG, WebP, AVIF, GIF — max 10MB each
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-text-faint)]">
          No media uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {items.map((item) => (
            <div key={item.id} className="border border-[var(--color-border)]">
              <div className="relative aspect-square bg-[var(--color-surface)]">
                <Image src={item.url} alt={item.altText || item.filename} fill className="object-cover" />
              </div>
              <div className="p-2 space-y-1.5">
                <input
                  defaultValue={item.altText}
                  placeholder="Alt text"
                  onBlur={(e) =>
                    startTransition(async () => {
                      await updateMediaAltTextAction(item.id, e.target.value);
                    })
                  }
                  className="w-full border border-[var(--color-border-strong)] bg-transparent px-2 py-1 text-xs"
                />
                <div className="flex justify-between text-xs">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.url);
                      toast("URL copied");
                    }}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    Copy URL
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await deleteMediaAction(item.id);
                        setItems((prev) => prev.filter((i) => i.id !== item.id));
                      })
                    }
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
