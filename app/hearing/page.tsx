"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Link2,
  Printer,
  RotateCcw,
  Send,
  Sparkles,
} from "lucide-react";
import {
  QUESTS,
  isFieldFilled,
  isQuestComplete,
  type Answers,
  type Field,
} from "./quests";
import { siteConfig } from "../site-config";

const STORAGE_KEY = "brief.answers.v1";
const STAGE_KEY = "brief.stage.v1";

type Stage = number | "result";

const ease = [0.16, 1, 0.3, 1] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmailValid(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

/** A field is "blocking" if required-but-empty, or an email with an invalid value. */
function fieldBlocked(field: Field, value: unknown): boolean {
  if (field.required && !isFieldFilled(field, value)) return true;
  if (
    field.type === "email" &&
    typeof value === "string" &&
    value.trim().length > 0 &&
    !isEmailValid(value)
  ) {
    return true;
  }
  return false;
}

/* ── URL-safe encode/decode of answers (for shareable links) ── */
function encodeAnswers(a: Answers): string {
  try {
    const json = JSON.stringify(a);
    const b64 = btoa(
      encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p) =>
        String.fromCharCode(parseInt(p, 16)),
      ),
    );
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

function decodeAnswers(s: string): Answers | null {
  try {
    const b64 =
      s.replace(/-/g, "+").replace(/_/g, "/") +
      "===".slice((s.length + 3) % 4);
    const bin = atob(b64);
    const json = decodeURIComponent(
      [...bin]
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const obj = JSON.parse(json);
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return obj as Answers;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export default function HearingPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [stage, setStage] = useState<Stage>(0);
  const [maxReached, setMaxReached] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [loadedFromLink, setLoadedFromLink] = useState(false);

  // ── Hydrate: shared link (#r=) takes precedence over localStorage ──
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith("#r=")) {
        const decoded = decodeAnswers(hash.slice(3));
        if (decoded) {
          setAnswers(decoded);
          setStage("result");
          setMaxReached(QUESTS.length - 1);
          setLoadedFromLink(true);
          setHydrated(true);
          return;
        }
      }
      const a = localStorage.getItem(STORAGE_KEY);
      const s = localStorage.getItem(STAGE_KEY);
      if (a) setAnswers(JSON.parse(a));
      if (s) {
        const parsed = JSON.parse(s) as Stage;
        if (
          parsed === "result" ||
          (typeof parsed === "number" && parsed >= 0 && parsed < QUESTS.length)
        ) {
          setStage(parsed);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist — but never clobber storage when we're just viewing a shared link.
  useEffect(() => {
    if (!hydrated || loadedFromLink) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers, hydrated, loadedFromLink]);

  useEffect(() => {
    if (!hydrated || loadedFromLink) return;
    localStorage.setItem(STAGE_KEY, JSON.stringify(stage));
  }, [stage, hydrated, loadedFromLink]);

  // Track the furthest section reached (for stepper navigation).
  useEffect(() => {
    setMaxReached((m) =>
      Math.max(m, typeof stage === "number" ? stage : QUESTS.length - 1),
    );
  }, [stage]);

  const currentQuest = typeof stage === "number" ? QUESTS[stage] : null;

  // ── Progress: section index + intra-section completion ratio ──
  const progress = useMemo(() => {
    if (stage === "result") return 100;
    const q = QUESTS[stage as number];
    const required = q.fields.filter((f) => f.required);
    const filled = required.filter((f) => isFieldFilled(f, answers[f.key]));
    const ratio = required.length ? filled.length / required.length : 1;
    return Math.min(
      100,
      Math.round((((stage as number) + ratio) / QUESTS.length) * 100),
    );
  }, [stage, answers]);

  // ── Can we advance? + human reason ──
  const { canProceed, reason } = useMemo(() => {
    if (!currentQuest) return { canProceed: true, reason: "" };
    const missingRequired = currentQuest.fields.some(
      (f) => f.required && !isFieldFilled(f, answers[f.key]),
    );
    if (missingRequired)
      return { canProceed: false, reason: "必須項目を入力してください" };
    const badEmail = currentQuest.fields.some((f) =>
      fieldBlocked(f, answers[f.key]),
    );
    if (badEmail)
      return {
        canProceed: false,
        reason: "メールアドレスの形式をご確認ください",
      };
    return { canProceed: true, reason: "" };
  }, [currentQuest, answers]);

  const goNext = useCallback(() => {
    setStage((s) => {
      if (typeof s !== "number") return s;
      return s < QUESTS.length - 1 ? s + 1 : "result";
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    setStage((s) => {
      if (s === "result") return QUESTS.length - 1;
      if (typeof s === "number" && s > 0) return s - 1;
      return s;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const jumpTo = useCallback((i: number) => {
    setStage(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const reset = () => {
    if (!confirm("回答をリセットして最初からやり直しますか？")) return;
    setAnswers({});
    setStage(0);
    setMaxReached(0);
    setLoadedFromLink(false);
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
  };

  const updateField = (key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // ── Press Enter to advance (except inside a textarea / on links & buttons) ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.shiftKey) return;
      if (stage === "result") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "TEXTAREA" || t.tagName === "BUTTON" || t.tagName === "A"))
        return;
      if (canProceed) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stage, canProceed, goNext]);

  const isLast = stage === QUESTS.length - 1;

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
              {siteConfig.brand.name}
            </Link>
            <div className="flex items-center gap-4">
              {!loadedFromLink && (
                <span className="hidden items-center gap-1.5 text-xs text-ink-400 sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
                  自動保存中
                </span>
              )}
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs text-ink-400 transition hover:text-ink-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                リセット
              </button>
            </div>
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

            {/* Segmented stepper — also navigation */}
            <div
              className="mt-2 flex items-center gap-1"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {QUESTS.map((q, i) => {
                const complete = isQuestComplete(q, answers);
                const isCurrent = stage === i;
                const reached = i <= maxReached || stage === "result";
                const color = isCurrent
                  ? "bg-ink-700"
                  : complete
                    ? "bg-ink-700"
                    : reached
                      ? "bg-ink-300 hover:bg-ink-400"
                      : "bg-ink-150";
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => reached && jumpTo(i)}
                    disabled={!reached}
                    aria-label={`Section ${i + 1}：${q.title}`}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${color} ${
                      reached ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                  />
                );
              })}
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
              loadedFromLink={loadedFromLink}
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
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-4">
            <button
              onClick={goBack}
              disabled={stage === 0}
              className="btn-ghost disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              戻る
            </button>

            <span
              className="hidden flex-1 text-center text-xs text-ink-400 sm:block"
              aria-live="polite"
            >
              {canProceed ? (isLast ? "Enter で完了" : "Enter で次へ") : reason}
            </span>

            <button
              onClick={goNext}
              disabled={!canProceed}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-30"
            >
              {isLast ? "完了する" : "次へ"}
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
  const fieldId = `f-${field.key}`;
  const selectedCount = Array.isArray(value) ? value.length : 0;
  const emailInvalid =
    field.type === "email" &&
    typeof value === "string" &&
    value.trim().length > 0 &&
    !isEmailValid(value);

  const labelBlock = (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <label
          htmlFor={fieldId}
          className="text-base font-semibold tracking-tight text-ink-700"
        >
          {field.label}
          {field.required && (
            <span className="ml-1.5 text-xs font-medium text-accent">必須</span>
          )}
        </label>
        {field.description && (
          <p className="mt-1 text-sm text-ink-500">{field.description}</p>
        )}
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        {(field.type === "multi" || field.type === "cardGrid") &&
          selectedCount > 0 && (
            <span className="text-xs font-medium text-ink-400">
              {selectedCount}件選択中
            </span>
          )}
        {filled && !emailInvalid && (
          <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-ink-700 px-2.5 py-0.5 text-[10px] font-semibold text-white">
            <Check className="h-3 w-3" />
          </span>
        )}
      </div>
    </div>
  );

  if (field.type === "text" || field.type === "email") {
    return (
      <div>
        {labelBlock}
        <input
          id={fieldId}
          type={field.type}
          inputMode={field.type === "email" ? "email" : undefined}
          autoComplete={field.type === "email" ? "email" : undefined}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          aria-invalid={emailInvalid || undefined}
          className={`input-clean ${
            emailInvalid ? "border-accent focus:border-accent" : ""
          }`}
        />
        {emailInvalid && (
          <p className="mt-2 text-xs text-accent">
            メールアドレスの形式をご確認ください
          </p>
        )}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        {labelBlock}
        <textarea
          id={fieldId}
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
        <div
          role="radiogroup"
          aria-label={field.label}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        >
          {field.options?.map((opt) => {
            const active = current === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange(opt.value)}
                className={`opt flex items-center gap-2 rounded-2xl border px-3 py-3 text-left text-sm ${
                  active ? "opt-active" : "opt-idle"
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
        <div
          role="group"
          aria-label={field.label}
          className="flex flex-wrap gap-2"
        >
          {field.options?.map((opt) => {
            const active = current.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(opt.value)}
                className={`opt inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm ${
                  active ? "opt-active" : "opt-idle"
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
        <div
          role="group"
          aria-label={field.label}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        >
          {field.options?.map((opt) => {
            const active = current.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(opt.value)}
                className={`opt flex aspect-[5/4] flex-col items-center justify-center gap-2 rounded-2xl border p-4 ${
                  active ? "opt-active" : "opt-idle"
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
        <div
          role="radiogroup"
          aria-label={field.label}
          className="grid grid-cols-5 gap-3 sm:grid-cols-10"
        >
          {field.options?.map((opt) => {
            const active = current === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={opt.label}
                title={opt.label}
                onClick={() => onChange(opt.value)}
                className={`opt aspect-square w-full rounded-2xl border ${
                  active
                    ? "border-ink-700 shadow-soft ring-2 ring-ink-700/20"
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
  loadedFromLink,
  onBack,
  onReset,
}: {
  answers: Answers;
  loadedFromLink: boolean;
  onBack: () => void;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const summaryText = useMemo(() => buildSummaryText(answers), [answers]);

  const shareLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const enc = encodeAnswers(answers);
    return enc
      ? `${window.location.origin}${base}/hearing/#r=${enc}`
      : "";
  }, [answers]);

  const mailto = useMemo(() => {
    const company = (answers["companyName"] as string) || "";
    const subject = `【HP制作ヒアリング】${company || "新規ご相談"}`;
    const body =
      summaryText +
      (shareLink ? `\n\n----\n▼ 回答を再表示できるリンク\n${shareLink}\n` : "");
    return `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }, [answers, summaryText, shareLink]);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const copyLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1600);
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
          {loadedFromLink ? "ヒアリング内容" : "入力ありがとうございました。"}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-ink-500">
          {loadedFromLink
            ? "共有されたヒアリング内容です。"
            : "下記の内容で送信してください。担当者が確認のうえご連絡します。"}
        </p>

        {!loadedFromLink && (
          <div className="mt-8">
            <a href={mailto} className="btn-primary px-8 py-3.5 text-base">
              <Send className="h-4 w-4" />
              この内容を送信する
            </a>
            <p className="mt-3 text-xs text-ink-400">
              メールソフトが開きます。本文はそのまま送信してください。
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {shareLink && (
            <button onClick={copyLink} className="btn-ghost">
              {linkCopied ? (
                <>
                  <Check className="h-4 w-4" /> コピー済み
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" /> 回答リンクをコピー
                </>
              )}
            </button>
          )}
          <button onClick={copyText} className="btn-ghost">
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
          <ArrowLeft className="h-4 w-4" /> 内容を修正する
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
