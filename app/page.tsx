"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Rocket,
  Gamepad2,
  Wand2,
  ListChecks,
  Clock,
  ShieldCheck,
  ArrowRight,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.08 },
  }),
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-900 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Header */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-neon-pink to-neon-purple shadow-lg shadow-neon-purple/40">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Quest<span className="text-neon-pink">Hearing</span>
            </span>
          </Link>
          <Link href="/hearing" className="btn-primary text-sm">
            <Sparkles className="h-4 w-4" />
            ヒアリングを始める
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur"
            >
              <Zap className="h-3.5 w-3.5 text-neon-gold" />
              HP制作の最初の30分を、もっと楽しく
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl"
            >
              ヒアリングを、
              <br />
              <span className="shimmer-text">冒険</span>に変えよう。
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
            >
              HP制作のヒアリングはもう退屈なエクセルじゃない。
              <br />
              <span className="text-white">QuestHearing</span>
              はゲーム感覚で進めるだけで、お客様の想いと要件が
              <span className="font-semibold text-neon-pink">スッキリ整理</span>
              されます。
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href="/hearing" className="btn-primary">
                <Rocket className="h-5 w-5" />
                今すぐ冒険を始める
              </Link>
              <a href="#feature" className="btn-secondary">
                特徴を見る
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/60"
            >
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> 平均5分で完了
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> 入力データはブラウザ内に保存
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> 登録不要・無料
              </span>
            </motion.div>
          </div>

          {/* Hero visual: floating "console" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-6 rounded-[2.2rem] bg-gradient-to-br from-neon-pink/40 via-neon-purple/40 to-neon-blue/40 opacity-60 blur-3xl" />
            <div className="relative animate-float-slow rounded-[2rem] border border-white/10 bg-ink-800/80 p-5 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-neon-pink" />
                  Quest 3 / 7
                </span>
                <span>HP制作ヒアリング</span>
              </div>

              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[42%] bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue" />
              </div>

              <p className="mt-5 text-sm text-white/60">QUESTION</p>
              <p className="mt-1 text-lg font-bold">
                サイトの「らしさ」はどんなイメージ？
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {[
                  { l: "モダン", emoji: "✨" },
                  { l: "ナチュラル", emoji: "🌿" },
                  { l: "高級感", emoji: "👑" },
                  { l: "ポップ", emoji: "🎈" },
                ].map((x) => (
                  <div
                    key={x.l}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <span className="mr-1">{x.emoji}</span>
                    {x.l}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="chip">+15 XP</span>
                <span className="rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-4 py-1.5 text-xs font-semibold">
                  次へ →
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-12"
        >
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-neon-pink">
                THE PROBLEM
              </h2>
              <p className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                ヒアリング、こんなことありませんか？
              </p>
            </div>
            <ul className="space-y-3 text-white/80">
              {[
                "ヒアリングシートを送っても「むずかしい」と返ってこない",
                "打合せが長引いて、ゴールが見えなくなる",
                "結局メールやLINEで断片的な情報が散らばる",
                "デザインの方向性が言語化できず、何度もやり直し",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-neon-pink" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="feature" className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-semibold tracking-widest text-neon-purple">
            FEATURES
          </h2>
          <p className="mt-3 text-3xl font-extrabold sm:text-4xl">
            ゲームみたいに、サクサク終わる。
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Gamepad2 className="h-6 w-6" />,
              title: "クエスト形式の質問",
              desc: "7つの章立てで、迷わず最後まで完走。XPバーで進捗が見えて、達成感もバッチリ。",
              color: "from-neon-pink to-neon-purple",
            },
            {
              icon: <Wand2 className="h-6 w-6" />,
              title: "選ぶだけのUI",
              desc: "イメージワード・カラー・必要なページなど、選択肢から直感的に。専門知識ゼロでもOK。",
              color: "from-neon-purple to-neon-blue",
            },
            {
              icon: <ListChecks className="h-6 w-6" />,
              title: "そのまま要件定義",
              desc: "完了画面でヒアリング内容を美しいサマリーに整形。コピペで提案書のたたき台に。",
              color: "from-neon-blue to-neon-lime",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="card group transition hover:-translate-y-1 hover:border-white/20"
            >
              <div
                className={`mb-5 inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.color} shadow-lg shadow-black/30`}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-semibold tracking-widest text-neon-blue">
            HOW IT WORKS
          </h2>
          <p className="mt-3 text-3xl font-extrabold sm:text-4xl">
            たった3ステップで攻略。
          </p>
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "URLをシェア",
              d: "お客様にQuestHearingのURLを送るだけ。ログイン不要ですぐに開始できます。",
            },
            {
              n: "02",
              t: "ゲーム感覚で回答",
              d: "全7クエスト・約5分。選択肢中心なので、移動中でも気軽に回答できます。",
            },
            {
              n: "03",
              t: "サマリーを共有",
              d: "完了画面のサマリーをそのまま提案書のたたき台に。コピーや印刷もワンクリック。",
            },
          ].map((s, i) => (
            <motion.li
              key={s.n}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6"
            >
              <span className="absolute -top-4 left-6 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-3 py-1 text-xs font-bold tracking-widest">
                STEP {s.n}
              </span>
              <h3 className="mt-3 text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{s.d}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-neon-purple/20 via-neon-pink/10 to-neon-blue/20 p-10 text-center sm:p-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]" />
          <h2 className="relative text-3xl font-extrabold sm:text-5xl">
            さあ、最初のクエストへ。
          </h2>
          <p className="relative mt-4 text-white/75">
            お客様にも自分にもストレスゼロ。<br className="sm:hidden" />
            5分の冒険で、HP制作のスタートをスムーズに。
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link href="/hearing" className="btn-primary text-base">
              <Sparkles className="h-5 w-5" />
              ヒアリングを始める
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} QuestHearing — Made for HP Builders.
      </footer>
    </main>
  );
}
