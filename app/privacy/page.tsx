import type { Metadata } from "next";
import { ProsePage } from "@/components/ui/prose-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <ProsePage eyebrow="Legal" title="Privacy Policy">
      <p>
        This is a placeholder privacy policy. Replace this content in
        /admin/settings with your studio&apos;s actual data practices before
        launch — including what customer data is collected, how it&apos;s used,
        and any third parties (payment processors, analytics, email
        providers) it&apos;s shared with.
      </p>
    </ProsePage>
  );
}
