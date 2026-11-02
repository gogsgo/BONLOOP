"use client";

import React, { useState, useEffect } from "react";
import { Radio, Zap } from "lucide-react";
import { useRebateStore } from "@/store/useRebateStore";

type ActivityFilter = "All" | "Buys" | "Sells" | "Payouts" | "Launches";

function formatTokenCount(n: number): string {
  if (n <= 0) return "-";
  if (n >= 1_000_000) return `+${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `+${(n / 1_000).toFixed(2)}K`;
  return `+${n.toFixed(2)}`;
}

export function ActivityView() {
  const {
    activities,
    openTokenSwap,
    bonusTokensCreditedCountM,
    totalBuysCount,
    holderPayoutsUsd,
    payoutRounds,
    rebateBurnedM,
    simulateLiveBlockEvent,
  } = useRebateStore();

  const [filter, setFilter] = useState<ActivityFilter>("All");
  const [liveStream, setLiveStream] = useState<boolean>(true);

  useEffect(() => {
    if (!liveStream) return;
    const interval = setInterval(() => {
      simulateLiveBlockEvent();
    }, 6500);
    return () => clearInterval(interval);
  }, [liveStream, simulateLiveBlockEvent]);

  const filteredActivities = activities.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Buys") return item.type === "Buy";
    if (filter === "Sells") return item.type === "Sell";
    if (filter === "Payouts") return item.type === "Payout";
    if (filter === "Launches") return item.type === "Launch";
    return true;
  });

  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
      {/* Header matching Reference Image 4 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            Activity
          </h1>
          <p className="text-sm text-[#948FA8] mt-1.5">
            Recent launches, trades and holder payouts across the pad. Updates
            as blocks land.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => simulateLiveBlockEvent()}
            className="h-9 px-3.5 rounded-lg border border-white/[0.1] bg-[#151221] hover:bg-[#1E1A2E] text-xs font-mono text-[#D8B4FE] flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Simulate Block</span>
          </button>

          <button
            onClick={() => setLiveStream((v) => !v)}
            className={`h-9 px-3.5 rounded-lg border text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors ${
              liveStream
                ? "border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E]"
                : "border-white/[0.08] bg-[#12101B] text-[#7E7896]"
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${liveStream ? "animate-pulse" : ""}`} />
            <span>{liveStream ? "Live Indexer: ON" : "Live Indexer: PAUSED"}</span>
          </button>
        </div>
      </div>

      {/* Since Launch Protocol Summary Strip */}
      <div className="text-xs font-mono text-[#7E7896] mb-6">
        Since launch:{" "}
        <strong className="text-[#C084FC]">
          +{bonusTokensCreditedCountM.toFixed(2)}M
        </strong>{" "}
        bonus tokens on {totalBuysCount.toLocaleString()} buys,{" "}
        <strong className="text-white">
          $
          {holderPayoutsUsd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </strong>{" "}
        paid to holders in {payoutRounds} rounds,{" "}
        <strong className="text-[#C084FC]">{rebateBurnedM.toFixed(2)}M</strong>{" "}
        $REBATE burned
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5">
        {(["All", "Buys", "Sells", "Payouts", "Launches"] as ActivityFilter[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                filter === tab
                  ? "border-[#8B5CF6] bg-[#21183C] text-[#D8B4FE]"
                  : "border-white/[0.07] bg-[#12101B] text-[#7E7896] hover:text-white"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* High-Density Monospace Ledger Table matching Reference Image 4 */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0D0B14] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#12101B] text-[10px] font-mono uppercase tracking-[0.14em] text-[#645E78]">
                <th className="py-3.5 px-5">TIME</th>
                <th className="py-3.5 px-4">TYPE</th>
                <th className="py-3.5 px-4">ACCOUNT</th>
                <th className="py-3.5 px-4">TOKEN</th>
                <th className="py-3.5 px-4 text-right">AMOUNT</th>
                <th className="py-3.5 px-5 text-right">BONUS TOKENS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs font-mono">
              {filteredActivities.map((act, idx) => {
                const isBuy = act.type === "Buy";
                const isSell = act.type === "Sell";
                const isPayout = act.type === "Payout";

                return (
                  <tr
                    key={`${act.id || idx}-${act.txHash}-${idx}`}
                    onClick={() => openTokenSwap(act.tokenSlug)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-5 text-[#7E7896] whitespace-nowrap">
                      {act.timeLabel}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-bold">
                      <span
                        className={
                          isBuy
                            ? "text-[#22C55E]"
                            : isSell
                            ? "text-[#EF4444]"
                            : isPayout
                            ? "text-[#C084FC]"
                            : "text-[#60A5FA]"
                        }
                      >
                        {act.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#948FA8] whitespace-nowrap">
                      {act.account}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-sans font-bold text-white">
                        {act.tokenName}
                      </span>{" "}
                      <span className="text-[#645E78]">${act.tokenTicker}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white whitespace-nowrap">
                      ${act.amountUsd.toFixed(2)}
                    </td>
                    <td className="py-3 px-5 text-right whitespace-nowrap">
                      {isBuy && act.bonusTokens > 0 ? (
                        <span className="text-[#C084FC] font-semibold">
                          {formatTokenCount(act.bonusTokens)}
                        </span>
                      ) : (
                        <span className="text-[#645E78]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
