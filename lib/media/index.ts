// ============================================================================
// MEDIA STORAGE ABSTRACTION
// Local provider writes to /public/uploads (fine for a single-instance
// deploy or local dev). Swap MEDIA_PROVIDER in .env for S3/Cloudinary in
// production so uploads survive redeploys and scale across instances.
// ============================================================================

import fs from "node:fs/promises";
import path from "node:path";

export interface UploadResult {
  url: string;
  filename: string;
  width?: number;
  height?: number;
  mimeType: string;
}

export interface MediaProvider {
  upload(file: File): Promise<UploadResult>;
  delete(url: string): Promise<void>;
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const localProvider: MediaProvider = {
  async upload(file) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const ext = path.extname(file.name) || "";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, safeName), buffer);
    return {
      url: `/uploads/${safeName}`,
      filename: safeName,
      mimeType: file.type,
    };
  },
  async delete(url) {
    const filename = url.split("/").pop();
    if (!filename) return;
    await fs.unlink(path.join(UPLOAD_DIR, filename)).catch(() => {});
  },
};

// const s3Provider: MediaProvider = { async upload(file) { /* AWS SDK PutObject using S3_* env vars */ }, async delete(url) { /* DeleteObject */ } };

export function getMediaProvider(): MediaProvider {
  const providerId = process.env.MEDIA_PROVIDER ?? "local";
  switch (providerId) {
    case "local":
    default:
      return localProvider;
  }
}

// Restrict uploads to safe, expected image MIME types (security requirement).
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
