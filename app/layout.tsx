import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brief — HP制作のためのヒアリング",
  description:
    "クライアントの想いを、もっとシンプルに整える。HP制作のための専用ヒアリングツール。",
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
