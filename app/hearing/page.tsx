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
} from "lucide-react";
import {
  QUESTS,
  isFieldFilled,
  isQuestComplete,
  type Answers,
  type Field,
} from "./quests";

const STORAGE_KEY = "brief.answers.v1";
const STAGE_KEY = "brief.stage.v1";

type Stage = number | "result";

const ease = [0.16, 1, 0.3, 1] as const;

export default function HearingPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [stage, setStage] = useState<Stage>(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const a = localStorage.getItem(STORAGE_KEY);
      const s = localStorage.getItem(STAGE_KEY);
      if (a) setAnswers(JSON.parse(a));
      if (s) {
        const parsed = JSON.parse(s) as Stage;
        if (
          parsed === "result" ||
          (typeof parsed === "number" &&
            parsed >= 0 &&
            parsed < QUESTS.length)
        ) {
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
    } else {
      setStage("result");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <main className="min-h-screen bg-white text-ink-700">
      {/* ─── Top bar ─── */}
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-5 pt-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 transition hover:text-ink-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Brief
            </Link>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs text-ink-400 transition hover:text-ink-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              リセット
            </button>
          </div>

          <div className="mt-3 pb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-500">
                {stage === "result"
                  ? "完了"
                  : `Section ${(stage as number) + 1} / ${QUESTS.length}`}
              </span>
              <span className="font-semibold text-ink-700">{progress}%</span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-150">
              <motion.div
                className="h-full bg-ink-700"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Body ─── */}
      <section className="mx-auto max-w-3xl px-5 pb-40 pt-12 sm:pt-16">
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
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease }}
            >
              <p className="eyebrow">
                Section {String(currentQuest.id).padStart(2, "0")}
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-ink-700 sm:text-5xl">
                {currentQuest.title}
              </h1>
              <p className="mt-3 text-base text-ink-500 sm:text-lg">
                {currentQuest.subtitle}
              </p>

              <div className="mt-12 space-y-10">
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

      {/* ─── Sticky nav ─── */}
      {stage !== "result" && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-100 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
            <button
              onClick={goBack}
              disabled={stage === 0}
              className="btn-ghost disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              戻る
            </button>

            <button
              onClick={goNext}
              disabled={!canProceed}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-30"
            >
              {stage === QUESTS.length - 1 ? "完了する" : "次へ"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ──────────── Field Renderer ──────────── */

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
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <label className="text-base font-semibold tracking-tight text-ink-700">
          {field.label}
          {field.required && (
            <span className="ml-1.5 text-xs font-medium text-accent">必須</span>
          )}
        </label>
        {field.description && (
          <p className="mt-1 text-sm text-ink-500">{field.description}</p>
        )}
      </div>
      {filled && (
        <span className="mt-1 inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-ink-700 px-2.5 py-0.5 text-[10px] font-semibold text-white">
          <Check className="h-3 w-3" />
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
          className="input-clean"
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
          className="input-clean resize-none"
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
                className={`relative flex items-center gap-2 rounded-2xl border px-3 py-3 text-left text-sm transition ${
                  active
                    ? "border-ink-700 bg-ink-700 text-white"
                    : "border-ink-200 bg-white text-ink-700 hover:border-ink-400 hover:bg-ink-50"
                }`}
              >
                {opt.emoji && (
                  <span className="text-base leading-none">{opt.emoji}</span>
                )}
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
                    ? "border-ink-700 bg-ink-700 text-white"
                    : "border-ink-200 bg-white text-ink-700 hover:border-ink-400 hover:bg-ink-50"
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
                className={`flex aspect-[5/4] flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition ${
                  active
                    ? "border-ink-700 bg-ink-700 text-white"
                    : "border-ink-200 bg-white text-ink-700 hover:border-ink-400 hover:bg-ink-50"
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-xs font-semibold">{opt.label}</span>
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
        <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
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
                    ? "border-ink-700 shadow-soft"
                    : "border-ink-200 hover:border-ink-400"
                }`}
                style={{ backgroundColor: opt.value }}
              >
                {active && (
                  <Check
                    className="absolute inset-0 m-auto h-5 w-5"
                    style={{ color: pickReadableTextColor(opt.value) }}
                  />
                )}
              </button>
            );
          })}
        </div>
        {current && (
          <p className="mt-3 text-xs text-ink-500">
            選択中：
            <span
              className="ml-1.5 inline-block h-3 w-3 translate-y-0.5 rounded-full border border-ink-200"
              style={{ backgroundColor: current }}
            />{" "}
            {field.options?.find((o) => o.value === current)?.label}{" "}
            <span className="text-ink-400">({current})</span>
          </p>
        )}
      </div>
    );
  }

  return null;
}

function pickReadableTextColor(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1d1d1f" : "#ffffff";
}

/* ──────────── Result Summary ──────────── */

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
      transition={{ duration: 0.45, ease }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="text-center print:hidden">
        <Sparkles className="mx-auto h-6 w-6 text-ink-500" />
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink-700 sm:text-5xl">
          完了しました。
        </h2>
        <p className="mt-3 text-base text-ink-500">
          内容を以下にまとめました。提案書の下書きにそのままお使いください。
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button onClick={copy} className="btn-primary">
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
          <button onClick={print} className="btn-ghost">
            <Printer className="h-4 w-4" /> 印刷 / PDF保存
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-ink-400 transition hover:text-ink-700"
          >
            <RotateCcw className="h-4 w-4" /> 最初から
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4 print:space-y-0">
        {QUESTS.map((q, i) => (
          <div
            key={q.id}
            className="rounded-3xl border border-ink-150 bg-white p-6 sm:p-8 print:break-inside-avoid print:border-ink-300 print:p-6"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-semibold tracking-widest text-ink-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink-700">
                {q.title}
              </h3>
            </div>

            <dl className="mt-6 space-y-4">
              {q.fields.map((f) => (
                <div
                  key={f.key}
                  className="flex flex-col gap-1 border-t border-ink-100 pt-4 first:border-t-0 first:pt-0 sm:flex-row sm:gap-6"
                >
                  <dt className="w-full text-xs font-semibold uppercase tracking-wider text-ink-400 sm:w-48 sm:flex-shrink-0">
                    {f.label}
                  </dt>
                  <dd className="text-sm text-ink-700">
                    {renderAnswer(f, answers[f.key])}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex justify-between print:hidden">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" /> 前へ戻る
        </button>
        <Link href="/" className="btn-primary">
          トップへ
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

function renderAnswer(field: Field, value: string | string[] | undefined) {
  if (!isFieldFilled(field, value)) {
    return <span className="text-ink-400">— 未入力</span>;
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
              className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs text-ink-700"
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
          className="inline-block h-4 w-4 rounded-full border border-ink-200"
          style={{ backgroundColor: value as string }}
        />
        <span>
          {opt?.label} <span className="text-ink-400">({value as string})</span>
        </span>
      </span>
    );
  }

  return (
    <span className="whitespace-pre-wrap break-words">{value as string}</span>
  );
}

function buildSummaryText(answers: Answers): string {
  const lines: string[] = ["■ HP制作ヒアリングシート", ""];
  QUESTS.forEach((q) => {
    lines.push(`【${q.title}】`);
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
