"use client";

import React from "react";
import { TOKEN_ARTWORKS } from "@/lib/seed-data";
import {
  Compass,
  Calculator,
  Gift,
  Coins,
  Check,
  X,
  Lock,
  Shield,
} from "lucide-react";
import { BuyPreviewWidget } from "@/components/BuyPreviewWidget";
import { useRebateStore } from "@/store/useRebateStore";

export function GuideView() {
  const { setActiveTab } = useRebateStore();

  return (
    <div className="max-w-[1060px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-12 space-y-16">
      {/* HERO SECTION matching Reference Image 5 */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <h1
            className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.03em] leading-[1.05] text-white"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            Buy it. Get more.
            <br />
            <span className="text-stroke-violet">Hold it. Get paid.</span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-[#948FA8] leading-relaxed">
            On Rebate Pad, buying a token gives you bonus tokens on top of the
            base swap, at a rate each launch sets. Holding it pays you a share
            of every trade in the token&apos;s pair asset, several times a day,
            straight to your wallet. Nothing to stake, nothing to claim.
          </p>
        </div>

        <div className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 drop-shadow-[0_14px_34px_rgba(168,85,247,0.45)]">
          <img
            src={TOKEN_ARTWORKS.ruby}
            alt="Ruby mascot"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>
      </section>

      {/* 4-STEP INFOGRAPHIC UI (Required by PRD & Reference Image 5) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-6">
          <div className="w-10 h-10 rounded-xl bg-[#1F1835] border border-[#8B5CF6]/30 flex items-center justify-center text-[#C084FC] mb-5">
            <Compass className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono text-[#645E78] mb-1">STEP 01</div>
          <h3 className="text-base font-bold text-white">Choose a token</h3>
          <p className="text-xs text-[#948FA8] mt-2 leading-relaxed">
            Browse launches, compare bonus and payout rates, open the one you
            like.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-6">
          <div className="w-10 h-10 rounded-xl bg-[#1F1835] border border-[#8B5CF6]/30 flex items-center justify-center text-[#C084FC] mb-5">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono text-[#645E78] mb-1">STEP 02</div>
          <h3 className="text-base font-bold text-white">Preview your bonus</h3>
          <p className="text-xs text-[#948FA8] mt-2 leading-relaxed">
            See base tokens, bonus tokens and the total before you buy.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-6">
          <div className="w-10 h-10 rounded-xl bg-[#1F1835] border border-[#8B5CF6]/30 flex items-center justify-center text-[#C084FC] mb-5">
            <Gift className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono text-[#645E78] mb-1">STEP 03</div>
          <h3 className="text-base font-bold text-white">
            Buy and receive more
          </h3>
          <p className="text-xs text-[#948FA8] mt-2 leading-relaxed">
            The bonus tokens arrive together with your base swap output.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-6">
          <div className="w-10 h-10 rounded-xl bg-[#1F1835] border border-[#8B5CF6]/30 flex items-center justify-center text-[#C084FC] mb-5">
            <Coins className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono text-[#645E78] mb-1">STEP 04</div>
          <h3 className="text-base font-bold text-white">Hold and get paid</h3>
          <p className="text-xs text-[#948FA8] mt-2 leading-relaxed">
            Holder payouts land in your wallet in the pair asset, several times
            a day. The longer you hold, the bigger your share.
          </p>
        </div>
      </section>

      {/* TRY THE NUMBERS INTERACTIVE CALCULATOR */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Try the numbers
          </h2>
          <p className="text-xs sm:text-sm text-[#948FA8] mt-1">
            Change the base output and the rate. The preview recalculates
            immediately.
          </p>
        </div>
        <BuyPreviewWidget initialBaseTokens={10000} initialBonusRate={5} />
      </section>

      {/* HOLDER PAYOUTS SECTION matching Reference Image 5 */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Holder payouts
            </h2>
            <p className="text-xs sm:text-sm text-[#948FA8] mt-1">
              Hold a token that pays holders and a share of every trade is
              yours. Two things decide the size of that share.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card: Your Share */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-4">
                Your share
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#948FA8]">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>
                    How much you hold. Shares are proportional, so splitting
                    across wallets changes nothing.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>
                    How long you have held. Your time counts per token: buying
                    more never resets it, selling only resets the tokens you
                    sold.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>
                    Wallets holding under $1 of a token are left out, and
                    launchers can exclude up to ten named wallets, fixed at
                    launch.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>
                    Payouts land in the pair asset, ETH or USDG, several times a
                    day. No staking, no claiming, no points.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <div className="grid grid-cols-3 rounded-xl border border-white/[0.08] bg-[#0B0912] divide-x divide-white/[0.06] font-mono">
                <div className="p-3.5">
                  <div className="text-lg font-bold text-white">1×</div>
                  <div className="text-[11px] text-[#7E7896] mt-0.5">
                    0–3 days
                  </div>
                </div>
                <div className="p-3.5">
                  <div className="text-lg font-bold text-white">1.5×</div>
                  <div className="text-[11px] text-[#7E7896] mt-0.5">
                    3–7 days
                  </div>
                </div>
                <div className="p-3.5">
                  <div className="text-lg font-bold text-[#C084FC]">2×</div>
                  <div className="text-[11px] text-[#D8B4FE] mt-0.5">
                    7+ days
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#645E78] mt-2.5">
                The tiers change how a payout is split, never its size. A payout
                is exactly what the token&apos;s trading produced.
              </p>
            </div>
          </div>

          {/* Right Card: What Launchers Choose */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-4">
                What launchers choose
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#948FA8]">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>
                    The pair asset: ETH or USDG. Buyers pay in it and payouts
                    are paid in it.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>
                    The bonus rate, 2% to 9%, and the payout rate. Together they
                    never exceed 9%, and with the platform and swap fees the
                    total never exceeds 10%.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>
                    Where payouts go: to holders, which is permanent, or to the
                    creator, who can switch to holders later but never back.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>
                    One rule no launch can break: buyers must start at least 1%
                    ahead at the price before their trade.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-white/[0.06] bg-[#0B0912] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#A855F7]" />
                <div>
                  <div className="text-xs font-bold text-white">
                    7%+ Locked Bonus Treasury
                  </div>
                  <div className="text-[11px] text-[#7E7896]">
                    Sell fees refill it, bonus tokens to buyers are the only way
                    out.
                  </div>
                </div>
              </div>
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-[#A855F7]/40 text-[#C084FC]">
                IMMUTABLE
              </span>
            </div>
          </div>
        </div>

        {/* ONE PAYOUT ROUND VISUAL DIAGRAM (Matching Reference Image 2) */}
        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#12101B] p-6">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-[#7E7896] mb-5">
            <span>ONE PAYOUT ROUND ILLUSTRATION</span>
            <span>SHARE = TOKENS HELD × HOLD TIER</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl border border-[#8B5CF6]/40 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.22),transparent_70%)]">
              <div className="w-28 h-28 rounded-full border-2 border-[#A855F7]/60 bg-[#1B1433] flex flex-col items-center justify-center text-center shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                <span className="text-sm font-bold text-white">Trading pot</span>
                <span className="text-[10px] font-mono text-[#C084FC] mt-0.5">
                  Pair token (ETH/USDG)
                </span>
              </div>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {[
                {
                  wallet: "Wallet A",
                  tier: "2×",
                  held: "40M · 9d",
                  share: "35%",
                  barW: "70%",
                },
                {
                  wallet: "Wallet B",
                  tier: "1×",
                  held: "60M · 1d",
                  share: "26%",
                  barW: "52%",
                },
                {
                  wallet: "Wallet C",
                  tier: "1.5×",
                  held: "20M · 5d",
                  share: "13%",
                  barW: "30%",
                },
                {
                  wallet: "Wallet D",
                  tier: "2×",
                  held: "30M · 8d",
                  share: "26%",
                  barW: "52%",
                },
              ].map((w) => (
                <div
                  key={w.wallet}
                  className="rounded-xl border border-white/[0.07] bg-[#0B0912] p-3.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans font-bold text-white">
                      {w.wallet}
                    </span>
                    <span className="rounded bg-[#8B5CF6]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#D8B4FE]">
                      {w.tier}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#191528] overflow-hidden mb-2">
                    <div
                      className="h-full bg-[#A855F7] rounded-full"
                      style={{ width: w.barW }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#7E7896]">
                    <span>{w.held}</span>
                    <span className="text-white font-bold">{w.share} of pot</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-[#645E78] mt-4">
            Illustrative. Wallet B holds the most tokens (60M) but has held them
            one day, so Wallet A, holding 40M for nine days (2× tier), takes the
            bigger share.
          </p>
        </div>
      </section>

      {/* WHAT IT IS / WHAT IT IS NOT (Matching Reference Image 5) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-base font-bold text-white mb-4">What it is</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-[#948FA8]">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
              <span>
                Bonus tokens added on top of the base swap output of a buy, at a
                rate each launch sets.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
              <span>
                Holder payouts: a share of every trade, paid to holders in the
                pair asset, split by how much each wallet holds and for how
                long.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
              <span>
                Rates that are fixed at launch, identical for every wallet, and
                shown in every quote before you confirm.
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-white mb-4">
            What it is not
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-[#948FA8]">
            <li className="flex items-start gap-2.5">
              <X className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
              <span>
                A guarantee of profit, or protection against price changes.
                Payouts rise and fall with trading.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <X className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
              <span>Applied to sells. Selling receives no bonus.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* NOTES BOX & FOOTER ACTIONS matching Reference Image 5 */}
      <section className="space-y-6">
        <div className="rounded-2xl border border-white/[0.08] bg-[#12101B] p-6">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#A855F7]" />
            <span>Notes</span>
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-xs text-[#948FA8] leading-relaxed">
            <li>
              Tokens, prices, balances, payouts and activity are read from
              Robinhood Chain through the Rebate Pad indexer.
            </li>
            <li>
              Trades and launches are signed in your own wallet. Rebate Pad
              never holds your keys or funds.
            </li>
            <li>
              Rebate Pad runs on Robinhood Chain as an independent project. No
              partnership or endorsement is implied.
            </li>
            <li>
              ETH amounts next to USD figures use the indexer&apos;s current ETH
              price.
            </li>
          </ol>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab("discover")}
            className="h-11 px-6 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs sm:text-sm font-semibold text-white shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
          >
            Explore tokens
          </button>
          <button
            onClick={() => setActiveTab("launch")}
            className="h-11 px-6 rounded-xl border border-white/[0.1] bg-[#141120] hover:bg-[#1C182B] text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer"
          >
            Launch a token
          </button>
        </div>
      </section>
    </div>
  );
}
