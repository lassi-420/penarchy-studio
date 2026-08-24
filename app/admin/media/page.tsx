import { listMedia } from "@/lib/data/repository";
import { MediaLibrary } from "@/components/admin/media-library";

export default async function AdminMediaPage() {
  const items = await listMedia();
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Media Library</h1>
      <MediaLibrary initialItems={items} />
    </div>
  );
}
