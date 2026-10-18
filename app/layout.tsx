import type { Metadata } from "next";
import "./globals.css";
import AOSProvider from "@/components/AOSProvider";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Dammys Essence",
  description:
    "More than a scent, it's an essence. Discover fragrances and eyewear curated for your identity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AOSProvider />

        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}