import { NextResponse } from "next/server";
import { db } from "@/db";
import { tokens, activities, holdings } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/db-init";
import { DEFAULT_DEMO_WALLET, TOKEN_ARTWORKS } from "@/lib/seed-data";

export async function POST(request: Request) {
  try {
    await ensureDbSeeded();
    const body = await request.json();

    const {
      name,
      ticker,
      description,
      logoUrl,
      pairAsset = "ETH",
      bonusRate = 5,
      payoutRate = 2,
      payoutRecipient = "holders",
      totalSupply = "1,000,000,000",
      snipeProtection = true,
      websiteUrl = "",
      twitterUrl = "",
      telegramUrl = "",
      creatorAddress = DEFAULT_DEMO_WALLET,
    } = body;

    if (!name || !ticker) {
      return NextResponse.json(
        { error: "Token name and ticker are required" },
        { status: 400 }
      );
    }

    const cleanTicker = String(ticker).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "TKN";
    const slug = `${String(name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${Math.floor(100 + Math.random() * 900)}`;

    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const contractAddress = `0x${randomHex}88f1`;
    const txHash = `0x${randomHex.slice(0, 4)}...${randomHex.slice(-4)}`;

    const initialPrice = 0.000035;
    const initialMc = 35000;
    const now = new Date();
    const timeLabel = `${now.toLocaleString("en-US", { month: "short" })} ${now.getDate()}, ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const [createdToken] = await db
      .insert(tokens)
      .values({
        slug,
        name: String(name).trim(),
        ticker: cleanTicker,
        description:
          String(description || "").trim() ||
          `${name} ($${cleanTicker}) launched on BONLOOP on Robinhood Chain with +${bonusRate}% instant buyer bonus and ${payoutRate}% ${pairAsset} payouts.`,
        logoUrl: logoUrl || TOKEN_ARTWORKS.rebate,
        creatorAddress,
        contractAddress,
        pairAsset,
        priceUsd: initialPrice,
        marketCap: initialMc,
        volume24h: 2500,
        change24h: 12.5,
        bonusRate: Number(bonusRate),
        payoutRate: Number(payoutRate),
        payoutRecipient,
        totalSupply: String(totalSupply),
        holdersCount: 1,
        ageLabel: "Just now",
        isFeatured: true,
        snipeProtection: Boolean(snipeProtection),
        websiteUrl,
        twitterUrl,
        telegramUrl,
        priceHistory: [
          initialPrice * 0.85,
          initialPrice * 0.9,
          initialPrice * 0.95,
          initialPrice,
        ],
      })
      .returning();

    const [createdActivity] = await db
      .insert(activities)
      .values({
        type: "Launch",
        account: creatorAddress,
        tokenName: createdToken.name,
        tokenTicker: createdToken.ticker,
        tokenSlug: createdToken.slug,
        amountUsd: 2500,
        tokenAmount: 5000000,
        bonusTokens: 5000000 * (Number(bonusRate) / 100),
        pairAsset,
        txHash,
        timeLabel,
      })
      .returning();

    const [createdHolding] = await db
      .insert(holdings)
      .values({
        walletAddress: creatorAddress,
        tokenSlug: createdToken.slug,
        tokenName: createdToken.name,
        tokenTicker: createdToken.ticker,
        pairAsset,
        balance: 5000000 * (1 + Number(bonusRate) / 100),
        bonusReceived: 5000000 * (Number(bonusRate) / 100),
        avgBuyPrice: initialPrice,
        daysHeld: 1,
        holdMultiplier: 1.0,
        unclaimedEth: pairAsset === "ETH" ? 0.015 : 0,
        unclaimedUsdg: pairAsset !== "ETH" ? 38.5 : 0,
        claimedTotalUsd: 0,
      })
      .returning();

    return NextResponse.json({
      token: createdToken,
      activity: createdActivity,
      holding: createdHolding,
    });
  } catch (error) {
    console.error("Launch token error:", error);
    return NextResponse.json({ error: "Failed to launch token" }, { status: 500 });
  }
}
