import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "./site-config";

export const metadata: Metadata = {
  title: `${siteConfig.brand.name} — ${siteConfig.brand.role}`,
  description:
    "想いを聴いてから、サイトをつくる。HP制作のための、丁寧なヒアリングから始まるWeb制作。",
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
