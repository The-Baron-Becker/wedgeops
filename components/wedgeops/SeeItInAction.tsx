"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/track";

const BRIEF_LINES = [
  "5pm ceremony, north garden, 140 guests.",
  "First look @ 3:15 with bridal party of 6.",
  "Cocktail hour live quartet (Ashwood).",
  "Toasts after entrée, dance floor 9:45.",
  "Sparkler exit 11:30 sharp — coordinate w/ DJ.",
];

const RUN_OF_SHOW = [
  ["2:00 PM", "Hair & makeup wraps · Suite 404"],
  ["3:15 PM", "First look · North garden (Luz + James)"],
  ["4:00 PM", "Ceremony · 140 guests seated"],
  ["4:30 PM", "Cocktail hour · Live quartet (Ashwood)"],
  ["6:00 PM", "Reception entrance · Toasts + dinner"],
  ["9:45 PM", "Dance floor opens · Sparkler exit 11:30"],
] as const;

type Phase = "idle" | "typing" | "thinking" | "reveal" | "done";

export default function SeeItInAction() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<number>(0);
  const [hasRun, setHasRun] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Auto-start when the section scrolls into view (once).
  useEffect(() => {
    if (hasRun) return;
    const node = sectionRef.current;
    if (!node || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback: start after a short delay if no IntersectionObserver.
      const t = window.setTimeout(() => start(), 600);
      return () => window.clearTimeout(t);
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !hasRun) {
            start();
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(node);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRun]);

  function start() {
    if (hasRun) return;
    setHasRun(true);
    track("demo_play", { source: "see_it_in_action" });
    runDemo();
  }

  async function runDemo() {
    setTyped([]);
    setRevealed(0);
    setPhase("typing");
    for (let i = 0; i < BRIEF_LINES.length; i++) {
      await wait(420);
      setTyped((prev) => [...prev, BRIEF_LINES[i]!]);
    }
    setPhase("thinking");
    await wait(1100);
    setPhase("reveal");
    for (let i = 1; i <= RUN_OF_SHOW.length; i++) {
      await wait(280);
      setRevealed(i);
    }
    setPhase("done");
  }

  function replay() {
    setHasRun(false);
    setTimeout(() => start(), 50);
  }

  return (
    <section
      ref={sectionRef}
      id="see-it"
      aria-labelledby="see-it-title"
      className="border-t border-card-border"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2
            id="see-it-title"
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900"
          >
            See it in action.
          </h2>
          <p className="mt-4 text-stone-600">
            Paste a short brief. Watch a 20-page run-of-show appear in seconds.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Brief input panel */}
          <div className="card p-5 flex flex-col">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Brief · Couple notes</span>
              <span
                aria-live="polite"
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  phase === "typing"
                    ? "bg-amber-100 text-amber-800"
                    : phase === "thinking"
                    ? "bg-stone-100 text-stone-700"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {phase === "typing"
                  ? "Pasting…"
                  : phase === "thinking"
                  ? "Drafting…"
                  : phase === "idle"
                  ? "Ready"
                  : "Sent to AI"}
              </span>
            </div>
            <div
              className="mt-3 flex-1 rounded-lg bg-stone-50 border border-stone-200 p-4 text-sm font-mono text-stone-700 min-h-[180px]"
              aria-live="polite"
            >
              {typed.length === 0 && phase === "idle" ? (
                <span className="text-stone-400">
                  Paste your couple's planning notes here…
                </span>
              ) : (
                <ul className="space-y-1.5">
                  {typed.map((line, i) => (
                    <li key={i}>· {line}</li>
                  ))}
                  {phase === "typing" && (
                    <li className="inline-block h-4 w-2 align-middle bg-stone-700 animate-pulse" />
                  )}
                </ul>
              )}
            </div>
            <button
              type="button"
              onClick={replay}
              className="mt-4 self-start text-sm rounded-full border border-stone-300 bg-white px-4 py-2 text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors"
              aria-label="Replay demo"
            >
              ↻ Replay demo
            </button>
          </div>

          {/* Generated run-of-show panel */}
          <div className="card p-5 shadow-[0_20px_60px_-30px_rgba(120,80,40,0.25)]">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Run-of-Show · Auto-draft</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-semibold">
                AI · 42s
              </span>
            </div>
            <div className="mt-3 text-sm text-stone-900 font-medium">
              Reyes × Okoye · Sat, May 30, 2026
            </div>

            <div className="mt-4 min-h-[260px]">
              {phase === "thinking" ? (
                <div className="flex items-center gap-3 text-sm text-stone-500">
                  <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  Reading brief, scoring vendor timing, drafting blocks…
                </div>
              ) : (
                <ol className="space-y-3">
                  {RUN_OF_SHOW.map(([time, label], i) => (
                    <li
                      key={time}
                      className={`flex gap-3 text-sm transition-all duration-300 ${
                        i < revealed
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2"
                      }`}
                      aria-hidden={i >= revealed}
                    >
                      <span className="text-amber-700 font-semibold w-16 shrink-0">
                        {time}
                      </span>
                      <span className="text-stone-700">{label}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {phase === "done" && (
              <div className="mt-5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Drafted from {BRIEF_LINES.length}-line brief in 42s · ready for client review
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
