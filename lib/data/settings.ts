import type { SiteSettings } from "@/lib/types";

// TODO(prisma): replace with `prisma.siteSetting.findMany()` mapped into this
// shape once the database is reachable. Kept as an async function so callers
// don't need to change when the backing store does.
const defaultSettings: SiteSettings = {
  brandName: "Penarchy Studio",
  tagline: "Handcrafted metalwork — made to be kept.",
  email: "hello@penarchystudio.com",
  phone: undefined,
  address: undefined,
  // Do NOT invent social handles — left empty until configured in
  // /admin/settings with real, owned accounts.
  socials: [],
  currency: "USD",
  freeShippingThreshold: 150,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  return defaultSettings;
}
