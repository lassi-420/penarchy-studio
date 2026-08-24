"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Category, Product } from "@/lib/types";

export function ProductForm({
  product,
  categories,
  action,
}: {
  product?: Product;
  categories: Category[];
  action: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();

  return (
    <form
      action={async (formData) => {
        try {
          await action(formData);
          toast(product ? "Product updated" : "Product created");
          router.push("/admin/products");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Something went wrong");
        }
      }}
      className="max-w-2xl space-y-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={product?.name} required />
        <Field label="Slug" name="slug" defaultValue={product?.slug} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="SKU" name="sku" defaultValue={product?.sku} required />
        <div>
          <label className="eyebrow mb-2 block">Category</label>
          <select
            name="categorySlug"
            defaultValue={product?.categorySlug}
            required
            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-ink)] px-3 py-2.5 text-sm"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field
          label="Price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price}
          required
        />
        <Field
          label="Compare-at Price"
          name="compareAtPrice"
          type="number"
          step="0.01"
          defaultValue={product?.compareAtPrice}
        />
        <Field
          label="Quantity"
          name="quantity"
          type="number"
          defaultValue={product?.inventory.quantity}
          required
        />
      </div>
      <div>
        <label className="eyebrow mb-2 block">Short Description</label>
        <input
          name="shortDescription"
          defaultValue={product?.shortDescription}
          className="w-full border border-[var(--color-border-strong)] bg-transparent px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="eyebrow mb-2 block">Description</label>
        <textarea
          name="description"
          defaultValue={product?.description}
          required
          rows={5}
          className="w-full border border-[var(--color-border-strong)] bg-transparent px-3 py-2.5 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-6">
        {[
          ["featured", "Featured"],
          ["bestSeller", "Best Seller"],
          ["newArrival", "New Arrival"],
          ["limitedEdition", "Limited Edition"],
        ].map(([name, label]) => (
          <label key={name} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={name}
              defaultChecked={(product as unknown as Record<string, boolean>)?.[name]}
            />
            {label}
          </label>
        ))}
      </div>
      <div>
        <label className="eyebrow mb-2 block">Status</label>
        <select
          name="status"
          defaultValue={product?.status ?? "DRAFT"}
          className="w-full border border-[var(--color-border-strong)] bg-[var(--color-ink)] px-3 py-2.5 text-sm"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
      <p className="text-xs text-[var(--color-text-faint)]">
        Image upload connects to the Media Library once file storage
        (S3/local) is configured — see lib/media.
      </p>
      <button className="bg-[var(--color-brass)] px-8 py-3 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)]">
        {product ? "SAVE CHANGES" : "CREATE PRODUCT"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  required?: boolean;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="eyebrow mb-2 block">{label}</label>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        required={required}
        className="w-full border border-[var(--color-border-strong)] bg-transparent px-3 py-2.5 text-sm"
      />
    </div>
  );
}
