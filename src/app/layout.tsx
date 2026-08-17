import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AskPanel } from "@/components/layout/ask-panel";
import { siteConfig } from "@/lib/constants";
import "./globals.css";

// One family for both roles, per the Apple-style reference's own documented
// SF Pro Display / SF Pro Text fallback: Inter. Weight alone carries the
// display/body distinction — 700/800 for headlines, 400/500/600 for body.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// The one personal touch carried over from the original build: margin notes
// only, never body or UI (docs/05-design-brief.md §2).
const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  // Without this the card renders as a small square crop; the generated
  // opengraph-image is 1200x630 and wants the wide treatment.
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} scroll-smooth antialiased`}
    >
      <body className="bg-paper text-ink">
        {children}
        <AskPanel />
        {/* top-center, not bottom-right: the Ask launcher occupies that corner. */}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
