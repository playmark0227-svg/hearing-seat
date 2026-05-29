"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardList,
  Copy,
  Link as LinkIcon,
  Sparkles,
  Wand2,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

export default function LandingPage() {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      setShareUrl(`${window.location.origin}${base}/hearing/`);
    }
  }, []);

  const copy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <main className="min-h-screen bg-white text-ink-700">
      {/* ───────── Header ───────── */}
      <header className="sticky top-0 z-40 border-b border-ink-100/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-xl bg-ink-700 text-[11px] font-bold text-white">
              B
            </span>
            <span className="text-base font-semibold tracking-tight text-ink-700">
              Brief
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-ink-600 md:flex">
            <a href="#feature" className="transition hover:text-ink-700">
              特徴
            </a>
            <a href="#how" className="transition hover:text-ink-700">
              使い方
            </a>
            <a href="#share" className="transition hover:text-ink-700">
              共有
            </a>
          </nav>
          <Link
            href="/hearing"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-800"
          >
            開始する
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 pb-28 pt-24 text-center sm:pt-36">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow"
          >
            HP制作のための、ヒアリング
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="mt-6 font-display text-5xl font-semibold leading-[1.04] tracking-tightest text-ink-700 sm:text-7xl"
          >
            ヒアリングを、
            <br />
            <span className="text-ink-500">もっと、シンプルに。</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-500 sm:text-xl"
          >
            Brief は、HP制作のヒアリングをデザインしなおしたツールです。
            <br className="hidden sm:block" />
            約5分の選択式で、要件と想いをまとめます。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/hearing" className="btn-primary">
              ヒアリングを始める
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#share" className="btn-ghost">
              <LinkIcon className="h-4 w-4" />
              共有用リンクを取得
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-xs text-ink-400"
          >
            登録不要・無料・ブラウザだけで完結
          </motion.p>
        </div>

        {/* Product visual */}
        <div className="relative mx-auto -mb-24 max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-x-12 top-8 -z-10 h-64 rounded-[3rem] bg-gradient-to-br from-accent-soft via-ink-100 to-white blur-3xl" />
            <ProductPreview />
          </motion.div>
        </div>
      </section>

      {/* ───────── Why ───────── */}
      <section className="bg-ink-100 px-6 pb-24 pt-44">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-center">なぜ Brief か</p>
          <h2 className="mt-4 text-center font-display text-3xl font-semibold leading-tight tracking-tight text-ink-700 sm:text-5xl">
            ヒアリングが、止まらない。
            <br />
            <span className="text-ink-500">最後まで、気持ちよく。</span>
          </h2>

          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-ink-200 sm:grid-cols-3">
            {[
              {
                k: "01",
                t: "迷わない選択式",
                d: "ほぼ全ての質問が選択式。考えこまずに、直感のままに答えられます。",
              },
              {
                k: "02",
                t: "自分のペースで",
                d: "ブラウザに自動保存。途中で離れても続きから再開できます。",
              },
              {
                k: "03",
                t: "そのまま要件書に",
                d: "完了時に整形済みのサマリーを生成。提案書の下書きにそのまま使えます。",
              },
            ].map((b) => (
              <div key={b.k} className="bg-white p-8 sm:p-10">
                <div className="text-xs font-semibold tracking-widest text-accent">
                  {b.k}
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink-700">
                  {b.t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {b.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Features detail ───────── */}
      <section id="feature" className="px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">Features</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink-700 sm:text-6xl">
            7つの章で、抜け漏れなく。
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-ink-500">
            基本情報から予算まで、HP制作に必要な要件を順序立ててお聞きします。
          </p>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "01", t: "基本情報", d: "会社・サービス・担当者" },
              { n: "02", t: "目的とゴール", d: "サイトで達成したいこと" },
              { n: "03", t: "ターゲット", d: "届けたい相手と動かしたい行動" },
              { n: "04", t: "デザインの方向性", d: "イメージワードとカラー" },
              { n: "05", t: "構成と機能", d: "必要なページと機能" },
              { n: "06", t: "素材・コンテンツ", d: "原稿・写真・ロゴの状況" },
              { n: "07", t: "スケジュールと予算", d: "公開時期・予算・運用" },
            ].map((q) => (
              <div
                key={q.n}
                className="group rounded-3xl border border-ink-150 bg-white p-6 transition hover:border-ink-300 hover:shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-ink-400">
                    {q.n}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-ink-300 transition group-hover:text-ink-700" />
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink-700">
                  {q.t}
                </h3>
                <p className="mt-1 text-sm text-ink-500">{q.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section id="how" className="bg-ink-100 px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-700 sm:text-6xl">
            手順は、3つだけ。
          </h2>

          <ol className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                n: "Step 1",
                icon: <LinkIcon className="h-5 w-5" />,
                t: "URLを共有",
                d: "クライアントに専用URLを送るだけ。アカウント登録は不要です。",
              },
              {
                n: "Step 2",
                icon: <ClipboardList className="h-5 w-5" />,
                t: "選択して回答",
                d: "クライアントは選択式で5分ほどで回答完了。途中保存も自動です。",
              },
              {
                n: "Step 3",
                icon: <Wand2 className="h-5 w-5" />,
                t: "サマリーで受け取り",
                d: "整形された要件サマリーをコピーして、提案書の元データに。",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="rounded-3xl bg-white p-8 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-700 text-white">
                    {s.icon}
                  </span>
                  <span className="text-xs font-semibold tracking-widest text-ink-400">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── Share ───────── */}
      <section id="share" className="px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Share</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-700 sm:text-6xl">
            このURLを、
            <br className="sm:hidden" />
            送るだけ。
          </h2>
          <p className="mt-6 text-lg text-ink-500">
            クライアントへこのリンクを共有すると、そのままヒアリングが始まります。
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col items-stretch gap-2 rounded-2xl border border-ink-200 bg-white p-2 shadow-soft sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-ink-100 px-4 py-3">
              <LinkIcon className="h-4 w-4 flex-shrink-0 text-ink-500" />
              <span className="truncate text-left text-sm text-ink-700">
                {shareUrl || "読み込み中…"}
              </span>
            </div>
            <button
              onClick={copy}
              disabled={!shareUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-ink-800 disabled:opacity-40"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> コピー済み
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> コピー
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/hearing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark"
            >
              自分で先に試してみる
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Final CTA (dark) ───────── */}
      <section className="bg-ink-700 px-6 py-32 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <Sparkles className="mx-auto h-6 w-6 text-white/60" />
          <h2 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            最初の5分を、
            <br className="sm:hidden" />
            気持ちよく。
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            HP制作のスタート地点で、お互いの認識をひとつにそろえる。
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/hearing"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-100"
            >
              ヒアリングを始める
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="border-t border-ink-100 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-ink-400 sm:flex-row">
          <span>© {new Date().getFullYear()} Brief.</span>
          <span>HP制作のためのヒアリング</span>
        </div>
      </footer>
    </main>
  );
}

/* ───────── Product preview component ───────── */

function ProductPreview() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-[2.2rem] border border-ink-150 bg-white p-2 shadow-elev">
      <div className="rounded-[1.8rem] bg-ink-100 p-6 sm:p-10">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-300" />
        </div>

        {/* Progress */}
        <div className="mt-8 flex items-center justify-between text-xs text-ink-500">
          <span>4 / 7</span>
          <span className="font-semibold text-ink-700">57%</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-200">
          <div className="h-full w-[57%] bg-ink-700" />
        </div>

        {/* Quest */}
        <div className="mt-10">
          <p className="eyebrow">Section 4</p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-700 sm:text-3xl">
            デザインの方向性を、教えてください。
          </h3>
          <p className="mt-2 text-sm text-ink-500">
            イメージワードを選んでください（複数選択可）
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { l: "モダン", active: true },
              { l: "シンプル", active: true },
              { l: "高級感", active: false },
              { l: "ナチュラル", active: false },
              { l: "ポップ", active: false },
              { l: "信頼感", active: true },
            ].map((c) => (
              <span
                key={c.l}
                className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm transition ${
                  c.active
                    ? "bg-ink-700 text-white"
                    : "border border-ink-200 bg-white text-ink-600"
                }`}
              >
                {c.l}
                {c.active && <Check className="h-3 w-3" />}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button className="rounded-full border border-ink-200 bg-white px-5 py-2 text-sm text-ink-600">
            戻る
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-ink-700 px-5 py-2 text-sm font-medium text-white">
            次へ <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
