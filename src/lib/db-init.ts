import { db, pool } from "@/db";
import { tokens, activities, holdings } from "@/db/schema";
import { INITIAL_TOKENS, INITIAL_ACTIVITIES, INITIAL_HOLDINGS } from "@/lib/seed-data";
import { count } from "drizzle-orm";

let initialized = false;

export async function ensureDbSeeded() {
  if (initialized) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tokens (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        ticker TEXT NOT NULL,
        description TEXT NOT NULL,
        logo_url TEXT NOT NULL,
        creator_address TEXT NOT NULL,
        contract_address TEXT NOT NULL,
        pair_asset TEXT NOT NULL DEFAULT 'ETH',
        price_usd DOUBLE PRECISION NOT NULL,
        market_cap DOUBLE PRECISION NOT NULL,
        volume_24h DOUBLE PRECISION NOT NULL,
        change_24h DOUBLE PRECISION NOT NULL,
        bonus_rate DOUBLE PRECISION NOT NULL,
        payout_rate DOUBLE PRECISION NOT NULL,
        payout_recipient TEXT NOT NULL DEFAULT 'holders',
        total_supply TEXT NOT NULL DEFAULT '1,000,000,000',
        holders_count INTEGER NOT NULL DEFAULT 1,
        age_label TEXT NOT NULL DEFAULT 'Just now',
        is_featured BOOLEAN NOT NULL DEFAULT false,
        snipe_protection BOOLEAN NOT NULL DEFAULT true,
        website_url TEXT,
        twitter_url TEXT,
        telegram_url TEXT,
        price_history JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        account TEXT NOT NULL,
        token_name TEXT NOT NULL,
        token_ticker TEXT NOT NULL,
        token_slug TEXT NOT NULL,
        amount_usd DOUBLE PRECISION NOT NULL,
        token_amount DOUBLE PRECISION NOT NULL,
        bonus_tokens DOUBLE PRECISION NOT NULL DEFAULT 0,
        pair_asset TEXT NOT NULL DEFAULT 'ETH',
        tx_hash TEXT NOT NULL,
        time_label TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS holdings (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        token_slug TEXT NOT NULL,
        token_name TEXT NOT NULL,
        token_ticker TEXT NOT NULL,
        pair_asset TEXT NOT NULL,
        balance DOUBLE PRECISION NOT NULL,
        bonus_received DOUBLE PRECISION NOT NULL,
        avg_buy_price DOUBLE PRECISION NOT NULL,
        days_held INTEGER NOT NULL DEFAULT 5,
        hold_multiplier DOUBLE PRECISION NOT NULL DEFAULT 1.5,
        unclaimed_eth DOUBLE PRECISION NOT NULL DEFAULT 0,
        unclaimed_usdg DOUBLE PRECISION NOT NULL DEFAULT 0,
        claimed_total_usd DOUBLE PRECISION NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    const [{ value: tokenCount }] = await db.select({ value: count() }).from(tokens);
    if (Number(tokenCount) === 0) {
      await db.insert(tokens).values(INITIAL_TOKENS).onConflictDoNothing();
    }

    const [{ value: activityCount }] = await db.select({ value: count() }).from(activities);
    if (Number(activityCount) === 0) {
      await db.insert(activities).values(INITIAL_ACTIVITIES);
    }

    const [{ value: holdingCount }] = await db.select({ value: count() }).from(holdings);
    if (Number(holdingCount) === 0) {
      await db.insert(holdings).values(INITIAL_HOLDINGS);
    }

    initialized = true;
  } catch (err) {
    console.error("Database initialization warning:", err);
  }
}
