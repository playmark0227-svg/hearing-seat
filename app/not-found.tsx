import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 text-center text-ink-700">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          ページが見つかりません。
        </h1>
        <p className="mt-4 text-base text-ink-500">
          URLが変更されたか、削除された可能性があります。
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" />
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
