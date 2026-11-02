"use client";

import { create } from "zustand";
import {
  INITIAL_TOKENS,
  INITIAL_ACTIVITIES,
  INITIAL_HOLDINGS,
  DEFAULT_DEMO_WALLET,
} from "@/lib/seed-data";

export type NavTab =
  | "discover"
  | "launch"
  | "portfolio"
  | "activity"
  | "rewards"
  | "guide";

export interface TokenItem {
  id?: number;
  slug: string;
  name: string;
  ticker: string;
  description: string;
  logoUrl: string;
  creatorAddress: string;
  contractAddress: string;
  pairAsset: string;
  priceUsd: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  bonusRate: number;
  payoutRate: number;
  payoutRecipient: string;
  totalSupply: string;
  holdersCount: number;
  ageLabel: string;
  isFeatured: boolean;
  snipeProtection: boolean;
  websiteUrl?: string | null;
  twitterUrl?: string | null;
  telegramUrl?: string | null;
  priceHistory: number[];
}

export interface ActivityItem {
  id?: number;
  type: string; // 'Buy' | 'Sell' | 'Payout' | 'Launch'
  account: string;
  tokenName: string;
  tokenTicker: string;
  tokenSlug: string;
  amountUsd: number;
  tokenAmount: number;
  bonusTokens: number;
  pairAsset: string;
  txHash: string;
  timeLabel: string;
}

export interface HoldingItem {
  id?: number;
  walletAddress: string;
  tokenSlug: string;
  tokenName: string;
  tokenTicker: string;
  pairAsset: string;
  balance: number;
  bonusReceived: number;
  avgBuyPrice: number;
  daysHeld: number;
  holdMultiplier: number;
  unclaimedEth: number;
  unclaimedUsdg: number;
  claimedTotalUsd: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  subtitle: string;
  type: "success" | "info" | "purple";
  txHash?: string;
}

interface RebateState {
  activeTab: NavTab;
  searchQuery: string;
  selectedTokenSlug: string | null;
  connectModalOpen: boolean;

  // Wallet State
  isConnected: boolean;
  walletAddress: string;
  walletProviderName: string;
  ethBalance: number;
  usdgBalance: number;

  // Protocol Indexer Metrics
  bonusTokensCreditedUsd: number;
  bonusTokensCreditedCountM: number;
  totalBuysCount: number;
  holderPayoutsUsd: number;
  payoutRounds: number;
  payoutPayments: number;
  rebateBurnedM: number;
  indexedBlock: number;

  // Data
  tokens: TokenItem[];
  activities: ActivityItem[];
  holdings: HoldingItem[];
  isLoadingData: boolean;
  toasts: ToastMessage[];

  // Actions
  setActiveTab: (tab: NavTab) => void;
  setSearchQuery: (q: string) => void;
  openTokenSwap: (slug: string | null) => void;
  setConnectModalOpen: (open: boolean) => void;
  connectWallet: (providerName?: string, customAddress?: string) => void;
  disconnectWallet: () => void;
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;

  // Async DB-synced actions
  fetchInitialState: () => Promise<void>;
  executeSwap: (params: {
    tokenSlug: string;
    side: "Buy" | "Sell";
    amountInEth?: number;
    amountUsd: number;
    tokenAmountSell?: number;
  }) => Promise<boolean>;
  launchToken: (params: {
    name: string;
    ticker: string;
    description: string;
    logoUrl: string;
    pairAsset: string;
    bonusRate: number;
    payoutRate: number;
    payoutRecipient: string;
    totalSupply: string;
    snipeProtection: boolean;
    websiteUrl?: string;
    twitterUrl?: string;
    telegramUrl?: string;
  }) => Promise<TokenItem | null>;
  claimRewards: (tokenSlug?: string) => Promise<boolean>;
  simulateLiveBlockEvent: () => void;
}

const ETH_PRICE_USD = 2500;

