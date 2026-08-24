import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitReview } from "@/lib/data/repository";
import { auth } from "@/lib/auth";

const schema = z.object({
  productSlug: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const session = await auth();

  // verifiedPurchase would check the user's Order history for this product
  // once orders are backed by a live database.
  const review = await submitReview({
    productSlug: parsed.data.productSlug,
    rating: parsed.data.rating,
    title: parsed.data.title,
    body: parsed.data.body,
    verifiedPurchase: false,
  });

  return NextResponse.json({ review, userEmail: session?.user?.email ?? null });
}
