"use client";

import React, { useState } from "react";

interface BuyPreviewWidgetProps {
  initialBaseTokens?: number;
  initialBonusRate?: number;
  compact?: boolean;
}

export function BuyPreviewWidget({
  initialBaseTokens = 10000,
  initialBonusRate = 5,
  compact = false,
}: BuyPreviewWidgetProps) {
  const [baseInput, setBaseInput] = useState<string>(String(initialBaseTokens));
  const [bonusRate, setBonusRate] = useState<number>(initialBonusRate);

  const numericBase = Math.max(0, Number(baseInput.replace(/[^0-9.]/g, "")) || 0);
  const extraTokens = Math.round(numericBase * (bonusRate / 100));
  const totalReceived = numericBase + extraTokens;
  const otherLaunchpads = Math.round(numericBase * 0.99);

  return (
    <div className="receipt-edge relative rounded-2xl border border-white/[0.08] bg-[#13101E]/95 p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
      {/* Top header */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.14em] uppercase text-[#555] mb-5">
        <span className="font-semibold text-[#D8B4FE]">BUY PREVIEW</span>
        <span>ILLUSTRATIVE</span>
      </div>

      {/* Inputs Row */}
      <div className={`grid grid-cols-1 ${compact ? " sm:grid-cols-2" : "sm:grid-cols-2"} gap-5 mb-6`}>
        <div>
          <label className="block text-[10px] font-mono tracking-[0.12em] uppercase text-[#555] mb-2">
            BASE SWAP OUTPUT
          </label>
          <div className="relative flex items-center rounded-lg border border-white/[0.08] bg-[#0B0912] px-3.5 py-2.5 focus-within:border-white/30">
            <input
              type="text"
              value={baseInput}
              onChange={(e) => setBaseInput(e.target.value)}
              aria-label="Base swap output tokens"
              className="w-full bg-transparent font-mono text-sm font-semibold text-white outline-none"
            />
            <span className="ml-2 text-[10px] font-mono uppercase tracking-wider text-[#555]">
              TOKENS
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.12em] uppercase mb-2">
            <span className="text-[#555]">BONUS TOKENS RATE</span>
            <span className="text-white font-bold">{bonusRate}%</span>
          </div>
          <div className="pt-2 pb-1">
            <input
              type="range"
              min={2}
              max={9}
              step={0.5}
              value={bonusRate}
              onChange={(e) => setBonusRate( parseFloat(e.target.value) )}
              aria-label="Bonus tokens rate percentage"
              className="bl-slider w-full"
            />
          </div>
          <div className="text-[11px] text-[#555] mt-1">Set per launch (2% – 9%)</div>
        </div>
      </div>

      {/* Breakdown lines */}
      <div className="space-y-2.5 border-t border-dashed border-white/[0.08] pt-4 text-xs font-mono">
        <div className="flex items-center justify-between text-[#777]">
          <span>Base tokens</span>
          <span className="text-white font-semibold">
            {numericBase.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-[#777]">
          <span>
            Extra tokens{" "}
            <strong className="text-white font-semibold">+{bonusRate}%</strong>
          </span>
          <span className="text-white font-semibold">
            +{extraTokens.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Total Received */}
      <div className="mt-4 border-t border-dashed border-white/[0.08] pt-4 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#555]">
            TOTAL RECEIVED
          </div>
          <p className="mt-2 max-w-[230px] text-[11px] leading-relaxed text-[#555]">
            Bonus tokens are added to the base swap output. Not tax relief, and no
            protection against price changes.
          </p>
        </div>

        <div className="text-right">
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {totalReceived.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-[#555] mt-0.5">
            Other Launchpads: {otherLaunchpads.toLocaleString()}
          </div>
          <div className="mt-2.5 inline-block -rotate-3 rounded border border-white/30/60 bg-white/15 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#D8B4FE] shadow-[0_0_16px_rgba(255,255,255,0.25)]">
            +{extraTokens.toLocaleString()} EXTRA
          </div>
        </div>
      </div>
    </div>
  );
}
