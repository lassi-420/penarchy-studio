import type { Metadata } from "next";
import { ProsePage } from "@/components/ui/prose-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <ProsePage eyebrow="Legal" title="Terms of Service">
      <p>
        This is a placeholder terms of service. Replace this content in
        /admin/settings with your studio&apos;s actual terms — covering orders,
        pricing, intellectual property over designs and photography, and
        limitation of liability — ideally reviewed by counsel before launch.
      </p>
    </ProsePage>
  );
}
