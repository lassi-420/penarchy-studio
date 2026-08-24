"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminDuplicateProduct,
  adminUpdateProduct,
} from "@/lib/data/repository";
import type { Product } from "@/lib/types";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  categorySlug: z.string().min(1),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().optional(),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.coerce.boolean().optional(),
  bestSeller: z.coerce.boolean().optional(),
  newArrival: z.coerce.boolean().optional(),
  limitedEdition: z.coerce.boolean().optional(),
  quantity: z.coerce.number().int().nonnegative(),
});

export async function createProductAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.parse(raw);

  const product: Product = {
    id: `prod_${Date.now()}`,
    isDemoContent: true,
    name: parsed.name,
    slug: parsed.slug,
    sku: parsed.sku,
    categorySlug: parsed.categorySlug,
    collectionSlugs: [],
    description: parsed.description,
    shortDescription: parsed.shortDescription,
    price: parsed.price,
    compareAtPrice: parsed.compareAtPrice,
    currency: "USD",
    personalization: false,
    status: parsed.status,
    featured: !!parsed.featured,
    bestSeller: !!parsed.bestSeller,
    newArrival: !!parsed.newArrival,
    limitedEdition: !!parsed.limitedEdition,
    ageRestricted: false,
    images: [],
    variants: [],
    tags: [],
    inventory: { quantity: parsed.quantity, reserved: 0, lowStockThreshold: 3 },
    relatedSlugs: [],
  };

  await adminCreateProduct(product);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function updateProductAction(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.partial().parse(raw);

  await adminUpdateProduct(id, {
    ...parsed,
    inventory: parsed.quantity !== undefined
      ? { quantity: parsed.quantity, reserved: 0, lowStockThreshold: 3 }
      : undefined,
  });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function deleteProductAction(id: string) {
  await adminDeleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function duplicateProductAction(id: string) {
  await adminDuplicateProduct(id);
  revalidatePath("/admin/products");
}

export async function togglePublishAction(id: string, publish: boolean) {
  await adminUpdateProduct(id, { status: publish ? "PUBLISHED" : "DRAFT" });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
