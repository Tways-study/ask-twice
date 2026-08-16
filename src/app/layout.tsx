import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AskPanel } from "@/components/layout/ask-panel";
import { siteConfig } from "@/lib/constants";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plusJakarta.variable} ${caveat.variable} scroll-smooth antialiased`}
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