export const useRebateStore = create<RebateState>((set, get) => ({
  activeTab: "discover",
  searchQuery: "",
  selectedTokenSlug: null,
  connectModalOpen: false,

  isConnected: false,
  walletAddress: DEFAULT_DEMO_WALLET,
  walletProviderName: "Rabby / Robinhood Wallet",
  ethBalance: 4.25,
  usdgBalance: 3840.5,

  bonusTokensCreditedUsd: 55839.01,
  bonusTokensCreditedCountM: 434.09,
  totalBuysCount: 11955,
  holderPayoutsUsd: 11077.78,
  payoutRounds: 210,
  payoutPayments: 69966,
  rebateBurnedM: 4.69,
  indexedBlock: 104413961,

  tokens: INITIAL_TOKENS as TokenItem[],
  activities: INITIAL_ACTIVITIES as ActivityItem[],
  holdings: INITIAL_HOLDINGS as HoldingItem[],
  isLoadingData: false,
  toasts: [],

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  openTokenSwap: (slug) => set({ selectedTokenSlug: slug }),
  setConnectModalOpen: (open) => set({ connectModalOpen: open }),

  connectWallet: (providerName = "Robinhood Wallet", customAddress) => {
    const addr = customAddress || DEFAULT_DEMO_WALLET;
    set({
      isConnected: true,
      walletAddress: addr,
      walletProviderName: providerName,
      connectModalOpen: false,
    });
    get().addToast({
      title: "Wallet Connected on Robinhood Chain",
      subtitle: `${providerName} (${addr}) synced at block #${get().indexedBlock.toLocaleString()}`,
      type: "purple",
    });
  },

  disconnectWallet: () => {
    set({ isConnected: false });
    get().addToast({
      title: "Wallet Disconnected",
      subtitle: "Session cleared from Robinhood Chain RPC",
      type: "info",
    });
  },

  addToast: (toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((state) => ({
      toasts: [...state.toasts.slice(-3), { ...toast, id }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 5000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  fetchInitialState: async () => {
    set({ isLoadingData: true });
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.tokens?.length) {
          set({
            tokens: data.tokens,
            activities: data.activities || get().activities,
            holdings: data.holdings || get().holdings,
          });
        }
      }
    } catch (e) {
      console.error("Error fetching state:", e);
    } finally {
      set({ isLoadingData: false });
    }
  },

  executeSwap: async ({
    tokenSlug,
    side,
    amountInEth,
    amountUsd,
    tokenAmountSell,
  }) => {
    const state = get();
    const token = state.tokens.find((t) => t.slug === tokenSlug);
    if (!token) return false;

    const isBuy = side === "Buy";
    const ethDelta = amountUsd / ETH_PRICE_USD;

    // Optimistic balance update
    if (isBuy) {
      if (token.pairAsset === "ETH") {
        set({ ethBalance: Math.max(0, Number((state.ethBalance - ethDelta).toFixed(4))) });
      } else {
        set({
          usdgBalance: Math.max(0, Number((state.usdgBalance - amountUsd).toFixed(2))),
        });
      }
    } else {
      if (token.pairAsset === "ETH") {
        set({ ethBalance: Number((state.ethBalance + ethDelta).toFixed(4)) });
      } else {
        set({ usdgBalance: Number((state.usdgBalance + amountUsd).toFixed(2)) });
      }
    }

    try {
      const res = await fetch("/api/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenSlug,
          side,
          amountInEth,
          amountUsd,
          tokenAmountSell,
          walletAddress: state.walletAddress,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const bonusValUsd = isBuy ? amountUsd * (token.bonusRate / 100) : 0;
        const payoutValUsd = amountUsd * (token.payoutRate / 100);

        set((prev) => {
          const nextTokens = prev.tokens.map((t) =>
            t.slug === tokenSlug && data.token ? data.token : t
          );
          const nextActivities = data.activity
            ? [data.activity, ...prev.activities]
            : prev.activities;

          let nextHoldings = [...prev.holdings];
          if (data.holding) {
            const idx = nextHoldings.findIndex(
              (h) =>
                h.tokenSlug === tokenSlug &&
                h.walletAddress === prev.walletAddress
            );
            if (idx >= 0) {
              nextHoldings[idx] = data.holding;
            } else {
              nextHoldings.unshift(data.holding);
            }
          }

          return {
            tokens: nextTokens,
            activities: nextActivities,
            holdings: nextHoldings,
            bonusTokensCreditedUsd: Number(
              (prev.bonusTokensCreditedUsd + bonusValUsd).toFixed(2)
            ),
            totalBuysCount: isBuy ? prev.totalBuysCount + 1 : prev.totalBuysCount,
            holderPayoutsUsd: Number(
              (prev.holderPayoutsUsd + payoutValUsd).toFixed(2)
            ),
            indexedBlock: prev.indexedBlock + 1,
          };
        });

        const baseTokens = amountUsd / token.priceUsd;
        const bonusTokens = isBuy ? baseTokens * (token.bonusRate / 100) : 0;

        get().addToast({
          title: isBuy
            ? `Swapped $${amountUsd.toLocaleString()} for $${token.ticker}`
            : `Sold $${token.ticker} for $${amountUsd.toLocaleString()}`,
          subtitle: isBuy
            ? `Received ${(baseTokens + bonusTokens).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })} $${token.ticker} (incl. +${bonusTokens.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })} bonus tokens)`
            : `Proceeds credited to your ${token.pairAsset} balance`,
          type: "success",
          txHash: data.activity?.txHash,
        });

        return true;
      }
    } catch (e) {
      console.error("Swap failed:", e);
    }
    return false;
  },

  launchToken: async (params) => {
    const state = get();
    try {
      const res = await fetch("/api/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...params,
          creatorAddress: state.walletAddress,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        set((prev) => ({
          tokens: [data.token, ...prev.tokens],
          activities: data.activity
            ? [data.activity, ...prev.activities]
            : prev.activities,
          holdings: data.holding
            ? [data.holding, ...prev.holdings]
            : prev.holdings,
          indexedBlock: prev.indexedBlock + 2,
          rebateBurnedM: Number((prev.rebateBurnedM + 0.02).toFixed(2)),
        }));

        get().addToast({
          title: `Deployed $${data.token.ticker} Pool on Robinhood Chain!`,
          subtitle: `+${data.token.bonusRate}% buyer bonus & ${data.token.payoutRate}% ${data.token.pairAsset} payouts locked at launch.`,
          type: "purple",
          txHash: data.activity?.txHash,
        });

        return data.token;
      }
    } catch (e) {
      console.error("Launch error:", e);
    }
    return null;
  },

  claimRewards: async (tokenSlug) => {
    const state = get();

    // Calculate optimistic amounts first
    const targets = tokenSlug
      ? state.holdings.filter((h) => h.tokenSlug === tokenSlug)
      : state.holdings;

    const totalEthToClaim = targets.reduce((acc, h) => acc + h.unclaimedEth, 0);
    const totalUsdgToClaim = targets.reduce((acc, h) => acc + h.unclaimedUsdg, 0);
    const totalUsdValue = totalEthToClaim * ETH_PRICE_USD + totalUsdgToClaim;

    if (totalUsdValue <= 0) {
      get().addToast({
        title: "No Unclaimed Dividends",
        subtitle: "Hold tokens as trades occur to accumulate new ETH/USDG payouts.",
        type: "info",
      });
      return false;
    }

    // Optimistic state update: transfer unclaimed ETH & USDG directly to wallet balance
    set((prev) => ({
      ethBalance: Number((prev.ethBalance + totalEthToClaim).toFixed(4)),
      usdgBalance: Number((prev.usdgBalance + totalUsdgToClaim).toFixed(2)),
      holdings: prev.holdings.map((h) => {
        if (!tokenSlug || h.tokenSlug === tokenSlug) {
          const addUsd = h.unclaimedEth * ETH_PRICE_USD + h.unclaimedUsdg;
          return {
            ...h,
            unclaimedEth: 0,
            unclaimedUsdg: 0,
            claimedTotalUsd: Number((h.claimedTotalUsd + addUsd).toFixed(2)),
          };
        }
        return h;
      }),
      payoutRounds: prev.payoutRounds + 1,
      payoutPayments: prev.payoutPayments + targets.length,
      indexedBlock: prev.indexedBlock + 1,
    }));

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: state.walletAddress,
          tokenSlug,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.activity) {
          set((prev) => ({
            activities: [data.activity, ...prev.activities],
          }));
        }
      }
    } catch (e) {
      console.error("Claim sync error:", e);
    }

    get().addToast({
      title: `Claimed $${totalUsdValue.toFixed(2)} in Holder Dividends!`,
      subtitle: `Transferred ${
        totalEthToClaim > 0 ? `${totalEthToClaim.toFixed(4)} ETH` : ""
      }${totalEthToClaim > 0 && totalUsdgToClaim > 0 ? " + " : ""}${
        totalUsdgToClaim > 0 ? `${totalUsdgToClaim.toFixed(2)} USDG` : ""
      } to ${state.walletAddress}`,
      type: "success",
    });

    return true;
  },

  simulateLiveBlockEvent: () => {
    const state = get();
    if (!state.tokens.length) return;
    const randomToken =
      state.tokens[Math.floor(Math.random() * Math.min(8, state.tokens.length))];
    const isBuy = Math.random() > 0.25;
    const usdAmount = Number((12 + Math.random() * 240).toFixed(2));
    const baseTokens = usdAmount / randomToken.priceUsd;
    const bonusTokens = isBuy ? baseTokens * (randomToken.bonusRate / 100) : 0;
    const randomHex = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const acct = `0x${randomHex.slice(0, 4)}...${randomHex.slice(-4)}`;
    const now = new Date();
    const timeLabel = `${now.toLocaleString("en-US", { month: "short" })} ${now.getDate()}, ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newAct: ActivityItem = {
      id: Date.now(),
      type: isBuy ? "Buy" : "Sell",
      account: acct,
      tokenName: randomToken.name,
      tokenTicker: randomToken.ticker,
      tokenSlug: randomToken.slug,
      amountUsd: usdAmount,
      tokenAmount: Number((baseTokens + bonusTokens).toFixed(2)),
      bonusTokens: Number(bonusTokens.toFixed(2)),
      pairAsset: randomToken.pairAsset,
      txHash: acct,
      timeLabel,
    };

    set((prev) => ({
      activities: [newAct, ...prev.activities.slice(0, 99)],
      indexedBlock: prev.indexedBlock + 1,
      bonusTokensCreditedUsd: isBuy
        ? Number(
            (
              prev.bonusTokensCreditedUsd +
              usdAmount * (randomToken.bonusRate / 100)
            ).toFixed(2)
          )
        : prev.bonusTokensCreditedUsd,
      totalBuysCount: isBuy ? prev.totalBuysCount + 1 : prev.totalBuysCount,
      holdings: prev.holdings.map((h) => {
        if (h.tokenSlug === randomToken.slug) {
          const divAdd =
            (usdAmount * (randomToken.payoutRate / 100) * h.holdMultiplier) / 10;
          return {
            ...h,
            unclaimedEth:
              h.pairAsset === "ETH"
                ? Number((h.unclaimedEth + divAdd / ETH_PRICE_USD).toFixed(5))
                : h.unclaimedEth,
            unclaimedUsdg:
              h.pairAsset !== "ETH"
                ? Number((h.unclaimedUsdg + divAdd).toFixed(2))
                : h.unclaimedUsdg,
          };
        }
        return h;
      }),
    }));
  },
}));
