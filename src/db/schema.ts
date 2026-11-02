import {
  pgTable,
  serial,
  text,
  doublePrecision,
  integer,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  ticker: text("ticker").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url").notNull(),
  creatorAddress: text("creator_address").notNull(),
  contractAddress: text("contract_address").notNull(),
  pairAsset: text("pair_asset").notNull().default("ETH"), // 'ETH' | 'USDG' | 'NVDA'
  priceUsd: doublePrecision("price_usd").notNull(),
  marketCap: doublePrecision("market_cap").notNull(),
  volume24h: doublePrecision("volume_24h").notNull(),
  change24h: doublePrecision("change_24h").notNull(),
  bonusRate: doublePrecision("bonus_rate").notNull(),
  payoutRate: doublePrecision("payout_rate").notNull(),
  payoutRecipient: text("payout_recipient").notNull().default("holders"), // 'holders' | 'creator'
  totalSupply: text("total_supply").notNull().default("1,000,000,000"),
  holdersCount: integer("holders_count").notNull().default(1),
  ageLabel: text("age_label").notNull().default("Just now"),
  isFeatured: boolean("is_featured").notNull().default(false),
  snipeProtection: boolean("snipe_protection").notNull().default(true),
  websiteUrl: text("website_url"),
  twitterUrl: text("twitter_url"),
  telegramUrl: text("telegram_url"),
  priceHistory: jsonb("price_history").$type<number[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'Buy' | 'Sell' | 'Payout' | 'Launch'
  account: text("account").notNull(),
  tokenName: text("token_name").notNull(),
  tokenTicker: text("token_ticker").notNull(),
  tokenSlug: text("token_slug").notNull(),
  amountUsd: doublePrecision("amount_usd").notNull(),
  tokenAmount: doublePrecision("token_amount").notNull(),
  bonusTokens: doublePrecision("bonus_tokens").notNull().default(0),
  pairAsset: text("pair_asset").notNull().default("ETH"),
  txHash: text("tx_hash").notNull(),
  timeLabel: text("time_label").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const holdings = pgTable("holdings", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  tokenSlug: text("token_slug").notNull(),
  tokenName: text("token_name").notNull(),
  tokenTicker: text("token_ticker").notNull(),
  pairAsset: text("pair_asset").notNull(),
  balance: doublePrecision("balance").notNull(),
  bonusReceived: doublePrecision("bonus_received").notNull(),
  avgBuyPrice: doublePrecision("avg_buy_price").notNull(),
  daysHeld: integer("days_held").notNull().default(5),
  holdMultiplier: doublePrecision("hold_multiplier").notNull().default(1.5),
  unclaimedEth: doublePrecision("unclaimed_eth").notNull().default(0),
  unclaimedUsdg: doublePrecision("unclaimed_usdg").notNull().default(0),
  claimedTotalUsd: doublePrecision("claimed_total_usd").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TokenRecord = typeof tokens.$inferSelect;
export type NewTokenRecord = typeof tokens.$inferInsert;
export type ActivityRecord = typeof activities.$inferSelect;
export type NewActivityRecord = typeof activities.$inferInsert;
export type HoldingRecord = typeof holdings.$inferSelect;
export type NewHoldingRecord = typeof holdings.$inferInsert;
