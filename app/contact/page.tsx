import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-8">
      <p className="eyebrow mb-4">Get in Touch</p>
      <h1 className="font-display text-4xl text-[var(--color-text)] mb-4">
        Contact
      </h1>
      <p className="mb-10 text-sm text-[var(--color-text-muted)]">
        Questions about a piece, a custom commission, or an order — reach us
        directly at{" "}
        <a
          href={`mailto:${settings.email}`}
          className="text-[var(--color-brass-light)] link-underline"
        >
          {settings.email}
        </a>{" "}
        or use the form below.
      </p>
      <ContactForm />
    </div>
  );
}
