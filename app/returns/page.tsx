import type { Metadata } from "next";
import { ProsePage } from "@/components/ui/prose-page";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <ProsePage eyebrow="Support" title="Returns">
      <p>
        Unworn, unused items in original condition can be returned within 14
        days of delivery for a refund to the original payment method.
      </p>
      <h2>Not eligible for return</h2>
      <p>
        Engraved or personalized pieces are made to order and are final
        sale, except in the case of a defect.
      </p>
      <h2>How to start a return</h2>
      <p>
        Contact us with your order number and we&apos;ll walk you through the
        process.
      </p>
    </ProsePage>
  );
}
