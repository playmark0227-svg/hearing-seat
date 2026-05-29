"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ClipboardList,
  Copy,
  Link as LinkIcon,
  Mail,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "./site-config";

const ease = [0.16, 1, 0.3, 1] as const;

export default function LandingPage() {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const { brand, hero, values, services, process: steps, faq, contact } =
    siteConfig;

  return (
    <main className="min-h-screen bg-white text-ink-700">
      {/* ─────── Header ─────── */}
      <header className="sticky top-0 z-40 border-b border-ink-100/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink-700 text-[11px] font-bold text-white">
              {brand.initial}
            </span>
            <span className="text-base font-semibold tracking-tight text-ink-700">
              {brand.name}
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-ink-600 md:flex">
            <a href="#values" className="transition hover:text-ink-700">
              強み
            </a>
            <a href="#services" className="transition hover:text-ink-700">
              サービス
            </a>
            <a href="#process" className="transition hover:text-ink-700">
              制作の流れ
            </a>
            <a href="#faq" className="transition hover:text-ink-700">
              FAQ
            </a>
          </nav>
          <Link
            href="/hearing"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-800"
          >
            ヒアリング
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* ─────── Hero ─────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 pb-28 pt-24 text-center sm:pt-36">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="mt-6 font-display text-5xl font-semibold leading-[1.04] tracking-tightest text-ink-700 sm:text-7xl"
          >
            {hero.headline_top}
            <br />
            <span className="text-ink-500">{hero.headline_bottom}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-ink-500 sm:text-xl"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/hearing" className="btn-primary">
              {hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#services" className="btn-ghost">
              {hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-xs text-ink-400"
          >
            ヒアリングは登録不要・無料・5分で完了
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

      {/* ─────── Values ─────── */}
      <section id="values" className="bg-ink-100 px-6 pb-24 pt-44">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-center">Why us</p>
          <h2 className="mt-4 text-center font-display text-3xl font-semibold leading-tight tracking-tight text-ink-700 sm:text-5xl">
            私たちが、大切にしていること。
          </h2>

          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-ink-200 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.n} className="bg-white p-8 sm:p-10">
                <div className="text-xs font-semibold tracking-widest text-accent">
                  {v.n}
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink-700">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── Services ─────── */}
      <section id="services" className="px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">Services</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink-700 sm:text-6xl">
            提供しているサービス。
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-ink-500">
            HP制作を軸に、コンセプト設計から公開後の運用までを一貫してサポートします。
          </p>

          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.n}
                className="group rounded-3xl border border-ink-150 bg-white p-8 transition hover:border-ink-300 hover:shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-ink-400">
                    {s.n}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-ink-300 transition group-hover:text-ink-700" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-ink-700">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── Process ─────── */}
      <section id="process" className="bg-ink-100 px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">Process</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-700 sm:text-6xl">
            制作の流れ。
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-ink-500">
            すべての始まりは、ヒアリングから。
          </p>

          <ol className="mt-16 space-y-3">
            {steps.map((s) => (
              <li
                key={s.step}
                className={`group relative rounded-3xl border bg-white p-6 transition hover:shadow-soft sm:p-8 ${
                  s.isHearing
                    ? "border-ink-700 ring-2 ring-ink-700/10"
                    : "border-ink-150"
                }`}
              >
                <div className="grid items-start gap-4 sm:grid-cols-[8rem_1fr_auto]">
                  <div className="text-xs font-semibold tracking-widest text-ink-400">
                    STEP {s.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-ink-700">
                      {s.title}
                      {s.isHearing && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-ink-700 px-2 py-0.5 align-middle text-[10px] font-semibold text-white">
                          ここから
                        </span>
                      )}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink-500">{s.desc}</p>
                  </div>
                  {s.isHearing && (
                    <Link
                      href="/hearing"
                      className="inline-flex items-center justify-center gap-1.5 self-center rounded-full bg-ink-700 px-4 py-2 text-xs font-medium text-white transition hover:bg-ink-800"
                    >
                      開始する
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────── Hearing direct link ─────── */}
      <section id="share" className="px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Start here</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-700 sm:text-6xl">
            まずは、5分のヒアリングから。
          </h2>
          <p className="mt-6 text-lg text-ink-500">
            ご担当者へのご共有も、このURLを送るだけで完結します。
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
                  <Copy className="h-4 w-4" /> リンクをコピー
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <Link href="/hearing" className="btn-primary">
              ヒアリングを開始する
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────── FAQ ─────── */}
      <section id="faq" className="bg-ink-100 px-6 py-32">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-center">FAQ</p>
          <h2 className="mt-4 text-center font-display text-4xl font-semibold leading-tight tracking-tight text-ink-700 sm:text-5xl">
            よくあるご質問。
          </h2>

          <div className="mt-12 space-y-2">
            {faq.map((item, i) => (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-ink-150 bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-ink-700 sm:text-base">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-ink-400 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-ink-100 px-6 py-5 text-sm leading-relaxed text-ink-600">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── Final CTA ─────── */}
      <section className="bg-ink-700 px-6 py-32 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <Sparkles className="mx-auto h-6 w-6 text-white/60" />
          <h2 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            想いを、聴かせてください。
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            HP制作のスタート地点で、お互いの認識をひとつに。
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/hearing"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-100"
            >
              ヒアリングを始める
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Mail className="h-4 w-4" />
              メールで連絡する
            </a>
          </div>
          <p className="mt-6 text-xs text-white/40">{contact.note}</p>
        </div>
      </section>

      {/* ─────── Footer ─────── */}
      <footer className="border-t border-ink-100 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-ink-400 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {brand.name}.
          </span>
          <span>{brand.role}</span>
        </div>
      </footer>
    </main>
  );
}

/* ─────── Product preview ─────── */

function ProductPreview() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-[2.2rem] border border-ink-150 bg-white p-2 shadow-elev">
      <div className="rounded-[1.8rem] bg-ink-100 p-6 sm:p-10">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-300" />
          <span className="ml-3 text-xs text-ink-400">ヒアリング</span>
        </div>

        <div className="mt-8 flex items-center justify-between text-xs text-ink-500">
          <span>Section 4 / 7</span>
          <span className="font-semibold text-ink-700">57%</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-200">
          <div className="h-full w-[57%] bg-ink-700" />
        </div>

        <div className="mt-10">
          <p className="eyebrow">Section 04</p>
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

// Avoid TS6133 unused import in some build modes
void ClipboardList;
