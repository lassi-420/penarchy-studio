import type { Metadata } from "next";
import { ProsePage } from "@/components/ui/prose-page";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  {
    q: "Is every piece really unique?",
    a: "Yes. Damascus and Mokume Gane patterns form during forging, not afterward, so the exact pattern on your piece can't be exactly reproduced.",
  },
  {
    q: "Can I get a piece engraved?",
    a: "Most pens and bracelets support engraving as a variant option on the product page. Engraved and personalized items are final sale.",
  },
  {
    q: "What payment methods are accepted?",
    a: "Payment options are configured by the studio and shown at checkout — see our Payment methods for what's currently enabled.",
  },
  {
    q: "Do you ship internationally?",
    a: "Shipping zones and rates are configured in the admin dashboard and shown at checkout based on your address.",
  },
];

export default function FaqPage() {
  return (
    <ProsePage eyebrow="Support" title="Frequently Asked Questions">
      {FAQS.map((f) => (
        <div key={f.q}>
          <h2>{f.q}</h2>
          <p className="mt-2">{f.a}</p>
        </div>
      ))}
    </ProsePage>
  );
}
