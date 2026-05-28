"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Printer,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  QUESTS,
  isFieldFilled,
  isQuestComplete,
  type Answers,
  type Field,
} from "./quests";

const STORAGE_KEY = "questhearing.answers.v1";
const STAGE_KEY = "questhearing.stage.v1";

type Stage = number | "result";

export default function HearingPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [stage, setStage] = useState<Stage>(0);
  const [hydrated, setHydrated] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const a = localStorage.getItem(STORAGE_KEY);
      const s = localStorage.getItem(STAGE_KEY);
      if (a) setAnswers(JSON.parse(a));
      if (s) {
        const parsed = JSON.parse(s) as Stage;
        if (parsed === "result" || (typeof parsed === "number" && parsed >= 0 && parsed < QUESTS.length)) {
          setStage(parsed);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STAGE_KEY, JSON.stringify(stage));
  }, [stage, hydrated]);

  const currentQuest = typeof stage === "number" ? QUESTS[stage] : null;
  const progress =
    stage === "result"
      ? 100
      : Math.round(((stage as number) / QUESTS.length) * 100);

  const canProceed = useMemo(() => {
    if (!currentQuest) return true;
    return isQuestComplete(currentQuest, answers);
  }, [currentQuest, answers]);

  const goNext = () => {
    if (typeof stage !== "number") return;
    if (stage < QUESTS.length - 1) {
      setStage(stage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (stage === "result") {
      setStage(QUESTS.length - 1);
    } else if (typeof stage === "number" && stage > 0) {
      setStage(stage - 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    if (!confirm("回答をリセットして最初からやり直しますか？")) return;
    setAnswers({});
    setStage(0);
  };

  const updateField = (key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-900 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />

      {/* Top bar */}
      <header className="relative z-10 mx-auto max-w-3xl px-5 pt-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            LPに戻る
          </Link>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 transition hover:text-white/80"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            リセット
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>
              {stage === "result"
                ? "クリア！"
                : `Quest ${(stage as number) + 1} / ${QUESTS.length}`}
            </span>
            <span className="font-semibold text-white">{progress}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <section className="relative z-10 mx-auto max-w-3xl px-5 pb-32 pt-8">
        <AnimatePresence mode="wait">
          {stage === "result" ? (
            <ResultView
              key="result"
              answers={answers}
              onBack={goBack}
              onReset={reset}
            />
          ) : currentQuest ? (
            <motion.div
              key={`quest-${currentQuest.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="card"
            >
              {/* Quest header */}
              <div className="flex items-start gap-4">
                <div
                  className={`grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${currentQuest.color} text-2xl shadow-lg shadow-black/30`}
                >
                  <span>{currentQuest.emoji}</span>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold leading-tight sm:text-2xl">
                    {currentQuest.title}
                  </h1>
                  <p className="mt-1 text-sm text-white/70">
                    {currentQuest.subtitle}
                  </p>
                </div>
              </div>

              {/* Fields */}
              <div className="mt-8 space-y-7">
                {currentQuest.fields.map((field) => (
                  <FieldRenderer
                    key={field.key}
                    field={field}
                    value={answers[field.key]}
                    onChange={(v) => updateField(field.key, v)}
                  />
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      {/* Sticky nav */}
      {stage !== "result" && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-ink-900/80 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
            <button
              onClick={goBack}
              disabled={stage === 0}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              戻る
            </button>

            <span className="hidden text-xs text-white/40 sm:inline">
              {canProceed
                ? "準備OK！次のクエストへ"
                : "必須項目を入力してください"}
            </span>

            <button
              onClick={goNext}
              disabled={!canProceed}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neon-purple/30 transition disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:scale-[1.03]"
            >
              {stage === QUESTS.length - 1 ? (
                <>
                  完了する <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  次へ <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* -------------------- Field Renderer -------------------- */

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
}) {
  const filled = isFieldFilled(field, value);

  const labelBlock = (
    <div className="mb-3 flex items-start justify-between gap-2">
      <div>
        <label className="text-sm font-semibold text-white">
          {field.label}
          {field.required && (
            <span className="ml-1.5 text-xs font-medium text-neon-pink">
              *必須
            </span>
          )}
        </label>
        {field.description && (
          <p className="mt-0.5 text-xs text-white/55">{field.description}</p>
        )}
      </div>
      {filled && (
        <span className="mt-0.5 inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-neon-lime/20 px-2 py-0.5 text-[10px] font-semibold text-neon-lime">
          <Check className="h-3 w-3" /> OK
        </span>
      )}
    </div>
  );

  if (field.type === "text" || field.type === "email") {
    return (
      <div>
        {labelBlock}
        <input
          type={field.type}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-neon-purple focus:bg-white/10"
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        {labelBlock}
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className="w-full resize-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-neon-purple focus:bg-white/10"
        />
      </div>
    );
  }

  if (field.type === "single") {
    const current = (value as string) ?? "";
    return (
      <div>
        {labelBlock}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {field.options?.map((opt) => {
            const active = current === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`group relative flex items-center gap-2 rounded-2xl border px-3 py-3 text-left text-sm transition ${
                  active
                    ? "border-transparent bg-gradient-to-br from-neon-pink/30 to-neon-purple/30 text-white shadow-lg shadow-neon-purple/20 ring-1 ring-neon-pink/60"
                    : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                {opt.emoji && <span className="text-base">{opt.emoji}</span>}
                <span className="font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === "multi") {
    const current = (value as string[]) ?? [];
    const toggle = (v: string) => {
      if (current.includes(v)) onChange(current.filter((x) => x !== v));
      else onChange([...current, v]);
    };
    return (
      <div>
        {labelBlock}
        <div className="flex flex-wrap gap-2">
          {field.options?.map((opt) => {
            const active = current.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? "border-transparent bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-md shadow-neon-purple/30"
                    : "border-white/15 bg-white/5 text-white/75 hover:border-white/30 hover:bg-white/10"
                }`}
              >
                {opt.emoji && <span>{opt.emoji}</span>}
                {opt.label}
                {active && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === "cardGrid") {
    const current = (value as string[]) ?? [];
    const toggle = (v: string) => {
      if (current.includes(v)) onChange(current.filter((x) => x !== v));
      else onChange([...current, v]);
    };
    return (
      <div>
        {labelBlock}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {field.options?.map((opt) => {
            const active = current.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={`flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-2xl border p-3 transition ${
                  active
                    ? "border-transparent bg-gradient-to-br from-neon-pink/30 to-neon-purple/30 ring-1 ring-neon-pink/60"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-xs font-semibold text-white/90">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === "color") {
    const current = (value as string) ?? "";
    return (
      <div>
        {labelBlock}
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {field.options?.map((opt) => {
            const active = current === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                title={opt.label}
                className={`group relative aspect-square w-full rounded-2xl border transition ${
                  active
                    ? "scale-105 border-white shadow-lg"
                    : "border-white/15 hover:scale-105"
                }`}
                style={{ backgroundColor: opt.value }}
              >
                {active && (
                  <Check
                    className="absolute inset-0 m-auto h-5 w-5"
                    style={{
                      color: pickReadableTextColor(opt.value),
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
        {current && (
          <p className="mt-2 text-xs text-white/55">
            選択中：
            <span
              className="ml-1.5 inline-block h-3 w-3 translate-y-0.5 rounded-full"
              style={{ backgroundColor: current }}
            />{" "}
            {field.options?.find((o) => o.value === current)?.label} ({current})
          </p>
        )}
      </div>
    );
  }

  return null;
}

function pickReadableTextColor(hex: string): string {
  // Simple luminance check; light bg → black icon, dark bg → white icon
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#000" : "#fff";
}

/* -------------------- Result Summary -------------------- */

function ResultView({
  answers,
  onBack,
  onReset,
}: {
  answers: Answers;
  onBack: () => void;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const summaryText = useMemo(() => buildSummaryText(answers), [answers]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const print = () => window.print();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Celebration */}
      <div className="card relative overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,210,79,0.25),transparent_60%)]" />
        <div className="relative">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-neon-gold via-neon-pink to-neon-purple shadow-xl shadow-neon-purple/30">
            <Trophy className="h-9 w-9" />
          </div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            CLEAR! 🎉
          </h2>
          <p className="mt-2 text-sm text-white/70">
            お疲れさまでした！ヒアリング内容を以下にまとめました。
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button onClick={copy} className="btn-secondary text-sm">
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> コピー済み
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> 全文をコピー
                </>
              )}
            </button>
            <button onClick={print} className="btn-secondary text-sm">
              <Printer className="h-4 w-4" /> 印刷 / PDF保存
            </button>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white/60 transition hover:text-white"
            >
              <RotateCcw className="h-4 w-4" /> もう一度
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="space-y-4 print:space-y-3">
        {QUESTS.map((q) => (
          <div
            key={q.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur print:border print:border-gray-300 print:bg-white print:text-black"
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${q.color} text-lg shadow-md`}
              >
                {q.emoji}
              </div>
              <div>
                <h3 className="text-base font-bold print:text-black">
                  {q.title}
                </h3>
                <p className="text-xs text-white/55 print:text-gray-500">
                  {q.subtitle}
                </p>
              </div>
            </div>

            <dl className="space-y-3">
              {q.fields.map((f) => (
                <div
                  key={f.key}
                  className="flex flex-col gap-1 sm:flex-row sm:gap-4"
                >
                  <dt className="w-full text-xs font-semibold text-white/55 sm:w-48 sm:flex-shrink-0 print:text-gray-500">
                    {f.label}
                  </dt>
                  <dd className="text-sm text-white print:text-black">
                    {renderAnswer(f, answers[f.key])}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="flex justify-between print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> 前のクエストへ
        </button>
        <Link href="/" className="btn-primary text-sm">
          <Sparkles className="h-4 w-4" /> トップへ
        </Link>
      </div>
    </motion.div>
  );
}

function renderAnswer(field: Field, value: string | string[] | undefined) {
  if (!isFieldFilled(field, value)) {
    return <span className="text-white/30 print:text-gray-400">— 未入力</span>;
  }

  if (field.type === "multi" || field.type === "cardGrid") {
    const arr = value as string[];
    return (
      <div className="flex flex-wrap gap-1.5">
        {arr.map((v) => {
          const opt = field.options?.find((o) => o.value === v);
          return (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs print:bg-gray-100 print:text-black"
            >
              {opt?.emoji && <span>{opt.emoji}</span>}
              {opt?.label ?? v}
            </span>
          );
        })}
      </div>
    );
  }

  if (field.type === "single") {
    const opt = field.options?.find((o) => o.value === value);
    return (
      <span className="inline-flex items-center gap-1.5">
        {opt?.emoji && <span>{opt.emoji}</span>}
        {opt?.label ?? String(value)}
      </span>
    );
  }

  if (field.type === "color") {
    const opt = field.options?.find((o) => o.value === value);
    return (
      <span className="inline-flex items-center gap-2">
        <span
          className="inline-block h-4 w-4 rounded-full border border-white/30"
          style={{ backgroundColor: value as string }}
        />
        <span>
          {opt?.label} <span className="text-white/50">({value as string})</span>
        </span>
      </span>
    );
  }

  // text / textarea
  return (
    <span className="whitespace-pre-wrap break-words">{value as string}</span>
  );
}

function buildSummaryText(answers: Answers): string {
  const lines: string[] = ["■ HP制作ヒアリングシート", ""];
  QUESTS.forEach((q) => {
    lines.push(`【${q.title.replace(/^Quest \d+：/, "")}】`);
    q.fields.forEach((f) => {
      const v = answers[f.key];
      let text = "(未入力)";
      if (isFieldFilled(f, v)) {
        if (f.type === "multi" || f.type === "cardGrid") {
          const arr = v as string[];
          text = arr
            .map((x) => f.options?.find((o) => o.value === x)?.label ?? x)
            .join(" / ");
        } else if (f.type === "single") {
          text = f.options?.find((o) => o.value === v)?.label ?? String(v);
        } else if (f.type === "color") {
          const opt = f.options?.find((o) => o.value === v);
          text = `${opt?.label ?? ""} (${v})`;
        } else {
          text = String(v);
        }
      }
      lines.push(`・${f.label}：${text}`);
    });
    lines.push("");
  });
  return lines.join("\n");
}
