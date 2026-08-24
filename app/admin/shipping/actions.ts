"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createShippingMethod, deleteShippingMethod, updateShippingMethod } from "@/lib/data/repository";

const methodSchema = z.object({
  zoneName: z.string().min(1),
  name: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  freeShippingThreshold: z.coerce.number().optional(),
  estimatedDaysMin: z.coerce.number().int().positive(),
  estimatedDaysMax: z.coerce.number().int().positive(),
});

export async function createShippingMethodAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = methodSchema.parse(raw);
  await createShippingMethod({ ...parsed, active: true });
  revalidatePath("/admin/shipping");
}

export async function toggleShippingMethodAction(id: string, active: boolean) {
  await updateShippingMethod(id, { active });
  revalidatePath("/admin/shipping");
}

export async function deleteShippingMethodAction(id: string) {
  await deleteShippingMethod(id);
  revalidatePath("/admin/shipping");
}
