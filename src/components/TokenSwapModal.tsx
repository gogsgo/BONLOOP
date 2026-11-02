"use client";

import React, { useState } from "react";
import {
  X,
  ArrowDownUp,
  Sparkles,
  Copy,
  ShieldCheck,
  Coins,
  TrendingUp,
  Loader2,
  Wallet,
  BarChart3,
} from "lucide-react";
import { useRebateStore } from "@/store/useRebateStore";

const ETH_PRICE_USD = 2500;

export function TokenSwapModal() {
  const {
    selectedTokenSlug,
    openTokenSwap,
    tokens,
    holdings,
    isConnected,
    connectWallet,
    ethBalance,
    usdgBalance,
    executeSwap,
    addToast,
  } = useRebateStore();

  const [side, setSide] = useState<"Buy" | "Sell">("Buy");
  const [ethInput, setEthInput] = useState<string>("0.2");
  const [timeframe, setTimeframe] = useState<"1H" | "24H" | "7D" | "ALL">("24H");
  const [isSwapping, setIsSwapping] = useState(false);
  const [compareCustomRate, setCompareCustomRate] = useState<number | null>(null);

  if (!selectedTokenSlug) return null;

  const token = tokens.find((t) => t.slug === selectedTokenSlug);
  if (!token) return null;

  const userHolding = holdings.find((h) => h.tokenSlug === token.slug);
  const userTokenBalance = userHolding?.balance || 0;

  const numericEth = Math.max(0, parseFloat(ethInput) || 0);
  const tradeUsd =
    side === "Buy"
      ? numericEth * ETH_PRICE_USD
      : numericEth * ETH_PRICE_USD;

  const baseSwapOutput =
    token.priceUsd > 0 ? Math.round(tradeUsd / token.priceUsd) : 0;
  const effectiveBonusRate =
    compareCustomRate !== null ? compareCustomRate : token.bonusRate;
  const extraBonusTokens =
    side === "Buy"
      ? Math.round(baseSwapOutput * (token.bonusRate / 100))
      : 0;
  const totalReceived = baseSwapOutput + extraBonusTokens;

  // Comparison chart data
  const comparisonBars = [
    {
      label: "Tax Token Launch",
      rateLabel: "-5.0% Tax",
      rate: -5,
      netTokens: Math.round(baseSwapOutput * 0.95),
      color: "bg-[#EF4444]/70 border-[#EF4444]",
      textColor: "text-[#EF4444]",
    },
    {
      label: "V4 Reflections Pad",
      rateLabel: "-2.0% Tax",
      rate: -2,
      netTokens: Math.round(baseSwapOutput * 0.98),
      color: "bg-[#F59E0B]/70 border-[#F59E0B]",
      textColor: "text-[#F59E0B]",
    },
    {
      label: "Standard V2 Launch",
      rateLabel: "0% Bonus",
      rate: 0,
      netTokens: baseSwapOutput,
      color: "bg-[#645E78]/60 border-[#948FA8]",
      textColor: "text-[#948FA8]",
    },
    {
      label: `${token.name} ($${token.ticker})`,
      rateLabel: `+${effectiveBonusRate}% Bonus`,
      rate: effectiveBonusRate,
      netTokens: Math.round(baseSwapOutput * (1 + effectiveBonusRate / 100)),
      color: "bg-gradient-to-r from-[#7C3AED] to-[#A855F7] border-[#C084FC]",
      textColor: "text-[#C084FC]",
      highlight: true,
    },
    {
      label: "Rebate Pad Maximum",
      rateLabel: "+9.0% Max Bonus",
      rate: 9,
      netTokens: Math.round(baseSwapOutput * 1.09),
      color: "bg-gradient-to-r from-[#8B5CF6]/50 to-[#D8B4FE]/80 border-[#D8B4FE]",
      textColor: "text-[#D8B4FE]",
    },
  ];

  // Sparkline SVG points
  const history = token.priceHistory?.length
    ? token.priceHistory
    : [0.0001, 0.00012, 0.00011, 0.00014, 0.00016];
  const minP = Math.min(...history);
  const maxP = Math.max(...history);
  const rangeP = maxP - minP || 1;
  const chartPoints = history
    .map((val, idx) => {
      const x = (idx / Math.max(1, history.length - 1)) * 500;
      const y = 125 - ((val - minP) / rangeP) * 95;
      return `${x},${y}`;
    })
    .join(" ");

  const handleSwapSubmit = async () => {
    if (numericEth <= 0) return;
    if (!isConnected) {
      connectWallet("Robinhood Wallet");
    }
    setIsSwapping(true);
    await new Promise((r) => setTimeout(r, 650));
    await executeSwap({
      tokenSlug: token.slug,
      side,
      amountInEth: numericEth,
      amountUsd: tradeUsd,
      tokenAmountSell: side === "Sell" ? baseSwapOutput : undefined,
    });
    setIsSwapping(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-2xl border border-white/[0.1] bg-[#110E1A] shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-white/[0.07] bg-[#151221] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={token.logoUrl}
              alt={token.name}
              className="w-11 h-11 rounded-xl object-cover bg-[#0B0912] border border-white/[0.08]"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {token.name}
                </h2>
                <span className="font-mono text-xs text-[#948FA8]">
                  ${token.ticker}
                </span>
                <span className="rounded-md bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 px-2 py-0.5 font-mono text-[11px] font-bold text-[#D8B4FE]">
                  +{token.bonusRate}% Instant Bonus
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#7E7896] mt-0.5">
                <span>Pair: {token.pairAsset}</span>
                <span>·</span>
                <button
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(token.contractAddress);
                    }
                    addToast({
                      title: "Contract Address Copied",
                      subtitle: token.contractAddress,
                      type: "info",
                    });
                  }}
                  className="hover:text-white flex items-center gap-1"
                >
                  <span>
                    {token.contractAddress.slice(0, 6)}...
                    {token.contractAddress.slice(-4)}
                  </span>
                  <Copy className="w-3 h-3" />
                </button>
                <span>·</span>
                <span className="text-[#C084FC]">
                  {token.payoutRate}% {token.pairAsset} Holder Payouts
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => openTokenSwap(null)}
            aria-label="Close swap modal"
            className="p-2 rounded-xl border border-white/[0.08] bg-[#1B162B] text-[#948FA8] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main 2-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.07]">
          {/* LEFT COLUMN: Pool Metrics, Price Chart & Interactive Launchpad Bonus Comparison */}
          <div className="lg:col-span-7 p-5 sm:p-7 space-y-6">
            {/* Key Pool Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-white/[0.06] bg-[#0B0912] p-3">
                <div className="text-[10px] font-mono uppercase text-[#645E78]">
                  PRICE USD
                </div>
                <div className="font-mono text-sm font-bold text-white mt-0.5">
                  ${token.priceUsd.toFixed(6)}
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#0B0912] p-3">
                <div className="text-[10px] font-mono uppercase text-[#645E78]">
                  MARKET CAP
                </div>
                <div className="font-mono text-sm font-bold text-white mt-0.5">
                  ${token.marketCap.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#0B0912] p-3">
                <div className="text-[10px] font-mono uppercase text-[#645E78]">
                  24H VOLUME
                </div>
                <div className="font-mono text-sm font-bold text-white mt-0.5">
                  ${token.volume24h.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#0B0912] p-3">
                <div className="text-[10px] font-mono uppercase text-[#645E78]">
                  HOLDERS
                </div>
                <div className="font-mono text-sm font-bold text-white mt-0.5">
                  {token.holdersCount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Interactive Pool Price Chart */}
            <div className="rounded-xl border border-white/[0.07] bg-[#0B0912] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#A855F7]" />
                  <span className="text-xs font-bold text-white">
                    ${token.ticker} / {token.pairAsset} Pool Chart
                  </span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      token.change24h >= 0
                        ? "text-[#22C55E]"
                        : "text-[#EF4444]"
                    }`}
                  >
                    {token.change24h >= 0 ? `+${token.change24h}%` : `${token.change24h}%`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {(["1H", "24H", "7D", "ALL"] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        timeframe === tf
                          ? "bg-[#8B5CF6]/25 text-[#D8B4FE] border border-[#8B5CF6]/40"
                          : "text-[#645E78] hover:text-white"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-32 w-full">
                <svg
                  viewBox="0 0 500 140"
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,135 ${chartPoints} 500,135`}
                    fill="url(#chartArea)"
                  />
                  <polyline
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartPoints}
                  />
                </svg>
              </div>
            </div>

            {/* INTERACTIVE LAUNCHPAD BONUS COMPARISON CHART */}
            <div className="rounded-xl border border-white/[0.08] bg-[#141122] p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#C084FC]" />
                  <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                    Launchpad Bonus Comparison Chart
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#948FA8]">
                  Simulating{" "}
                  <strong className="text-white">{numericEth || 0.2} ETH</strong>{" "}
                  (${tradeUsd.toLocaleString()}) Swap
                </span>
              </div>

              <div className="space-y-3">
                {comparisonBars.map((bar) => {
                  // Width relative to max (+9% bonus)
                  const widthPct = Math.min(
                    100,
                    Math.max(25, ((bar.rate + 12) / 21) * 100)
                  );
                  return (
                    <div key={bar.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span
                          className={
                            bar.highlight
                              ? "text-white font-bold"
                              : "text-[#948FA8]"
                          }
                        >
                          {bar.label}{" "}
                          <span className={bar.textColor}>
                            ({bar.rateLabel})
                          </span>
                        </span>
                        <span
                          className={`font-bold ${
                            bar.highlight ? "text-[#D8B4FE]" : "text-white"
                          }`}
                        >
                          {bar.netTokens.toLocaleString()} ${token.ticker}
                        </span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-[#09080E] overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full border ${bar.color} transition-all duration-300`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Rate Simulator inside Chart */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <span className="text-[11px] text-[#7E7896]">
                  Test custom bonus rate (2% – 9% max):
                </span>
                <input
                  type="range"
                  min={2}
                  max={9}
                  step={0.5}
                  value={effectiveBonusRate}
                  onChange={(e) =>
                    setCompareCustomRate(parseFloat(e.target.value))
                  }
                  aria-label="Simulate custom bonus rate"
                  className="rebate-slider w-36"
                />
                <button
                  onClick={() => setCompareCustomRate(null)}
                  className="text-[10px] font-mono text-[#A855F7] hover:underline"
                >
                  Reset ({token.bonusRate}%)
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Swap Widget & Bonus Breakdown Receipt */}
          <div className="lg:col-span-5 p-5 sm:p-7 bg-[#13101E] flex flex-col justify-between">
            <div>
              {/* Buy / Sell Toggle */}
              <div className="grid grid-cols-2 rounded-xl bg-[#0B0912] p-1 border border-white/[0.07] mb-5">
                <button
                  onClick={() => setSide("Buy")}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    side === "Buy"
                      ? "bg-[#8B5CF6] text-white shadow"
                      : "text-[#7E7896] hover:text-white"
                  }`}
                >
                  Buy ${token.ticker} (+{token.bonusRate}% Bonus)
                </button>
                <button
                  onClick={() => setSide("Sell")}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    side === "Sell"
                      ? "bg-[#EF4444] text-white shadow"
                      : "text-[#7E7896] hover:text-white"
                  }`}
                >
                  Sell ${token.ticker}
                </button>
              </div>

              {/* Input Box: Pay ETH */}
              <div className="rounded-xl border border-white/[0.09] bg-[#0B0912] p-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#7E7896] mb-2">
                  <span>{side === "Buy" ? "YOU PAY (ETH)" : "SELL VALUE (ETH EQUIV.)"}</span>
                  <span>
                    Balance:{" "}
                    <strong className="text-white">
                      {ethBalance.toFixed(4)} ETH
                    </strong>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <input
                    type="number"
                    step="0.05"
                    min="0.01"
                    value={ethInput}
                    onChange={(e) => setEthInput(e.target.value)}
                    aria-label="Swap input amount in ETH"
                    className="w-full bg-transparent font-mono text-2xl font-bold text-white outline-none"
                  />
                  <div className="shrink-0 flex items-center gap-1.5 rounded-lg bg-[#1B162B] border border-white/[0.08] px-3 py-1.5 font-mono text-xs font-bold text-white">
                    <span>ETH</span>
                  </div>
                </div>

                {/* Preset ETH Quick Buttons */}
                <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between gap-1.5">
                  <span className="text-[11px] font-mono text-[#645E78]">
                    ≈ ${tradeUsd.toLocaleString()} USD
                  </span>
                  <div className="flex items-center gap-1">
                    {["0.05", "0.1", "0.5", "1.0"].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setEthInput(preset)}
                        className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-[#8B5CF6]/25 text-[10px] font-mono text-[#D8B4FE] transition-colors cursor-pointer"
                      >
                        {preset} ETH
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Arrow Divider */}
              <div className="my-2.5 flex justify-center">
                <div className="w-8 h-8 rounded-lg border border-white/[0.08] bg-[#1A1528] flex items-center justify-center text-[#C084FC]">
                  <ArrowDownUp className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Output Box: Receive Token */}
              <div className="rounded-xl border border-[#8B5CF6]/35 bg-[#0B0912] p-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#7E7896] mb-1.5">
                  <span>YOU RECEIVE (ESTIMATED)</span>
                  <span>
                    Held:{" "}
                    <strong className="text-white">
                      {userTokenBalance.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{" "}
                      ${token.ticker}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-2xl font-bold text-white truncate">
                    {totalReceived.toLocaleString()}
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 rounded-lg bg-[#1B162B] border border-[#8B5CF6]/30 px-2.5 py-1 font-mono text-xs font-bold text-[#D8B4FE]">
                    <img
                      src={token.logoUrl}
                      alt={token.ticker}
                      className="w-4 h-4 rounded-sm object-cover"
                    />
                    <span>${token.ticker}</span>
                  </div>
                </div>
              </div>

              {/* ITEMIZED BONUS BREAKDOWN RECEIPT */}
              <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#0E0B16] p-4 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#7E7896] pb-1 border-b border-white/[0.05]">
                  <span>BONUS BREAKDOWN</span>
                  <span className="text-[#C084FC]">LOCKED CONTRACT RULES</span>
                </div>

                <div className="flex items-center justify-between text-[#948FA8]">
                  <span>Base swap output</span>
                  <span className="text-white font-semibold">
                    {baseSwapOutput.toLocaleString()} ${token.ticker}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#948FA8]">
                  <span>
                    Extra tokens (Bonus{" "}
                    <strong className="text-[#C084FC]">
                      +{side === "Buy" ? token.bonusRate : 0}%
                    </strong>
                    )
                  </span>
                  <span className="text-[#C084FC] font-bold">
                    +{extraBonusTokens.toLocaleString()} ${token.ticker}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-dashed border-white/[0.1] flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold">Total Received</span>
                    <div className="text-[10px] text-[#645E78]">
                      Credited in the same transaction
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-white">
                      {totalReceived.toLocaleString()} ${token.ticker}
                    </div>
                    {side === "Buy" && (
                      <span className="inline-block rounded border border-[#A855F7]/60 bg-[#A855F7]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#D8B4FE]">
                        +{extraBonusTokens.toLocaleString()} EXTRA
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Action CTA */}
            <div className="mt-6">
              <button
                onClick={handleSwapSubmit}
                disabled={isSwapping || numericEth <= 0}
                className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                  side === "Buy"
                    ? "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[0_0_25px_rgba(139,92,246,0.4)]"
                    : "bg-[#EF4444] hover:bg-[#DC2626] text-white"
                } disabled:opacity-50`}
              >
                {isSwapping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Swap on Robinhood Chain...</span>
                  </>
                ) : !isConnected ? (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>
                      Connect & {side} ${token.ticker} (+{token.bonusRate}% Bonus)
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {side === "Buy"
                        ? `Buy $${token.ticker} & Get +${extraBonusTokens.toLocaleString()} Bonus`
                        : `Sell $${token.ticker} for ${numericEth} ETH`}
                    </span>
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-between text-[11px] text-[#645E78]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Rates fixed at launch</span>
                </span>
                <span className="flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>
                    {token.payoutRate}% {token.pairAsset} holder dividends
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
