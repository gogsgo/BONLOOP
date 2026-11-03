"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRebateStore } from "@/store/useRebateStore";
import { CanvasBg } from "@/components/CanvasBg";

/* ─── Text scramble hook ─────────────────────────── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!";

function useScramble(target: string, active: boolean) {
  const [text, setText] = useState(target);
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!active) { setText(target); return; }
    let it = 0;
    clearInterval(iv.current!);
    iv.current = setInterval(() => {
      setText(target.split("").map((c, i) =>
        i < it ? target[i] : c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join(""));
      if (it >= target.length) clearInterval(iv.current!);
      it += 1 / 2.5;
    }, 36);
    return () => clearInterval(iv.current!);
  }, [target, active]);
  return text;
}

/* ─── Ticker ─────────────────────────────────────── */
function Ticker() {
  const { tokens } = useRebateStore();
  const items = [...tokens.slice(0, 8), ...tokens.slice(0, 8)];
  return (
    <div className="border-b border-white/[0.07] ticker-wrap py-2.5 relative z-10">
      <div className="ticker-inner whitespace-nowrap select-none">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-3 mr-10 text-xs font-mono">
            <img src={t.logoUrl} alt="" className="w-4 h-4 rounded-full object-cover opacity-80" />
            <span className="text-white font-semibold">${t.ticker}</span>
            <span className={t.change24h >= 0 ? "text-white" : "text-white/40"}>
              {t.change24h >= 0 ? "+" : ""}{t.change24h.toFixed(1)}%
            </span>
            <span className="text-white/20">+{t.bonusRate}% bonus</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Steps ──────────────────────────────────────── */
const STEPS = [
  { n: "01", title: "Buy", body: "Swap into any BONLOOP token. Receive bonus tokens instantly on top — no claim, no wait." },
  { n: "02", title: "Hold", body: "Every trade through the pool routes creator fees to holders. Hold multiplier grows with time." },
  { n: "03", title: "Earn", body: "ETH and USDG accumulate in your portfolio. Claim any time. The loop never stops." },
];

/* ─── Main ───────────────────────────────────────── */
export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const { tokens, activities } = useRebateStore();
  const [heroActive, setHeroActive] = useState(false);
  const word = useScramble("LOOP", heroActive);

  const totalVol = tokens.reduce((s, t) => s + t.volume24h, 0);
  const totalMcap = tokens.reduce((s, t) => s + t.marketCap, 0);
  const totalHolders = tokens.reduce((s, t) => s + t.holdersCount, 0);

  useEffect(() => {
    const t = setTimeout(() => setHeroActive(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#e8e8e8] flex flex-col relative overflow-hidden">
      <CanvasBg />

      {/* Nav */}
      <header className="sticky top-0 z-40 bg-[#080808]/85 backdrop-blur-sm border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded overflow-hidden">
              <img
                src="/logo.webp"
                alt="BONLOOP"
                className="w-6 h-6 object-cover"
                style={{ filter: "grayscale(1) brightness(2) contrast(1.2)" }}
              />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-white font-mono">
              BON<span className="text-white/40">LOOP</span>
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-[12px] text-white/30 font-mono">
            <button onClick={onEnter} className="hover:text-white transition-colors">App</button>
            <span>Docs</span>
            <span>Chain</span>
          </nav>
          <button
            onClick={onEnter}
            className="text-[12px] font-mono font-semibold px-4 py-1.5 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-150"
          >
            Launch App
          </button>
        </div>
      </header>

      <Ticker />

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 animate-slide-up">
        <p className="font-mono text-[10px] tracking-[0.22em] text-white/30 uppercase mb-7">
          ◎ Live on Robinhood Chain
        </p>
        <h1 className="hero-line text-white mb-1">LAUNCH A TOKEN.</h1>
        <h1 className="hero-line mb-9">
          <span className="text-white">GET THE </span>
          <span className="text-stroke-lime">{word}.</span>
        </h1>
        <p className="text-white/40 text-lg max-w-lg leading-relaxed mb-10 animate-slide-up delay-2">
          Every buy through a BONLOOP pool earns instant bonus tokens on top.
          Every trade feeds ETH back to holders.
          Nobody starts from zero.
        </p>
        <div className="flex flex-wrap gap-3 animate-slide-up delay-3">
          <button
            onClick={onEnter}
            className="px-6 py-3 bg-white text-black font-bold text-[13px] font-mono hover:bg-white/80 transition-colors duration-150"
          >
            Launch a token
          </button>
          <button
            onClick={onEnter}
            className="px-6 py-3 border border-white/15 text-white/60 font-mono text-[13px] hover:border-white/40 hover:text-white transition-all duration-150"
          >
            Explore tokens
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="relative z-10 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-0 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-white/[0.05]">
          {[
            { label: "Tokens live", value: tokens.length || 14 },
            { label: "24h volume", value: `$${((totalVol || 434090) / 1000).toFixed(0)}K` },
            { label: "Market cap", value: `$${((totalMcap || 1200000) / 1_000_000).toFixed(1)}M` },
            { label: "Holders", value: (totalHolders || 8200).toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className="px-6 py-7">
              <div className="text-3xl font-bold text-white leading-none tabular-nums">{value}</div>
              <div className="text-[11px] text-white/25 font-mono mt-1.5 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it loops */}
      <section className="relative z-10 border-t border-white/[0.06] max-w-5xl mx-auto px-6 py-20 w-full">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-2xl font-bold text-white tracking-tight">The loop, explained.</h2>
          <span className="font-mono text-[10px] text-white/20 hidden sm:block">BONLOOP / MECHANICS</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-px bg-white/[0.05]">
          {STEPS.map(({ n, title, body }) => (
            <div key={n} className="bg-[#080808] p-8 hover:bg-[#0e0e0e] transition-colors group">
              <div className="font-mono text-[10px] text-white/25 mb-5 tracking-widest group-hover:text-white/50 transition-colors">{n}</div>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live activity */}
      <div className="relative z-10 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest">Recent activity</span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" />
              live
            </span>
          </div>
          <div className="space-y-0">
            {(activities.length ? activities : [
              { type: "Buy", account: "0x71C…89A2", tokenTicker: "REBATE", amountUsd: 420, timeLabel: "2m ago" },
              { type: "Buy", account: "0x3b5…f1c0", tokenTicker: "RUBY", amountUsd: 185, timeLabel: "4m ago" },
              { type: "Sell", account: "0x9a2…88de", tokenTicker: "APE", amountUsd: 310, timeLabel: "7m ago" },
              { type: "Buy", account: "0xc44…2291", tokenTicker: "HODL", amountUsd: 900, timeLabel: "12m ago" },
            ]).slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-white/[0.04] text-sm">
                <span className="font-mono text-[10px] text-white/30 w-8 shrink-0">{a.type.toUpperCase()}</span>
                <span className="text-white/30 font-mono text-xs truncate w-24">{a.account}</span>
                <span className="text-white font-semibold">${a.tokenTicker}</span>
                <span className="text-white/60 text-xs font-mono ml-auto">${typeof a.amountUsd === 'number' ? a.amountUsd.toFixed(0) : a.amountUsd}</span>
                <span className="text-white/20 text-xs font-mono hidden sm:block">{a.timeLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="relative z-10 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-start gap-8">
          <h2 className="text-white font-bold tracking-tight leading-none" style={{ fontSize: "clamp(2.5rem,7vw,6rem)" }}>
            Nobody starts<br />from <span className="text-stroke-lime">zero.</span>
          </h2>
          <p className="text-white/35 max-w-md text-base leading-relaxed">
            Launch your token on BONLOOP. Give every buyer an edge from block one.
            Bonus tokens. Real ETH payouts. Built on Robinhood Chain.
          </p>
          <button
            onClick={onEnter}
            className="px-8 py-4 bg-white text-black font-bold font-mono text-sm hover:bg-white/80 transition-colors duration-150"
          >
            Open the app
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-[10px] text-white/20">BONLOOP / ROBINHOOD CHAIN</span>
          <div className="flex items-center gap-5 text-[10px] text-white/20 font-mono">
            <button onClick={onEnter} className="hover:text-white transition-colors">App</button>
            <span>Docs</span>
            <span>X</span>
          </div>
          <span className="font-mono text-[10px] text-white/10">Seed data. Not financial advice.</span>
        </div>
      </footer>
    </div>
  );
}
