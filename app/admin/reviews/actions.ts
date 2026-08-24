"use server";

import { revalidatePath } from "next/cache";
import { moderateReview, deleteReview } from "@/lib/data/repository";

export async function approveReviewAction(id: string) {
  await moderateReview(id, "APPROVED");
  revalidatePath("/admin/reviews");
}

export async function rejectReviewAction(id: string) {
  await moderateReview(id, "REJECTED");
  revalidatePath("/admin/reviews");
}

export async function deleteReviewAction(id: string) {
  await deleteReview(id);
  revalidatePath("/admin/reviews");
}
