import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { getSiteSettings } from "@/lib/data/settings";
import { Providers } from "@/components/providers";

// NOTE: fonts.googleapis.com is not reachable from this sandbox, so we can't
// use next/font/google here. globals.css declares --font-display and
// --font-sans as system-font fallback stacks that approximate the intended
// pairing (Cormorant Garamond / Inter). Once deployed with normal internet
// access, swap in next/font/google (Cormorant_Garamond, Inter) the same way
// it was set up before — see git history / comments below.
//
// import { Inter, Cormorant_Garamond } from "next/font/google";
// const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
// const cormorant = Cormorant_Garamond({ variable: "--font-display", weight: ["400","500","600"], subsets: ["latin"] });
// then add `${inter.variable} ${cormorant.variable}` to the <html> className.

export const metadata: Metadata = {
  title: {
    default: "Penarchy Studio — Handcrafted Metalwork",
    template: "%s — Penarchy Studio",
  },
  description:
    "Damascus steel pens, hand-forged bracelets and artisan metal objects. Shaped by hand, finished with precision, made to be kept.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "Penarchy Studio",
    description:
      "Handcrafted Damascus steel, brass and copper objects — made to be kept.",
    siteName: "Penarchy Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--color-ink)] text-[var(--color-text)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: settings.brandName,
              url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: settings.brandName,
              url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
            }),
          }}
        />
        <Providers>
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        </Providers>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            },
          }}
        />
      </body>
    </html>
  );
}
