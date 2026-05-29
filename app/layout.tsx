import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "./site-config";

const title = `${siteConfig.brand.name} — ${siteConfig.brand.role}`;
const description =
  "想いを聴いてから、サイトをつくる。HP制作のための、丁寧なヒアリングから始まるWeb制作。";

// Origin only — basePath is appended by Next automatically.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://playmark0227-svg.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s｜${siteConfig.brand.name}`,
  },
  description,
  applicationName: siteConfig.brand.name,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title,
    description,
    siteName: siteConfig.brand.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-white text-ink-700 antialiased">{children}</body>
    </html>
  );
}
