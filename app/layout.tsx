import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuestHearing｜HP制作ヒアリングを冒険に変える",
  description:
    "ゲーム感覚で楽しく進められるHP制作のヒアリングツール。クライアントの想いを最短ルートで言語化します。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-ink-900 text-white antialiased">{children}</body>
    </html>
  );
}
