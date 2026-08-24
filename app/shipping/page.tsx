import type { Metadata } from "next";
import { ProsePage } from "@/components/ui/prose-page";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <ProsePage eyebrow="Support" title="Shipping">
      <p>
        Shipping zones, methods and rates are configured by the studio and
        calculated automatically at checkout based on your delivery address.
      </p>
      <h2>Processing time</h2>
      <p>
        Handmade pieces are finished to order in some cases — exact
        processing times are shown on each product page.
      </p>
      <h2>Restricted items</h2>
      <p>
        Certain categories (blades, some accessories) may carry destination
        restrictions. These are flagged on the relevant product pages and
        enforced at checkout.
      </p>
    </ProsePage>
  );
}
