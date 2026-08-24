import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMediaProvider, ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/media";
import { createMediaItem } from "@/lib/data/repository";

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const provider = getMediaProvider();
  const result = await provider.upload(file);
  const media = await createMediaItem({
    url: result.url,
    filename: result.filename,
    mimeType: result.mimeType,
    altText: (formData.get("altText") as string) ?? "",
  });

  return NextResponse.json({ media });
}
