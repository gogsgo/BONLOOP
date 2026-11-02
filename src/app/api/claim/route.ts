import { NextResponse } from "next/server";
import { db } from "@/db";
import { activities, holdings } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/db-init";
import { DEFAULT_DEMO_WALLET } from "@/lib/seed-data";
import { eq, and } from "drizzle-orm";

const ETH_PRICE_USD = 2500;

export async function POST(request: Request) {
  try {
    await ensureDbSeeded();
    const body = await request.json();
    const { walletAddress = DEFAULT_DEMO_WALLET, tokenSlug } = body;

    const targetHoldings = tokenSlug
      ? await db
          .select()
          .from(holdings)
          .where(
            and(
              eq(holdings.walletAddress, walletAddress),
              eq(holdings.tokenSlug, tokenSlug)
            )
          )
      : await db
          .select()
          .from(holdings)
          .where(eq(holdings.walletAddress, walletAddress));

    let totalClaimedEth = 0;
    let totalClaimedUsdg = 0;
    const updatedHoldingsList = [];

    for (const h of targetHoldings) {
      if (h.unclaimedEth > 0 || h.unclaimedUsdg > 0) {
        totalClaimedEth += h.unclaimedEth;
        totalClaimedUsdg += h.unclaimedUsdg;
        const usdVal = h.unclaimedEth * ETH_PRICE_USD + h.unclaimedUsdg;

        const [updated] = await db
          .update(holdings)
          .set({
            unclaimedEth: 0,
            unclaimedUsdg: 0,
            claimedTotalUsd: Number((h.claimedTotalUsd + usdVal).toFixed(2)),
            updatedAt: new Date(),
          })
          .where(eq(holdings.id, h.id))
          .returning();

        updatedHoldingsList.push(updated);
      }
    }

    const totalClaimedUsd = Number(
      (totalClaimedEth * ETH_PRICE_USD + totalClaimedUsdg).toFixed(2)
    );

    let createdActivity = null;
    if (totalClaimedUsd > 0) {
      const randomHex = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      const txHash = `0x${randomHex.slice(0, 4)}...${randomHex.slice(-4)}`;
      const now = new Date();
      const timeLabel = `${now.toLocaleString("en-US", { month: "short" })} ${now.getDate()}, ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const [act] = await db
        .insert(activities)
        .values({
          type: "Payout",
          account: walletAddress,
          tokenName: tokenSlug ? targetHoldings[0]?.tokenName || "Rebate" : "All Held Pools",
          tokenTicker: tokenSlug ? targetHoldings[0]?.tokenTicker || "REBATE" : "ETH/USDG",
          tokenSlug: tokenSlug || "rebate",
          amountUsd: totalClaimedUsd,
          tokenAmount: totalClaimedEth > 0 ? totalClaimedEth : totalClaimedUsdg,
          bonusTokens: 0,
          pairAsset: totalClaimedEth > 0 ? "ETH" : "USDG",
          txHash,
          timeLabel,
        })
        .returning();
      createdActivity = act;
    }

    const allHoldings = await db
      .select()
      .from(holdings)
      .where(eq(holdings.walletAddress, walletAddress));

    return NextResponse.json({
      claimedEth: Number(totalClaimedEth.toFixed(5)),
      claimedUsdg: Number(totalClaimedUsdg.toFixed(2)),
      claimedUsd: totalClaimedUsd,
      holdings: allHoldings,
      activity: createdActivity,
    });
  } catch (error) {
    console.error("Claim rewards error:", error);
    return NextResponse.json({ error: "Failed to claim rewards" }, { status: 500 });
  }
}
