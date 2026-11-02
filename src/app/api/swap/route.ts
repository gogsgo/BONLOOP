import { NextResponse } from "next/server";
import { db } from "@/db";
import { tokens, activities, holdings } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/db-init";
import { DEFAULT_DEMO_WALLET } from "@/lib/seed-data";
import { eq, and } from "drizzle-orm";

const ETH_PRICE_USD = 2500;

export async function POST(request: Request) {
  try {
    await ensureDbSeeded();
    const body = await request.json();

    const {
      tokenSlug,
      side = "Buy", // 'Buy' | 'Sell'
      amountInEth, // If Buy, amount in ETH (or USDG equivalent converted). Let's support amountUsd directly as well
      amountUsd: rawAmountUsd,
      tokenAmountSell,
      walletAddress = DEFAULT_DEMO_WALLET,
    } = body;

    const [token] = await db
      .select()
      .from(tokens)
      .where(eq(tokens.slug, tokenSlug));

    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    const isBuy = side === "Buy";
    const tradeUsd = rawAmountUsd
      ? Number(rawAmountUsd)
      : Number(amountInEth || 0.1) * ETH_PRICE_USD;

    const baseTokens = isBuy
      ? tradeUsd / token.priceUsd
      : Number(tokenAmountSell || tradeUsd / token.priceUsd);

    const bonusTokens = isBuy ? baseTokens * (token.bonusRate / 100) : 0;
    const totalTokensReceived = baseTokens + bonusTokens;

    // Price impact simulation
    const impactFactor = isBuy ? 1 + Math.min(0.08, tradeUsd / 50000) : Math.max(0.94, 1 - tradeUsd / 60000);
    const newPrice = Number((token.priceUsd * impactFactor).toPrecision(6));
    const newMc = Math.round(token.marketCap * impactFactor);
    const newVol = Math.round(token.volume24h + tradeUsd);
    const newChange = Number(
      (token.change24h + (isBuy ? 1.4 : -1.1)).toFixed(1)
    );
    const updatedHistory = [...(token.priceHistory || []).slice(-11), newPrice];

    const [updatedToken] = await db
      .update(tokens)
      .set({
        priceUsd: newPrice,
        marketCap: newMc,
        volume24h: newVol,
        change24h: newChange,
        holdersCount: isBuy ? token.holdersCount + 1 : token.holdersCount,
        priceHistory: updatedHistory,
      })
      .where(eq(tokens.slug, tokenSlug))
      .returning();

    const randomHex = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const txHash = `0x${randomHex.slice(0, 4)}...${randomHex.slice(-4)}`;
    const now = new Date();
    const timeLabel = `${now.toLocaleString("en-US", { month: "short" })} ${now.getDate()}, ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const [createdActivity] = await db
      .insert(activities)
      .values({
        type: isBuy ? "Buy" : "Sell",
        account: walletAddress,
        tokenName: token.name,
        tokenTicker: token.ticker,
        tokenSlug: token.slug,
        amountUsd: Number(tradeUsd.toFixed(2)),
        tokenAmount: Number(totalTokensReceived.toFixed(2)),
        bonusTokens: Number(bonusTokens.toFixed(2)),
        pairAsset: token.pairAsset,
        txHash,
        timeLabel,
      })
      .returning();

    // Update or create holding for wallet
    const existingHoldings = await db
      .select()
      .from(holdings)
      .where(
        and(
          eq(holdings.walletAddress, walletAddress),
          eq(holdings.tokenSlug, tokenSlug)
        )
      );

    const payoutDividendUsd = tradeUsd * (token.payoutRate / 100);
    const addEthDividend =
      token.pairAsset === "ETH" ? payoutDividendUsd / ETH_PRICE_USD : 0;
    const addUsdgDividend = token.pairAsset !== "ETH" ? payoutDividendUsd : 0;

    let updatedHolding = null;

    if (existingHoldings.length > 0) {
      const current = existingHoldings[0];
      const nextBalance = isBuy
        ? current.balance + totalTokensReceived
        : Math.max(0, current.balance - baseTokens);
      const nextBonus = isBuy
        ? current.bonusReceived + bonusTokens
        : current.bonusReceived;

      const [res] = await db
        .update(holdings)
        .set({
          balance: nextBalance,
          bonusReceived: nextBonus,
          unclaimedEth: Number((current.unclaimedEth + addEthDividend).toFixed(5)),
          unclaimedUsdg: Number((current.unclaimedUsdg + addUsdgDividend).toFixed(2)),
          updatedAt: new Date(),
        })
        .where(eq(holdings.id, current.id))
        .returning();
      updatedHolding = res;
    } else if (isBuy) {
      const [res] = await db
        .insert(holdings)
        .values({
          walletAddress,
          tokenSlug: token.slug,
          tokenName: token.name,
          tokenTicker: token.ticker,
          pairAsset: token.pairAsset,
          balance: totalTokensReceived,
          bonusReceived: bonusTokens,
          avgBuyPrice: token.priceUsd,
          daysHeld: 1,
          holdMultiplier: 1.0,
          unclaimedEth: Number(addEthDividend.toFixed(5)),
          unclaimedUsdg: Number(addUsdgDividend.toFixed(2)),
          claimedTotalUsd: 0,
        })
        .returning();
      updatedHolding = res;
    }

    return NextResponse.json({
      token: updatedToken,
      activity: createdActivity,
      holding: updatedHolding,
    });
  } catch (error) {
    console.error("Swap error:", error);
    return NextResponse.json({ error: "Swap failed" }, { status: 500 });
  }
}
