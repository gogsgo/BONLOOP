"use client";

import React, { useState, useMemo, useRef } from "react";
import { TOKEN_ARTWORKS } from "@/lib/seed-data";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  LayoutGrid,
  List,
  Compass,
  Calculator,
  Coins,
  Gift,
  Lock,
} from "lucide-react";
import { useRebateStore, type TokenItem } from "@/store/useRebateStore";
import { BuyPreviewWidget } from "@/components/BuyPreviewWidget";

type ExplorerTab = "trending" | "new" | "mcap" | "bonus" | "payouts";
type CapTier = "all" | "under50k" | "50k-250k" | "250k-1m" | "over1m";

function formatCompactUsd(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
  return `$${val.toFixed(1)}`;
}

export function DiscoverView() {
  const {
    tokens,
    searchQuery,
    openTokenSwap,
    setActiveTab,
    bonusTokensCreditedUsd,
    bonusTokensCreditedCountM,
  } = useRebateStore();

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [explorerTab, setExplorerTab] = useState<ExplorerTab>("trending");
  const [capTier, setCapTier] = useState<CapTier>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [buyerStartBonus, setBuyerStartBonus] = useState<number>(5);

  const explorerRef = useRef<HTMLDivElement>(null);

  const featuredTokens = useMemo(() => {
    const feat = tokens.filter((t) => t.isFeatured);
    return feat.length >= 5 ? feat.slice(0, 5) : tokens.slice(0, 5);
  }, [tokens]);

  const activeFeatured = featuredTokens[featuredIndex] || tokens[0];

  const filteredTokens = useMemo(() => {
    let list = [...tokens];

    // Global search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.ticker.toLowerCase().includes(q) ||
          t.pairAsset.toLowerCase().includes(q)
      );
    }

    // Market cap tier filter
    if (capTier === "under50k") {
      list = list.filter((t) => t.marketCap < 50_000);
    } else if (capTier === "50k-250k") {
      list = list.filter((t) => t.marketCap >= 50_000 && t.marketCap <= 250_000);
    } else if (capTier === "250k-1m") {
      list = list.filter((t) => t.marketCap > 250_000 && t.marketCap < 1_000_000);
    } else if (capTier === "over1m") {
      list = list.filter((t) => t.marketCap >= 1_000_000);
    }

    // Tab sorting / filtering
    if (explorerTab === "trending") {
      list.sort((a, b) => b.volume24h - a.volume24h);
    } else if (explorerTab === "new") {
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (explorerTab === "mcap") {
      list.sort((a, b) => b.marketCap - a.marketCap);
    } else if (explorerTab === "bonus") {
      list.sort((a, b) => b.bonusRate - a.bonusRate);
    } else if (explorerTab === "payouts") {
      list = list
        .filter((t) => t.payoutRate > 0)
        .sort((a, b) => b.payoutRate - a.payoutRate);
    }

    return list;
  }, [tokens, searchQuery, capTier, explorerTab]);

  // Convert buyerStartBonus (2% to 9%) to percentage position on -6% to +10% scale
  // Scale spans 16 units (-6 to +10). 0% is at 6/16 = 37.5%.
  const zeroPercentPos = 37.5;
  const bonusMarkerPos = ((buyerStartBonus + 6) / 16) * 100;

  return (
    <div className="w-full">
      {/* Top 24H Trending Ticker Strip */}
      <div className="border-b border-white/[0.06] bg-[#0B0A10]/90 px-4 sm:px-8 py-2.5 flex items-center gap-4 overflow-x-auto no-scrollbar">
        <div className="shrink-0 text-[10px] font-mono uppercase tracking-[0.14em] text-[#7E7896] leading-tight">
          <div>TRENDING</div>
          <div className="text-[#645E78]">24H</div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto py-0.5">
          {tokens.slice(0, 6).map((token, idx) => {
            const isPositive = token.change24h >= 0;
            return (
              <button
                key={token.slug}
                onClick={() => openTokenSwap(token.slug)}
                className="shrink-0 flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-[#12101B] hover:bg-[#191626] hover:border-[#8B5CF6]/40 px-3 py-1.5 transition-all cursor-pointer group"
              >
                <span className="text-xs font-mono text-[#645E78] font-bold">
                  {idx + 1}
                </span>
                <img
                  src={token.logoUrl}
                  alt={token.name}
                  className="w-6 h-6 rounded-md object-cover bg-[#1B162B]"
                />
                <div className="text-left">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-white group-hover:text-[#D8B4FE]">
                      ${token.ticker}
                    </span>
                    <span
                      className={`text-[11px] ${
                        isPositive ? "text-[#22C55E]" : "text-[#EF4444]"
                      }`}
                    >
                      {isPositive ? "↗" : "↘"}{" "}
                      {isPositive ? `+${token.change24h}%` : `${token.change24h}%`}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#C084FC] font-semibold">
                    +{token.bonusRate}% bonus
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1260px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
        {/* HERO SECTION */}
        <section className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* Left Column: Headline + Copy + CTAs + Mascot */}
            <div className="lg:col-span-6 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-[#D8B4FE] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                <span>LIVE ON ROBINHOOD CHAIN</span>
              </div>

              <h1
                className="text-5xl sm:text-6xl xl:text-[68px] font-bold tracking-[-0.035em] leading-[1.02] text-white"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                Nobody
                <br />
                starts
                <br />
                from{" "}
                <span className="text-stroke-violet italic pr-2">zero.</span>
              </h1>

              <p className="mt-5 max-w-md text-[15px] sm:text-base leading-relaxed text-[#948FA8]">
                Buy a token, get{" "}
                <strong className="text-white font-semibold">bonus tokens</strong>{" "}
                on top. Hold it, get paid in{" "}
                <strong className="text-white font-semibold">ETH or USDG</strong>.
                Built into every launch.
              </p>

              {/* Hero Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openTokenSwap("rebate")}
                  className="h-11 px-5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-sm font-semibold text-white shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all cursor-pointer"
                >
                  Buy $REBATE
                </button>
                <button
                  onClick={() =>
                    explorerRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="h-11 px-5 rounded-xl border border-white/[0.1] bg-[#141120] hover:bg-[#1C182B] text-sm font-semibold text-white transition-colors cursor-pointer"
                >
                  Explore tokens
                </button>
                <button
                  onClick={() => setActiveTab("launch")}
                  className="h-11 px-5 rounded-xl border border-white/[0.1] bg-[#141120] hover:bg-[#1C182B] text-sm font-semibold text-[#D8B4FE] transition-colors cursor-pointer"
                >
                  Launch a token
                </button>
              </div>
            </div>

            {/* Right Column: Ruby Mascot Peeking + Interactive Buy Preview Card */}
            <div className="lg:col-span-6 relative">
              {/* Ruby Mascot peeking on the left of the Buy Preview card */}
              <div className="hidden xl:block absolute -left-24 bottom-2 w-36 h-36 z-20 pointer-events-none select-none drop-shadow-[0_12px_28px_rgba(139,92,246,0.45)]">
                <img
                  src={TOKEN_ARTWORKS.ruby}
                  alt="Ruby Mascot"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
              <BuyPreviewWidget initialBaseTokens={10000} initialBonusRate={5} />
            </div>
          </div>

          {/* Interactive "WHERE A BUYER STARTS · drag to try" Comparison Bar */}
          <div className="mt-14 pt-6 border-t border-white/[0.06]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#7E7896] mb-4">
              <span>WHERE A BUYER STARTS · DRAG SLIDER TO COMPARE</span>
              <span>OTHERS AT TYPICAL RATES. BONUS SET PER LAUNCH</span>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#110E1A] p-5 sm:p-6">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#645E78] mb-3">
                <span className="text-[#EF4444]/80">← BUY TAX (OTHER PADS)</span>
                <span className="text-[#C084FC]">
                  INSTANT BONUS ON REBATE PAD →
                </span>
              </div>

              {/* Visual Track */}
              <div className="relative h-10 rounded-xl bg-[#09080E] border border-white/[0.06] flex items-center px-2 overflow-visible">
                {/* Zero Center Line */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-white/30 z-10"
                  style={{ left: `${zeroPercentPos}%` }}
                />

                {/* Purple Bonus Fill Bar from 0% to current buyerStartBonus */}
                <div
                  className="h-5 rounded-r-md bg-gradient-to-r from-[#6D28D9]/60 to-[#A855F7] transition-all duration-150 relative"
                  style={{
                    marginLeft: `${zeroPercentPos}%`,
                    width: `${Math.max(2, bonusMarkerPos - zeroPercentPos)}%`,
                  }}
                >
                  {/* Floating Callout Pill */}
                  <div className="absolute -top-9 right-0 translate-x-1/2 whitespace-nowrap rounded-md border border-[#A855F7] bg-[#1E1538] px-2.5 py-1 text-[11px] font-mono font-bold text-white shadow-[0_0_16px_rgba(168,85,247,0.45)]">
                    You start here +{buyerStartBonus}%
                  </div>
                </div>
              </div>

              {/* Interactive Range Control for the Buyer Bonus */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-[11px] font-mono text-[#948FA8] shrink-0">
                  Adjust Launch Bonus:
                </span>
                <input
                  type="range"
                  min={2}
                  max={9}
                  step={0.5}
                  value={buyerStartBonus}
                  onChange={(e) => setBuyerStartBonus(parseFloat(e.target.value))}
                  aria-label="Compare buyer starting bonus rate"
                  className="rebate-slider flex-1"
                />
                <span className="font-mono text-xs font-bold text-[#C084FC] w-12 text-right">
                  +{buyerStartBonus}%
                </span>
              </div>

              {/* Scale Ticks & Comparison Benchmarks */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/[0.05] text-[11px] font-mono">
                <div className="rounded-lg bg-[#0B0912] px-3 py-2 border border-white/[0.04]">
                  <div className="text-[#EF4444] font-bold">-5%</div>
                  <div className="text-[10px] text-[#645E78]">TAX LAUNCH</div>
                </div>
                <div className="rounded-lg bg-[#0B0912] px-3 py-2 border border-white/[0.04]">
                  <div className="text-[#F59E0B] font-bold">-2%</div>
                  <div className="text-[10px] text-[#645E78]">
                    V4 REFLECTIONS LAUNCH
                  </div>
                </div>
                <div className="rounded-lg bg-[#0B0912] px-3 py-2 border border-white/[0.04]">
                  <div className="text-[#948FA8] font-bold">0%</div>
                  <div className="text-[10px] text-[#645E78]">
                    STANDARD V2 LAUNCH
                  </div>
                </div>
                <div className="rounded-lg bg-[#1A132F] px-3 py-2 border border-[#8B5CF6]/40">
                  <div className="text-[#C084FC] font-bold">
                    +{buyerStartBonus}% EXTRA TOKENS
                  </div>
                  <div className="text-[10px] text-[#D8B4FE]">
                    REBATE PAD LAUNCH
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Protocol Live Summary Metrics */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 py-4 border-b border-white/[0.06]">
              <div>
                <div className="font-mono text-2xl font-bold text-white">
                  {tokens.length}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#645E78] mt-1">
                  TOKENS LIVE
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-white">
                  +{bonusTokensCreditedCountM.toFixed(2)}M{" "}
                  <span className="text-[#7E7896]">·</span> $
                  {(bonusTokensCreditedUsd / 1000).toFixed(1)}K
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#645E78] mt-1">
                  BONUS TOKENS PAID
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-white">
                  $11.1K
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#645E78] mt-1">
                  HOLDER PAYOUTS
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED LAUNCHES SECTION */}
        {activeFeatured && (
          <section className="mt-12">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Featured launches
                </h2>
                <p className="text-xs text-[#7E7896] mt-0.5">
                  Now showing {activeFeatured.name} (${activeFeatured.ticker})
                </p>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setFeaturedIndex(
                      (prev) =>
                        (prev - 1 + featuredTokens.length) %
                        featuredTokens.length
                    )
                  }
                  aria-label="Previous featured token"
                  className="p-2 rounded-lg border border-white/[0.08] bg-[#12101B] text-[#948FA8] hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsAutoPlaying((v) => !v)}
                  aria-label="Toggle autoplay"
                  className="p-2 rounded-lg border border-white/[0.08] bg-[#12101B] text-[#948FA8] hover:text-white cursor-pointer"
                >
                  {isAutoPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() =>
                    setFeaturedIndex(
                      (prev) => (prev + 1) % featuredTokens.length
                    )
                  }
                  aria-label="Next featured token"
                  className="p-2 rounded-lg border border-white/[0.08] bg-[#12101B] text-[#948FA8] hover:text-white cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Featured Spotlight Card */}
              <div
                onClick={() => openTokenSwap(activeFeatured.slug)}
                className="lg:col-span-7 rounded-2xl border border-white/[0.09] bg-[#12101B] hover:border-[#8B5CF6]/50 p-5 sm:p-6 transition-all cursor-pointer group flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="w-full sm:w-56 h-56 shrink-0 rounded-xl overflow-hidden bg-[#0B0912] border border-white/[0.06]">
                  <img
                    src={activeFeatured.logoUrl}
                    alt={activeFeatured.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 w-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-[#D8B4FE] transition-colors">
                          {activeFeatured.name}
                        </h3>
                        <div className="text-xs font-mono text-[#7E7896] mt-0.5">
                          ${activeFeatured.ticker} · {activeFeatured.ageLabel}{" "}
                          by {activeFeatured.creatorAddress}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-2xl font-bold text-[#C084FC]">
                          +{activeFeatured.bonusRate}%
                        </div>
                        <div className="text-[9px] font-mono uppercase tracking-wider text-[#7E7896]">
                          BONUS TOKENS
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-[#948FA8] line-clamp-2">
                      {activeFeatured.description}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#645E78]">
                        MARKET CAP
                      </div>
                      <div className="font-mono text-sm font-bold text-white mt-0.5">
                        {formatCompactUsd(activeFeatured.marketCap)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#645E78]">
                        VOL 24H
                      </div>
                      <div className="font-mono text-sm font-bold text-white mt-0.5">
                        {formatCompactUsd(activeFeatured.volume24h)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#645E78]">
                        24H
                      </div>
                      <div
                        className={`font-mono text-sm font-bold mt-0.5 ${
                          activeFeatured.change24h >= 0
                            ? "text-[#22C55E]"
                            : "text-[#EF4444]"
                        }`}
                      >
                        {activeFeatured.change24h >= 0 ? "↗ +" : "↘ "}
                        {activeFeatured.change24h}%
                      </div>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <div className="text-[11px] font-mono text-[#948FA8]">
                      <strong className="text-white">
                        {activeFeatured.holdersCount.toLocaleString()}
                      </strong>{" "}
                      holders ·{" "}
                      <span className="text-[#C084FC]">
                        {activeFeatured.payoutRate}% holder payouts in{" "}
                        {activeFeatured.pairAsset}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#8B5CF6] group-hover:bg-[#7C3AED] px-3.5 py-2 text-xs font-semibold text-white transition-colors shrink-0">
                      <span>View token</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Vertical Selector Stack of 5 Featured Tokens */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-2.5">
                {featuredTokens.map((item, idx) => {
                  const isSelected = idx === featuredIndex;
                  const isPos = item.change24h >= 0;
                  return (
                    <button
                      key={item.slug}
                      onClick={() => setFeaturedIndex(idx)}
                      onDoubleClick={() => openTokenSwap(item.slug)}
                      className={`w-full rounded-xl border p-3 flex items-center justify-between transition-all cursor-pointer text-left ${
                        isSelected
                          ? "border-[#8B5CF6]/60 bg-[#1B152E] shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                          : "border-white/[0.06] bg-[#12101B] hover:bg-[#171422]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.logoUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-[#0B0912]"
                        />
                        <div>
                          <div className="text-sm font-bold text-white">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono text-[#7E7896]">
                            <span>${item.ticker}</span>
                            <span className="text-white font-semibold">
                              {formatCompactUsd(item.marketCap)}
                            </span>
                            <span
                              className={
                                isPos ? "text-[#22C55E]" : "text-[#EF4444]"
                              }
                            >
                              {isPos ? "↗ +" : "↘ "}
                              {item.change24h}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-[#C084FC]">
                          +{item.bonusRate}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* DISCOVER TOKENS EXPLORER SECTION */}
        <section ref={explorerRef} className="mt-14">
          <div className="mb-5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Discover tokens
            </h2>
            <p className="text-xs text-[#7E7896] mt-0.5">
              Every token launched on Rebate Pad on Robinhood Chain, with prices
              from the pools.
            </p>
          </div>

          {/* Primary Filter Tabs Bar */}
          <div className="rounded-xl border border-white/[0.07] bg-[#12101B] p-1.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1">
              {(
                [
                  { id: "trending", label: "Trending" },
                  { id: "new", label: "New" },
                  { id: "mcap", label: "Market Cap" },
                  { id: "bonus", label: "Bonus Tokens" },
                  { id: "payouts", label: "Holder Payouts" },
                ] as { id: ExplorerTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setExplorerTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    explorerTab === tab.id
                      ? "bg-[#241B3D] text-[#D8B4FE] border border-[#8B5CF6]/40"
                      : "text-[#948FA8] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pr-2">
              <span className="text-xs font-mono text-[#7E7896]">
                {filteredTokens.length} tokens
              </span>
              <div className="flex items-center rounded-lg border border-white/[0.08] bg-[#0B0912] p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`p-1.5 rounded-md ${
                    viewMode === "grid"
                      ? "bg-[#241B3D] text-[#C084FC]"
                      : "text-[#645E78] hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  aria-label="Table view"
                  className={`p-1.5 rounded-md ${
                    viewMode === "table"
                      ? "bg-[#241B3D] text-[#C084FC]"
                      : "text-[#645E78] hover:text-white"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Market Cap Tier Pills */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "all", label: "All caps" },
                { id: "under50k", label: "Under $50K" },
                { id: "50k-250k", label: "$50K to $250K" },
                { id: "250k-1m", label: "$250K to $1M" },
                { id: "over1m", label: "$1M+" },
              ] as { id: CapTier; label: string }[]
            ).map((tier) => (
              <button
                key={tier.id}
                onClick={() => setCapTier(tier.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                  capTier === tier.id
                    ? "border-[#8B5CF6]/50 bg-[#1F1835] text-[#D8B4FE]"
                    : "border-white/[0.06] bg-[#12101B] text-[#7E7896] hover:text-white"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>

          {/* Token Explorer Content: Grid or Table */}
          {viewMode === "grid" ? (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTokens.map((token) => (
                <TokenCard
                  key={token.slug}
                  token={token}
                  onSelect={() => openTokenSwap(token.slug)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#12101B] overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-[#645E78]">
                    <th className="py-3.5 px-4">TOKEN</th>
                    <th className="py-3.5 px-4">PAIR</th>
                    <th className="py-3.5 px-4">BONUS RATE</th>
                    <th className="py-3.5 px-4">MARKET CAP</th>
                    <th className="py-3.5 px-4">24H VOL</th>
                    <th className="py-3.5 px-4">24H CHANGE</th>
                    <th className="py-3.5 px-4">PAYOUT STRUCTURE</th>
                    <th className="py-3.5 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-xs font-mono">
                  {filteredTokens.map((token) => {
                    const isPos = token.change24h >= 0;
                    return (
                      <tr
                        key={token.slug}
                        onClick={() => openTokenSwap(token.slug)}
                        className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={token.logoUrl}
                              alt={token.name}
                              className="w-9 h-9 rounded-lg object-cover bg-[#0B0912]"
                            />
                            <div>
                              <div className="font-sans font-bold text-sm text-white">
                                {token.name}
                              </div>
                              <div className="text-[11px] text-[#7E7896]">
                                ${token.ticker} · {token.ageLabel}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white">{token.pairAsset}</td>
                        <td className="py-3 px-4">
                          <span className="rounded bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-2 py-0.5 font-bold text-[#C084FC]">
                            +{token.bonusRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {formatCompactUsd(token.marketCap)}
                        </td>
                        <td className="py-3 px-4 text-[#948FA8]">
                          {formatCompactUsd(token.volume24h)}
                        </td>
                        <td
                          className={`py-3 px-4 font-bold ${
                            isPos ? "text-[#22C55E]" : "text-[#EF4444]"
                          }`}
                        >
                          {isPos ? "↗ +" : "↘ "}
                          {token.change24h}%
                        </td>
                        <td className="py-3 px-4 text-[#948FA8] font-sans">
                          {token.payoutRate > 0
                            ? `${token.payoutRate}% ${
                                token.payoutRecipient === "holders"
                                  ? `holder payouts in ${token.pairAsset}`
                                  : "to the creator"
                              }`
                            : "No holder payouts"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-sans font-semibold text-xs">
                            Swap
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* BOTTOM "HOW IT WORKS" 4-STEP PREVIEW STRIP */}
        <section className="mt-20 pt-10 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">How it works</h2>
            <button
              onClick={() => setActiveTab("guide")}
              className="text-xs font-mono text-[#948FA8] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>Read the details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-white/[0.06] bg-[#12101B] p-5">
              <div className="w-8 h-8 rounded-lg bg-[#1F1835] border border-[#8B5CF6]/30 flex items-center justify-center text-[#C084FC] mb-4">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Choose a token</h3>
              <p className="text-xs text-[#7E7896] mt-1.5 leading-relaxed">
                Browse launches, compare bonus and payout rates, open the one you
                like.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-[#12101B] p-5">
              <div className="w-8 h-8 rounded-lg bg-[#1F1835] border border-[#8B5CF6]/30 flex items-center justify-center text-[#C084FC] mb-4">
                <Calculator className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Preview your bonus
              </h3>
              <p className="text-xs text-[#7E7896] mt-1.5 leading-relaxed">
                See base tokens, bonus tokens and the total before you buy.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-[#12101B] p-5">
              <div className="w-8 h-8 rounded-lg bg-[#1F1835] border border-[#8B5CF6]/30 flex items-center justify-center text-[#C084FC] mb-4">
                <Gift className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Buy and receive more
              </h3>
              <p className="text-xs text-[#7E7896] mt-1.5 leading-relaxed">
                The bonus tokens arrive together with your base swap output in the
                same transaction.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-[#12101B] p-5">
              <div className="w-8 h-8 rounded-lg bg-[#1F1835] border border-[#8B5CF6]/30 flex items-center justify-center text-[#C084FC] mb-4">
                <Coins className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Hold and get paid</h3>
              <p className="text-xs text-[#7E7896] mt-1.5 leading-relaxed">
                Holder payouts land in your wallet in the pair asset, several
                times a day. The longer you hold, the bigger your share.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function TokenCard({
  token,
  onSelect,
}: {
  token: TokenItem;
  onSelect: () => void;
}) {
  const isPos = token.change24h >= 0;

  return (
    <div
      onClick={onSelect}
      className="rounded-2xl border border-white/[0.07] bg-[#12101B] hover:bg-[#171424] hover:border-[#8B5CF6]/50 hover:-translate-y-0.5 transition-all duration-200 p-4 flex flex-col justify-between cursor-pointer group shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
    >
      <div>
        {/* Square Token Artwork */}
        <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#09080E] border border-white/[0.05] mb-4 relative">
          <img
            src={token.logoUrl}
            alt={token.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {token.snipeProtection && (
            <div className="absolute top-2.5 left-2.5 rounded-md bg-black/70 backdrop-blur-md border border-white/[0.1] px-2 py-0.5 text-[10px] font-mono text-[#948FA8] flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-[#A855F7]" />
              <span>Locked Rules</span>
            </div>
          )}
        </div>

        {/* Title Row + Bonus Rate */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-[#D8B4FE] transition-colors">
              {token.name}
            </h3>
            <div className="text-[11px] font-mono text-[#7E7896] mt-0.5">
              ${token.ticker} · {token.ageLabel} · {token.pairAsset}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="font-mono text-lg font-bold text-[#C084FC] leading-none">
              +{token.bonusRate}%
            </div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-[#645E78] mt-1">
              BONUS TOKENS
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Metrics Strip */}
      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div>
            <div className="text-[9px] uppercase text-[#645E78]">MC</div>
            <div className="font-bold text-white mt-0.5">
              {formatCompactUsd(token.marketCap)}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-[#645E78]">VOL 24H</div>
            <div className="font-bold text-white mt-0.5">
              {formatCompactUsd(token.volume24h)}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-[#645E78]">24H</div>
            <div
              className={`font-bold mt-0.5 ${
                isPos ? "text-[#22C55E]" : "text-[#EF4444]"
              }`}
            >
              {isPos ? "↗ +" : "↘ "}
              {token.change24h}%
            </div>
          </div>
        </div>

        {/* Payout Footer */}
        <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-[#948FA8]">
          <div className="flex items-center gap-1.5 truncate">
            <Coins className="w-3.5 h-3.5 text-[#A855F7] shrink-0" />
            <span className="truncate">
              {token.payoutRate > 0
                ? token.payoutRecipient === "holders"
                  ? `${token.payoutRate}% holder payouts in ${token.pairAsset}`
                  : `${token.payoutRate}% to the creator`
                : "No holder payouts"}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#C084FC] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            Swap →
          </span>
        </div>
      </div>
    </div>
  );
}
