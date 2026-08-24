"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createCoupon, deleteCoupon, updateCoupon } from "@/lib/data/repository";

const couponSchema = z.object({
  code: z.string().min(2).transform((s) => s.toUpperCase()),
  type: z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING"]),
  value: z.coerce.number().nonnegative(),
  minOrderValue: z.coerce.number().optional(),
  usageLimit: z.coerce.number().int().optional(),
});

export async function createCouponAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = couponSchema.parse(raw);
  await createCoupon({ ...parsed, active: true });
  revalidatePath("/admin/coupons");
}

export async function toggleCouponAction(id: string, active: boolean) {
  await updateCoupon(id, { active });
  revalidatePath("/admin/coupons");
}

export async function deleteCouponAction(id: string) {
  await deleteCoupon(id);
  revalidatePath("/admin/coupons");
}
