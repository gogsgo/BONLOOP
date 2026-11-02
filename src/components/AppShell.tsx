"use client";

import React, { useState } from "react";
import {
  Compass,
  PlusCircle,
  Wallet,
  Activity,
  Gift,
  BookOpen,
  Search,
  Globe,
  Plus,
  X,
  CheckCircle2,
  LogOut,
  Copy,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useRebateStore, type NavTab } from "@/store/useRebateStore";

interface AppShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "discover", label: "Discover", icon: Compass },
  { id: "launch", label: "Launch Token", icon: PlusCircle },
  { id: "portfolio", label: "Portfolio", icon: Wallet },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "guide", label: "How It Works", icon: BookOpen },
];

const WALLET_PROVIDERS = [
  {
    name: "Robinhood Wallet",
    badge: "RECOMMENDED",
    address: "0x71C...89A2",
    color: "from-[#8B5CF6] to-[#6D28D9]",
    desc: "Native Robinhood Chain L2 signer with 0-latency rebate indexing",
  },
  {
    name: "Rabby Wallet",
    badge: "POPULAR",
    address: "0x71C...89A2",
    color: "from-[#6366F1] to-[#4338CA]",
    desc: "Pre-sign bonus simulation & instant balance preview",
  },
  {
    name: "MetaMask",
    badge: "EVM",
    address: "0x385a...238f",
    color: "from-[#F59E0B] to-[#D97706]",
    desc: "Connect via Robinhood Chain RPC (Chain ID: 7771)",
  },
  {
    name: "Coinbase Smart Wallet",
    badge: "PASSKEY",
    address: "0x569d...289e",
    color: "from-[#3B82F6] to-[#1D4ED8]",
    desc: "Gas-sponsored smart account on Robinhood Chain",
  },
];

