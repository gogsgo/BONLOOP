"use client";

import React, { useState } from "react";
import {
  Wallet,
  Gift,
  TrendingUp,
  Coins,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useRebateStore } from "@/store/useRebateStore";

const ETH_PRICE_USD = 2500;

export function PortfolioView() {
  const {
    isConnected,
    connectWallet,
    walletAddress,
    ethBalance,
    usdgBalance,
    holdings,
    tokens,
    openTokenSwap,
    claimRewards,
  } = useRebateStore();

  const [subTab, setSubTab] = useState<"portfolio" | "rewards">("portfolio");
  const [chartRange, setChartRange] = useState<"24H" | "7D" | "30D" | "ALL">(
    "7D"
  );
  const [isClaiming, setIsClaiming] = useState(false);

  // Enrich holdings with live token prices
  const enrichedHoldings = holdings.map((h) => {
    const token = tokens.find((t) => t.slug === h.tokenSlug);
    const livePrice = token?.priceUsd || h.avgBuyPrice || 0.0001;
    const valueUsd = h.balance * livePrice;
    const valueEth = valueUsd / ETH_PRICE_USD;
    const bonusValueUsd = h.bonusReceived * livePrice;
    const unclaimedUsd = h.unclaimedEth * ETH_PRICE_USD + h.unclaimedUsdg;
    const pnlPct =
      h.avgBuyPrice > 0
        ? ((livePrice - h.avgBuyPrice) / h.avgBuyPrice) * 100
        : 0;

    return {
      ...h,
      logoUrl: token?.logoUrl || "/images/ruby-mascot.png",
      livePrice,
      valueUsd,
      valueEth,
      bonusValueUsd,
      unclaimedUsd,
      pnlPct,
      bonusRate: token?.bonusRate || 5,
      payoutRate: token?.payoutRate || 2,
    };
  });

  const totalTokenHoldingsUsd = enrichedHoldings.reduce(
    (acc, h) => acc + h.valueUsd,
    0
  );
  const totalPortfolioUsd =
    totalTokenHoldingsUsd + ethBalance * ETH_PRICE_USD + usdgBalance;
  const totalPortfolioEth = totalPortfolioUsd / ETH_PRICE_USD;

  const totalBonusEarnedUsd = enrichedHoldings.reduce(
    (acc, h) => acc + h.bonusValueUsd,
    0
  );
  const totalUnclaimedEth = enrichedHoldings.reduce(
    (acc, h) => acc + h.unclaimedEth,
    0
  );
  const totalUnclaimedUsdg = enrichedHoldings.reduce(
    (acc, h) => acc + h.unclaimedUsdg,
    0
  );
  const totalUnclaimedUsd =
    totalUnclaimedEth * ETH_PRICE_USD + totalUnclaimedUsdg;
  const totalClaimedLifetimeUsd = enrichedHoldings.reduce(
    (acc, h) => acc + h.claimedTotalUsd,
    0
  );

  const handleClaimAll = async (tokenSlug?: string) => {
    setIsClaiming(true);
    await new Promise((r) => setTimeout(r, 400));
    await claimRewards(tokenSlug);
    setIsClaiming(false);
  };

  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            Portfolio
          </h1>
          <p className="text-sm text-[#948FA8] mt-1.5">
            What you bought, the bonus tokens on top, and the holder payouts
            that landed.
          </p>
        </div>

        {isConnected && (
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#12101B] p-1">
            <button
              onClick={() => setSubTab("portfolio")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subTab === "portfolio"
                  ? "bg-[#241B3D] text-[#D8B4FE] border border-[#8B5CF6]/40"
                  : "text-[#7E7896] hover:text-white"
              }`}
            >
              Portfolio Holdings
            </button>
            <button
              onClick={() => setSubTab("rewards")}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                subTab === "rewards"
                  ? "bg-[#241B3D] text-[#D8B4FE] border border-[#8B5CF6]/40"
                  : "text-[#7E7896] hover:text-white"
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>Rewards & Dividends</span>
              {totalUnclaimedUsd > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#22C55E]/20 text-[#22C55E] font-mono text-[10px]">
                  ${totalUnclaimedUsd.toFixed(0)}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Disconnected Empty State (Matching Reference Image 7) */}
      {!isConnected ? (
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#0D0B14]/80 py-20 px-6 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 mb-5 drop-shadow-[0_12px_30px_rgba(168,85,247,0.4)]">
            <img
              src="/images/ruby-mascot.png"
              alt="Ruby waving"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Connect a wallet to see your holdings
          </h2>
          <p className="mt-2 max-w-md text-xs sm:text-sm text-[#7E7896] leading-relaxed">
            Connect a browser wallet on Robinhood Chain. Balances and payouts
            are read from the chain.
          </p>
          <button
            onClick={() => connectWallet("Robinhood Wallet")}
            className="mt-6 h-11 px-6 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs sm:text-sm font-semibold text-white shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all cursor-pointer"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top 4 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-5">
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#7E7896]">
                TOTAL NET WORTH
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white mt-2">
                ${totalPortfolioUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs font-mono text-[#948FA8] mt-1">
                ≈ {totalPortfolioEth.toFixed(3)} ETH on Robinhood Chain
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-5">
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#7E7896]">
                TOKEN HOLDINGS VALUE
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#D8B4FE] mt-2">
                ${totalTokenHoldingsUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-[#948FA8] mt-1">
                Includes{" "}
                <strong className="text-[#C084FC] font-mono">
                  +${totalBonusEarnedUsd.toFixed(2)}
                </strong>{" "}
                in purchase bonuses
              </div>
            </div>

            <div className="rounded-2xl border border-[#8B5CF6]/35 bg-[#161226] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#C084FC]">
                  UNCLAIMED DIVIDENDS
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white mt-2">
                ${totalUnclaimedUsd.toFixed(2)}
              </div>
              <div className="text-xs font-mono text-[#22C55E] mt-1">
                {totalUnclaimedEth.toFixed(4)} ETH + ${totalUnclaimedUsdg.toFixed(2)} USDG
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#7E7896]">
                  LIFETIME PAYOUTS CLAIMED
                </div>
                <div className="font-mono text-2xl font-bold text-white mt-2">
                  ${totalClaimedLifetimeUsd.toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => handleClaimAll()}
                disabled={isClaiming || totalUnclaimedUsd <= 0}
                className="mt-3 w-full h-9 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Claiming to {walletAddress}...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-3.5 h-3.5" />
                    <span>
                      Claim Rewards (${totalUnclaimedUsd.toFixed(2)})
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {subTab === "portfolio" ? (
            <>
              {/* Interactive Portfolio Performance Chart & Allocation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 rounded-2xl border border-white/[0.08] bg-[#12101B] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                        <span className="text-sm font-bold text-white">
                          Portfolio Value & Bonus Growth
                        </span>
                      </div>
                      <p className="text-xs text-[#7E7896] mt-0.5">
                        Includes base token appreciation + instant entry bonuses
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {(["24H", "7D", "30D", "ALL"] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setChartRange(r)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer ${
                            chartRange === r
                              ? "bg-[#241B3D] text-[#D8B4FE] border border-[#8B5CF6]/40"
                              : "text-[#645E78] hover:text-white"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive SVG Area Chart */}
                  <div className="h-48 w-full pt-2">
                    <svg
                      viewBox="0 0 600 170"
                      className="w-full h-full overflow-visible"
                    >
                      <defs>
                        <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="0%"
                            stopColor="#A855F7"
                            stopOpacity="0.4"
                          />
                          <stop
                            offset="100%"
                            stopColor="#A855F7"
                            stopOpacity="0.0"
                          />
                        </linearGradient>
                      </defs>
                      <polygon
                        points="0,160 0,125 85,112 170,118 255,88 340,72 425,78 510,42 600,24 600,160"
                        fill="url(#portGrad)"
                      />
                      <polyline
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="0,125 85,112 170,118 255,88 340,72 425,78 510,42 600,24"
                      />
                    </svg>
                  </div>
                </div>

                {/* Right: Wallet Liquid Reserves & Hold Multiplier Status */}
                <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-[#12101B] p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-[#A855F7]" />
                      <span>Liquid Pair Assets ({walletAddress})</span>
                    </h3>

                    <div className="space-y-3">
                      <div className="rounded-xl border border-white/[0.06] bg-[#09080E] p-3.5 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">
                            Robinhood ETH
                          </div>
                          <div className="text-[11px] font-mono text-[#7E7896]">
                            Native Gas & Pool Pair
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-sm font-bold text-white">
                            {ethBalance.toFixed(4)} ETH
                          </div>
                          <div className="text-[11px] text-[#948FA8]">
                            ${(ethBalance * ETH_PRICE_USD).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-[#09080E] p-3.5 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">
                            USDG Stablecoin
                          </div>
                          <div className="text-[11px] font-mono text-[#7E7896]">
                            Dollar Dividend Pair
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-sm font-bold text-white">
                            {usdgBalance.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}{" "}
                            USDG
                          </div>
                          <div className="text-[11px] text-[#22C55E]">
                            $1.00 Peg
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#7E7896] mb-2">
                      ACTIVE HOLD MULTIPLIER TIERS
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                      <div className="rounded-lg bg-[#09080E] p-2 border border-white/[0.05]">
                        <div className="font-bold text-white">1x</div>
                        <div className="text-[9px] text-[#645E78]">0–3 days</div>
                      </div>
                      <div className="rounded-lg bg-[#09080E] p-2 border border-white/[0.05]">
                        <div className="font-bold text-[#C084FC]">1.5x</div>
                        <div className="text-[9px] text-[#645E78]">3–7 days</div>
                      </div>
                      <div className="rounded-lg bg-[#1F1736] p-2 border border-[#8B5CF6]/40">
                        <div className="font-bold text-[#22C55E]">2x</div>
                        <div className="text-[9px] text-[#D8B4FE]">7+ days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Held Tokens Table */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    Held Launchpad Tokens ({enrichedHoldings.length})
                  </h3>
                  <span className="text-xs font-mono text-[#7E7896]">
                    Indexed on Robinhood Chain
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-[#645E78]">
                        <th className="py-3.5 px-5">ASSET</th>
                        <th className="py-3.5 px-4">BALANCE</th>
                        <th className="py-3.5 px-4">BONUS RECEIVED</th>
                        <th className="py-3.5 px-4">HOLD TIER</th>
                        <th className="py-3.5 px-4">VALUE (USD / ETH)</th>
                        <th className="py-3.5 px-4">UNCLAIMED PAYOUT</th>
                        <th className="py-3.5 px-5 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05] text-xs font-mono">
                      {enrichedHoldings.map((h) => (
                        <tr
                          key={h.tokenSlug}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <img
                                src={h.logoUrl}
                                alt={h.tokenName}
                                className="w-10 h-10 rounded-xl object-cover bg-[#09080E]"
                              />
                              <div>
                                <div className="font-sans font-bold text-sm text-white">
                                  {h.tokenName}
                                </div>
                                <div className="text-[11px] text-[#7E7896]">
                                  ${h.tokenTicker} · Pair: {h.pairAsset}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-bold text-white">
                            {h.balance.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}{" "}
                            ${h.tokenTicker}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-[#C084FC] font-bold">
                              +
                              {h.bonusReceived.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                            <div className="text-[10px] text-[#645E78]">
                              (+{h.bonusRate}% on buy)
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-2 py-0.5 text-[11px] font-bold text-[#D8B4FE]">
                              <Clock className="w-3 h-3" />
                              {h.holdMultiplier}x ({h.daysHeld}d)
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-white">
                              ${h.valueUsd.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-[#7E7896]">
                              {h.valueEth.toFixed(4)} ETH (
                              <span
                                className={
                                  h.pnlPct >= 0
                                    ? "text-[#22C55E]"
                                    : "text-[#EF4444]"
                                }
                              >
                                {h.pnlPct >= 0 ? "+" : ""}
                                {h.pnlPct.toFixed(1)}%
                              </span>
                              )
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {h.unclaimedUsd > 0 ? (
                              <div>
                                <div className="font-bold text-[#22C55E]">
                                  {h.pairAsset === "ETH"
                                    ? `${h.unclaimedEth.toFixed(4)} ETH`
                                    : `${h.unclaimedUsdg.toFixed(2)} USDG`}
                                </div>
                                <div className="text-[10px] text-[#7E7896]">
                                  ≈ ${h.unclaimedUsd.toFixed(2)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[#645E78]">Claimed ✓</span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-right space-x-2">
                            {h.unclaimedUsd > 0 && (
                              <button
                                onClick={() => handleClaimAll(h.tokenSlug)}
                                className="px-3 py-1.5 rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#22C55E] font-sans font-semibold text-xs cursor-pointer"
                              >
                                Claim
                              </button>
                            )}
                            <button
                              onClick={() => openTokenSwap(h.tokenSlug)}
                              className="px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-sans font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Trade</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* REWARDS TAB INSIDE PORTFOLIO: Detailed Dividend Breakdown & Claim Center */
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#8B5CF6]/40 bg-gradient-to-r from-[#1A1330] to-[#12101B] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#D8B4FE] mb-3">
                    <Coins className="w-3.5 h-3.5" />
                    <span>AUTOMATED HOLDER DIVIDENDS (ETH & USDG)</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Ready to Claim: ${totalUnclaimedUsd.toFixed(2)}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#948FA8] mt-1 max-w-xl">
                    Accumulated from{" "}
                    <strong className="text-white">
                      {totalUnclaimedEth.toFixed(4)} ETH
                    </strong>{" "}
                    and{" "}
                    <strong className="text-white">
                      ${totalUnclaimedUsdg.toFixed(2)} USDG
                    </strong>{" "}
                    across your held token pools. Claiming transfers the pair
                    assets directly to your connected wallet ({walletAddress}).
                  </p>
                </div>

                <button
                  onClick={() => handleClaimAll()}
                  disabled={isClaiming || totalUnclaimedUsd <= 0}
                  className="shrink-0 h-12 px-7 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(139,92,246,0.45)] transition-all cursor-pointer"
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transferring to Wallet...</span>
                    </>
                  ) : totalUnclaimedUsd > 0 ? (
                    <>
                      <Gift className="w-4 h-4" />
                      <span>Claim Rewards (${totalUnclaimedUsd.toFixed(2)})</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      <span>All Dividends Claimed</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {enrichedHoldings.map((h) => (
                  <div
                    key={h.tokenSlug}
                    className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-5 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={h.logoUrl}
                          alt={h.tokenName}
                          className="w-12 h-12 rounded-xl object-cover bg-[#09080E]"
                        />
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {h.tokenName}{" "}
                            <span className="font-mono text-xs text-[#948FA8]">
                              ${h.tokenTicker}
                            </span>
                          </h3>
                          <div className="text-xs font-mono text-[#C084FC]">
                            {h.payoutRate}% Pool Payouts in {h.pairAsset} ·{" "}
                            {h.holdMultiplier}x Hold Weight
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-lg font-bold text-[#22C55E]">
                          ${h.unclaimedUsd.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-[#7E7896]">
                          UNCLAIMED
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                      <div className="text-[#948FA8]">
                        Claimed to date:{" "}
                        <strong className="text-white">
                          ${h.claimedTotalUsd.toFixed(2)}
                        </strong>
                      </div>
                      <button
                        onClick={() => handleClaimAll(h.tokenSlug)}
                        disabled={h.unclaimedUsd <= 0 || isClaiming}
                        className="px-3.5 py-1.5 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6] text-[#D8B4FE] hover:text-white disabled:opacity-40 font-sans font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {h.unclaimedUsd > 0
                          ? `Claim ${
                              h.pairAsset === "ETH"
                                ? `${h.unclaimedEth.toFixed(4)} ETH`
                                : `${h.unclaimedUsdg.toFixed(2)} USDG`
                            }`
                          : "Claimed ✓"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
