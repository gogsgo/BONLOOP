"use client";

import React, { useState } from "react";
import { TOKEN_ARTWORKS } from "@/lib/seed-data";
import {
  Search,
  Gift,
  Coins,
  CheckCircle2,
  Loader2,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { useRebateStore } from "@/store/useRebateStore";
import { DEFAULT_DEMO_WALLET } from "@/lib/seed-data";

const ETH_PRICE_USD = 2500;

export function RewardsView() {
  const {
    bonusTokensCreditedUsd,
    bonusTokensCreditedCountM,
    totalBuysCount,
    holderPayoutsUsd,
    payoutRounds,
    payoutPayments,
    rebateBurnedM,
    indexedBlock,
    holdings,
    tokens,
    isConnected,
    walletAddress,
    connectWallet,
    claimRewards,
    openTokenSwap,
  } = useRebateStore();

  const [lookupInput, setLookupInput] = useState<string>("");
  const [lookedUpWallet, setLookedUpWallet] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  // Enrich holdings for dividend dashboard
  const enrichedHoldings = holdings.map((h) => {
    const token = tokens.find((t) => t.slug === h.tokenSlug);
    const livePrice = token?.priceUsd || h.avgBuyPrice || 0.0001;
    const bonusUsd = h.bonusReceived * livePrice;
    const unclaimedUsd = h.unclaimedEth * ETH_PRICE_USD + h.unclaimedUsdg;

    return {
      ...h,
      logoUrl: token?.logoUrl || TOKEN_ARTWORKS.ruby,
      payoutRate: token?.payoutRate || 2,
      bonusRate: token?.bonusRate || 5,
      bonusUsd,
      unclaimedUsd,
    };
  });

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

  const handleClaim = async (tokenSlug?: string) => {
    if (!isConnected) {
      connectWallet("Robinhood Wallet");
    }
    setIsClaiming(true);
    await new Promise((r) => setTimeout(r, 380));
    await claimRewards(tokenSlug);
    setIsClaiming(false);
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = lookupInput.trim() || DEFAULT_DEMO_WALLET;
    setLookedUpWallet(target);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
      {/* Header Row matching Reference Image 1 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-7">
        <div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            Rewards
          </h1>
          <p className="text-sm text-[#777] mt-1.5">
            What the pad has paid out so far, and what any wallet has received
            to date. Updates every 30 seconds.
          </p>
        </div>

        <div className="text-xs font-mono text-[#555]">
          Indexed to block {indexedBlock.toLocaleString()}
        </div>
      </div>

      {/* 3 Protocol Hero Metric Cards (Exact layout from Reference Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
        {/* Card 1: BONUS TOKENS CREDITED */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#555]">
            BONUS TOKENS CREDITED
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold text-white mt-3">
            $
            {bonusTokensCreditedUsd.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-[#777] mt-3 leading-relaxed">
            {bonusTokensCreditedCountM.toFixed(2)}M tokens across{" "}
            {totalBuysCount.toLocaleString()} buys at today&apos;s prices,
            $32,334.64 when paid
          </p>
        </div>

        {/* Card 2: HOLDER PAYOUTS */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#555]">
            HOLDER PAYOUTS
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold text-white mt-3">
            $
            {holderPayoutsUsd.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-[#777] mt-3 leading-relaxed">
            {payoutRounds} payout rounds, {payoutPayments.toLocaleString()}{" "}
            payments, in each token&apos;s pair asset
          </p>
        </div>

        {/* Card 3: $REBATE BURNED */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#555]">
            $REBATE BURNED
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold text-white mt-3">
            {rebateBurnedM.toFixed(2)}M
          </div>
          <p className="text-xs text-[#777] mt-3 leading-relaxed">
            0.469% of the 1B launch supply, $4,254.39 at today&apos;s price
          </p>
        </div>
      </div>

      {/* YOUR ACCUMULATED HOLDER DIVIDENDS & OPTIMISTIC CLAIM PANEL */}
      <div className="rounded-2xl border border-white/30/35 bg-[#131020] p-6 sm:p-7 mb-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/30/40 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#D8B4FE] mb-2.5">
              <Coins className="w-3.5 h-3.5" />
              <span>HOLDER DIVIDEND CLAIM DASHBOARD (ETH / USDG)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Accumulated Dividends:{" "}
              <span className="font-mono text-[#22C55E]">
                ${totalUnclaimedUsd.toFixed(2)}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#777] mt-1">
              {totalUnclaimedEth.toFixed(4)} ETH + $
              {totalUnclaimedUsdg.toFixed(2)} USDG earned across your held
              tokens ({walletAddress}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isConnected && (
              <button
                onClick={() => connectWallet("Robinhood Wallet")}
                className="h-11 px-5 rounded-xl border border-white/[0.12] bg-[#1C172E] hover:bg-[#251E3D] text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-white" />
                <span>Connect Wallet</span>
              </button>
            )}
            <button
              onClick={() => handleClaim()}
              disabled={isClaiming || totalUnclaimedUsd <= 0}
              className="h-11 px-6 rounded-xl bg-white hover:bg-white/80 disabled:opacity-40 text-xs sm:text-sm font-bold text-white flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transferring to Wallet...</span>
                </>
              ) : totalUnclaimedUsd > 0 ? (
                <>
                  <Gift className="w-4 h-4" />
                  <span>
                    Claim Rewards (${totalUnclaimedUsd.toFixed(2)})
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  <span>All Rewards Claimed</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Per-Token Dividend Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {enrichedHoldings.map((h) => (
            <div
              key={h.tokenSlug}
              className="rounded-xl border border-white/[0.07] bg-[#0B0912] p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={h.logoUrl}
                      alt={h.tokenName}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">
                        {h.tokenName}
                      </div>
                      <div className="text-[10px] font-mono text-[#555]">
                        ${h.tokenTicker} · {h.holdMultiplier}x Tier
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openTokenSwap(h.tokenSlug)}
                    className="text-[#555] hover:text-white"
                    title="Open token pool"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[10px] font-mono uppercase text-[#555]">
                  UNCLAIMED {h.pairAsset} DIVIDEND
                </div>
                <div className="font-mono text-base font-bold text-[#22C55E] mt-0.5">
                  {h.pairAsset === "ETH"
                    ? `${h.unclaimedEth.toFixed(4)} ETH`
                    : `${h.unclaimedUsdg.toFixed(2)} USDG`}
                </div>
                <div className="text-[11px] font-mono text-[#777]">
                  ≈ ${h.unclaimedUsd.toFixed(2)} USD
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#555]">
                  Paid: ${h.claimedTotalUsd.toFixed(0)}
                </span>
                {h.unclaimedUsd > 0 ? (
                  <button
                    onClick={() => handleClaim(h.tokenSlug)}
                    className="text-white hover:underline font-bold cursor-pointer"
                  >
                    Claim →
                  </button>
                ) : (
                  <span className="text-[#22C55E]">Transferred ✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHECK A WALLET CARD (Exact layout from Reference Image 1) */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Check a wallet
        </h2>
        <p className="text-xs sm:text-sm text-[#777] mt-1">
          Bonus tokens and holder payouts this wallet has received, per token,
          since the pad opened.
        </p>

        <form
          onSubmit={handleLookupSubmit}
          className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <input
            type="text"
            value={lookupInput}
            onChange={(e) => setLookupInput(e.target.value)}
            placeholder="0x..."
            className="flex-1 h-12 px-4 rounded-xl border border-white/[0.08] bg-[#080808] font-mono text-sm text-white placeholder-[#645E78] focus:outline-none focus:border-white/30"
          />
          <button
            type="submit"
            className="h-12 px-6 rounded-xl bg-white hover:bg-white/80 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Look up</span>
          </button>
        </form>

        {/* Quick sample wallets */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#555]">
          <span>Try wallet:</span>
          {[DEFAULT_DEMO_WALLET, "0x569d...289e", "0x385a...238f"].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => {
                setLookupInput(w);
                setLookedUpWallet(w);
              }}
              className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/20 text-[#777] hover:text-[#D8B4FE] transition-colors cursor-pointer"
            >
              {w}
            </button>
          ))}
        </div>

        {/* Lookup Result Table */}
        {lookedUpWallet && (
          <div className="mt-6 pt-5 border-t border-white/[0.07] animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono text-white">
                Indexing history for{" "}
                <strong className="text-white">{lookedUpWallet}</strong>
              </div>
              <span className="text-[11px] font-mono text-[#22C55E]">
                4 Pools Found on Robinhood Chain
              </span>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#080808] overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[10px] uppercase text-[#555]">
                    <th className="py-3 px-4">TOKEN</th>
                    <th className="py-3 px-4">BONUS TOKENS RECEIVED</th>
                    <th className="py-3 px-4">BONUS VALUE TODAY</th>
                    <th className="py-3 px-4">HOLDER PAYOUTS RECEIVED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {enrichedHoldings.map((h) => (
                    <tr key={h.tokenSlug}>
                      <td className="py-3 px-4 font-sans font-bold text-white">
                        {h.tokenName}{" "}
                        <span className="font-mono text-[#555]">
                          ${h.tokenTicker}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white font-bold">
                        +{h.bonusReceived.toLocaleString()} ${h.tokenTicker}
                      </td>
                      <td className="py-3 px-4 text-white">
                        ${h.bonusUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-[#22C55E] font-bold">
                        ${(h.claimedTotalUsd + h.unclaimedUsd).toFixed(2)} (
                        {h.pairAsset})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footnote matching Reference Image 1 */}
      <div className="mt-5 flex items-center gap-2.5 text-xs text-[#555]">
        <Gift className="w-4 h-4 text-[#555] shrink-0" />
        <span>
          Bonus tokens are valued at today&apos;s prices, holder payouts at the
          pair-asset price when the round was published. Payouts to a
          token&apos;s creator are not included.
        </span>
      </div>
    </div>
  );
}