export function AppShell({ children }: AppShellProps) {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    tokens,
    openTokenSwap,
    isConnected,
    walletAddress,
    walletProviderName,
    ethBalance,
    usdgBalance,
    connectModalOpen,
    setConnectModalOpen,
    connectWallet,
    disconnectWallet,
    toasts,
    removeToast,
    addToast,
  } = useRebateStore();

  const [searchFocused, setSearchFocused] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);

  const searchResults = searchQuery.trim()
    ? tokens
        .filter(
          (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.contractAddress.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleCopyAddress = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("0x71C84f92aB310e89A2");
    }
    addToast({
      title: "Address Copied",
      subtitle: `${walletAddress} copied to clipboard`,
      type: "info",
    });
    setWalletDropdownOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#09080E] text-[#F8FAFC]">
      {/* Fixed Left Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-[224px] shrink-0 flex-col justify-between border-r border-white/[0.06] bg-[#0B0A10] fixed inset-y-0 left-0 z-30 select-none">
        <div>
          {/* Brand Logo */}
          <div className="h-16 px-5 flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab("discover")}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-7 h-7 rounded-lg bg-[#161224] border border-[#8B5CF6]/30 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.25)] group-hover:border-[#A855F7] transition-colors">
                <svg viewBox="0 0 32 32" className="w-4 h-4">
                  <path
                    d="M7 6 H17 C21 6 23.5 8.5 23.5 11.5 C23.5 14 21.8 15.8 19 16.5 L24 26 H19 L14.5 17 H12 V26 H7 Z M12 10 V13.5 H16.8 C18.2 13.5 19 12.7 19 11.7 C19 10.7 18.2 10 16.8 10 Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M7 20 C11 20 14 14 19.5 14 V11.5 L24.5 15.5 L19.5 19.5 V17 C15 17 12 22.5 7 22.5 Z"
                    fill="#A855F7"
                  />
                </svg>
              </div>
              <span className="font-bold tracking-tight text-[17px] text-white">
                Rebate <span className="text-[#A855F7]">Pad</span>
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 px-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[#1B162B] text-white border border-[#8B5CF6]/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                      : "text-[#948FA8] hover:text-white hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#A855F7]" : "text-[#7E7896]"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Chain Footer */}
        <div className="p-5 border-t border-white/[0.06]">
          <a
            href="#twitter"
            onClick={(e) => {
              e.preventDefault();
              addToast({
                title: "@rebatelaunch on X",
                subtitle: "Following Rebate Pad updates on Robinhood Chain",
                type: "info",
              });
            }}
            className="inline-flex items-center justify-center w-7 h-7 rounded-md text-[#7E7896] hover:text-white hover:bg-white/[0.05] transition-colors mb-3"
            title="Rebate Pad on X"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.14em] uppercase text-[#645E78]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span>LIVE ON ROBINHOOD CHAIN</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[224px] flex flex-col min-h-screen bg-dot-matrix pb-20 lg:pb-12">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 h-16 border-b border-white/[0.06] bg-[#0B0A10]/85 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between gap-3">
          {/* Mobile Brand */}
          <div className="flex lg:hidden items-center gap-2 mr-1">
            <button
              onClick={() => setActiveTab("discover")}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-[#161224] border border-[#8B5CF6]/40 flex items-center justify-center">
                <span className="font-bold text-xs text-[#A855F7]">R</span>
              </div>
            </button>
          </div>

          {/* Global Token Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#645E78] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tokens..."
                className="w-full h-9 pl-9 pr-8 rounded-lg bg-[#09080E] border border-white/[0.08] text-sm text-white placeholder-[#645E78] focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-[#645E78] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Instant Search Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-11 rounded-xl border border-white/[0.1] bg-[#12101B] shadow-2xl overflow-hidden z-50">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#645E78] border-b border-white/[0.06]">
                  Robinhood Chain Pools ({searchResults.length})
                </div>
                {searchResults.map((token) => (
                  <button
                    key={token.slug}
                    onMouseDown={() => {
                      openTokenSwap(token.slug);
                      setSearchFocused(false);
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-white/[0.05] transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={token.logoUrl}
                        alt={token.name}
                        className="w-7 h-7 rounded-md object-cover bg-[#1B162B]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {token.name}{" "}
                          <span className="text-[#7E7896] font-mono">
                            ${token.ticker}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-[#645E78]">
                          MC: ${(token.marketCap / 1000).toFixed(1)}K · Pair:{" "}
                          {token.pairAsset}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#C084FC]">
                        +{token.bonusRate}% bonus
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            {/* Network Badge */}
            <div className="hidden md:flex items-center gap-2 h-9 px-3.5 rounded-lg border border-white/[0.08] bg-[#12101B] text-xs">
              <Globe className="w-3.5 h-3.5 text-[#A855F7]" />
              <span className="text-[#7E7896]">Network:</span>
              <span className="font-semibold text-white">Robinhood Chain</span>
            </div>

            {/* Dynamic Connect Wallet / Connected Account Button */}
            {!isConnected ? (
              <button
                onClick={() => setConnectModalOpen(true)}
                className="h-9 px-3.5 rounded-lg border border-white/[0.1] bg-[#151221] hover:bg-[#1D192E] text-xs font-semibold text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5 text-[#C084FC]" />
                <span>Connect Wallet</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setWalletDropdownOpen((v) => !v)}
                  className="h-9 px-3 rounded-lg border border-[#8B5CF6]/40 bg-[#181329] hover:bg-[#211A38] text-xs font-mono text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[#C084FC] font-semibold">
                    {ethBalance.toFixed(2)} ETH
                    <span className="text-white/20">|</span>
                    ${usdgBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} USDG
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#8B5CF6]/25 text-white font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    {walletAddress}
                  </span>
                </button>

                {walletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/[0.1] bg-[#13101E] p-3 shadow-2xl z-50">
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.07]">
                      <div>
                        <div className="text-[11px] text-[#7E7896]">
                          {walletProviderName}
                        </div>
                        <div className="font-mono text-xs font-bold text-white">
                          {walletAddress}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] text-[10px] font-mono">
                        Connected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="rounded-lg bg-[#0B0912] p-2 border border-white/[0.05]">
                        <div className="text-[10px] font-mono text-[#7E7896]">
                          ETH BALANCE
                        </div>
                        <div className="font-mono text-xs font-bold text-white mt-0.5">
                          {ethBalance.toFixed(4)} ETH
                        </div>
                      </div>
                      <div className="rounded-lg bg-[#0B0912] p-2 border border-white/[0.05]">
                        <div className="text-[10px] font-mono text-[#7E7896]">
                          USDG BALANCE
                        </div>
                        <div className="font-mono text-xs font-bold text-white mt-0.5">
                          ${usdgBalance.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab("portfolio");
                          setWalletDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#D8B4FE] hover:bg-white/[0.05]"
                      >
                        <span>View Portfolio & Dividends</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleCopyAddress}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#948FA8] hover:text-white hover:bg-white/[0.05]"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Wallet Address</span>
                      </button>
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setWalletDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Disconnect Wallet</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Prominent Launch Token CTA */}
            <button
              onClick={() => setActiveTab("launch")}
              className="h-9 px-3.5 sm:px-4 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-xs font-semibold text-white flex items-center gap-1.5 shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Launch Token</span>
            </button>
          </div>
        </header>

        {/* Main View Container */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 border-t border-white/[0.08] bg-[#0B0A10]/95 backdrop-blur-xl grid grid-cols-6 px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium ${
                isActive ? "text-[#A855F7]" : "text-[#7E7896]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[56px]">
                {item.label === "Launch Token"
                  ? "Launch"
                  : item.label === "How It Works"
                  ? "Guide"
                  : item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Connect Wallet Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#12101B] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-[#C084FC]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Connect a Wallet
                  </h3>
                  <p className="text-xs text-[#7E7896]">
                    Robinhood Chain Mainnet · Instant Bonus & Payouts
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConnectModalOpen(false)}
                className="p-1.5 rounded-lg text-[#7E7896] hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 my-4">
              {WALLET_PROVIDERS.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => connectWallet(provider.name, provider.address)}
                  className="w-full p-3.5 rounded-xl border border-white/[0.07] bg-[#161324] hover:bg-[#1E1930] hover:border-[#8B5CF6]/50 transition-all flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${provider.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                    >
                      {provider.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-[#D8B4FE] transition-colors">
                          {provider.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.06] text-[#C084FC]">
                          {provider.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7E7896] mt-0.5">
                        {provider.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#645E78] group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/[0.06] p-3 text-[11px] text-[#948FA8] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
              <div>
                Demo wallet pre-loaded with{" "}
                <strong className="text-white font-mono">4.25 ETH</strong>,{" "}
                <strong className="text-white font-mono">$3,840.50 USDG</strong>,
                and active positions in{" "}
                <strong className="text-[#C084FC]">$REBATE, $APE, $RUBY, $HODL</strong>{" "}
                with claimable ETH/USDG dividends.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Stack */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-xl border border-[#8B5CF6]/40 bg-[#141122]/95 backdrop-blur-md p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-start justify-between gap-3 animate-in slide-in-from-bottom-3"
          >
            <div className="flex items-start gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  t.type === "success"
                    ? "text-[#22C55E]"
                    : t.type === "purple"
                    ? "text-[#C084FC]"
                    : "text-[#60A5FA]"
                }`}
              />
              <div>
                <div className="text-xs font-bold text-white">{t.title}</div>
                <div className="text-[11px] text-[#948FA8] mt-0.5 leading-snug">
                  {t.subtitle}
                </div>
                {t.txHash && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-[#A855F7]">
                    <span>Tx: {t.txHash}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-[#645E78] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
