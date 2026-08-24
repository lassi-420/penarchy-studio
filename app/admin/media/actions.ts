"use server";

import { revalidatePath } from "next/cache";
import { updateMediaAltText, deleteMediaItem } from "@/lib/data/repository";
import { getMediaProvider } from "@/lib/media";

export async function updateMediaAltTextAction(id: string, altText: string) {
  await updateMediaAltText(id, altText);
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(id: string) {
  const item = await deleteMediaItem(id);
  if (item) {
    await getMediaProvider().delete(item.url);
  }
  revalidatePath("/admin/media");
}
