"use client";

import React, { useState } from "react";
import { TOKEN_ARTWORKS } from "@/lib/seed-data";
import {
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Sparkles,
  Lock,
  Shield,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { useRebateStore } from "@/store/useRebateStore";

type LaunchStep = "details" | "links" | "economics" | "review";

const PRESET_LOGOS = [
  { label: "Ruby Mascot", url: TOKEN_ARTWORKS.ruby },
  { label: "Rebate Cat", url: TOKEN_ARTWORKS.rcat },
  { label: "ROTH IPA", url: TOKEN_ARTWORKS.ipa },
  { label: "REBAPE", url: TOKEN_ARTWORKS.rebape },
  { label: "Cyber Wolf", url: TOKEN_ARTWORKS.rebog },
  { label: "Diamond HODL", url: TOKEN_ARTWORKS.hodl },
];

export function LaunchTokenView() {
  const {
    launchToken,
    openTokenSwap,
    setActiveTab,
    isConnected,
    connectWallet,
  } = useRebateStore();

  const [step, setStep] = useState<LaunchStep>("details");
  const [name, setName] = useState<string>("");
  const [ticker, setTicker] = useState<string>("");
  const [totalSupply, setTotalSupply] = useState<string>("1,000,000,000");
  const [description, setDescription] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>(TOKEN_ARTWORKS.rcat);
  const [fileName, setFileName] = useState<string>("No file chosen");

  // Links & Protection
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [twitterUrl, setTwitterUrl] = useState<string>("");
  const [telegramUrl, setTelegramUrl] = useState<string>("");
  const [snipeProtection, setSnipeProtection] = useState<boolean>(true);

  // Economics Sliders
  const [pairAsset, setPairAsset] = useState<"ETH" | "USDG">("ETH");
  const [bonusRate, setBonusRate] = useState<number>(5);
  const [payoutRate, setPayoutRate] = useState<number>(2);
  const [payoutRecipient, setPayoutRecipient] = useState<"holders" | "creator">(
    "holders"
  );

  // Deployment simulation state
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployStage, setDeployStage] = useState<string>("");

  // Enforce Bonus + Payout <= 9% rule from BONLOOP spec
  const handleBonusChange = (val: number) => {
    setBonusRate(val);
    if (val + payoutRate > 9) {
      setPayoutRate(Math.max(0, Number((9 - val).toFixed(1))));
    }
  };

  const handlePayoutChange = (val: number) => {
    setPayoutRate(val);
    if (bonusRate + val > 9) {
      setBonusRate(Math.max(2, Number((9 - val).toFixed(1))));
    }
  };

  // Calculate net buyer starting edge: bonusRate - payoutRate - 0.7% platform - 0.3% swap
  const buyerStartAdvantage = Number((bonusRate - payoutRate - 1.0).toFixed(2));
  const lockedTreasuryPct = Math.max(7, Math.ceil(bonusRate * 1.4));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeployContract = async () => {
    const finalName = name.trim() || "Pixel Otter";
    const finalTicker = ticker.trim().toUpperCase() || "POTR";

    if (!isConnected) {
      connectWallet("Robinhood Wallet");
    }

    setIsDeploying(true);
    setDeployStage("1/3 Compiling Immutable ERC-20 & Rebate Hook...");
    await new Promise((r) => setTimeout(r, 550));
    setDeployStage(`2/3 Locking ${lockedTreasuryPct}% Bonus Treasury Vault...`);
    await new Promise((r) => setTimeout(r, 550));
    setDeployStage(
      `3/3 Initializing $${finalTicker}/${pairAsset} Pool on Robinhood Chain...`
    );
    await new Promise((r) => setTimeout(r, 550));

    const created = await launchToken({
      name: finalName,
      ticker: finalTicker,
      description:
        description.trim() ||
        `${finalName} ($${finalTicker}) launched on BONLOOP with +${bonusRate}% instant purchase bonus and ${payoutRate}% ${pairAsset} holder dividends.`,
      logoUrl,
      pairAsset,
      bonusRate,
      payoutRate,
      payoutRecipient,
      totalSupply,
      snipeProtection,
      websiteUrl,
      twitterUrl,
      telegramUrl,
    });

    setIsDeploying(false);
    setDeployStage("");

    if (created) {
      setActiveTab("discover");
      openTokenSwap(created.slug);
    }
  };

  const steps: { id: LaunchStep; label: string }[] = [
    { id: "details", label: "Details" },
    { id: "links", label: "Links" },
    { id: "economics", label: "Economics" },
    { id: "review", label: "Review" },
  ];

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
      {/* Page Title */}
      <div className="mb-7">
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Launch a token
        </h1>
        <p className="text-sm text-[#777] mt-1.5">
          Four short steps. The last one deploys your token and its pool on
          Robinhood Chain from your wallet.
        </p>
      </div>

      {/* Step Indicator Pills (matching Reference Image 6) */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {steps.map((s, idx) => {
          const isCurrent = step === s.id;
          return (
            <React.Fragment key={s.id}>
              <button
                onClick={() => setStep(s.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isCurrent
                    ? "border-white/30 bg-[#21183C] text-[#D8B4FE] shadow-[0_0_16px_rgba(255,255,255,0.25)]"
                    : "border-white/[0.08] bg-[#12101B] text-[#555] hover:text-white"
                }`}
              >
                {s.label}
              </button>
              {idx < steps.length - 1 && (
                <div className="w-5 h-px bg-white/[0.1]" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main 2-Column Layout: Left Step Form + Right Live Economics & Smart Contract Deployer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Form Card */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#12101B] p-6 sm:p-8 shadow-2xl">
          {step === "details" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold text-white mb-2">
                    Token name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pixel Otter..."
                    maxLength={32}
                    className="w-full h-11 px-3.5 rounded-xl border border-white/[0.08] bg-[#080808] text-sm text-white placeholder-[#645E78] focus:outline-none focus:border-white/30"
                  />
                  <div className="text-[11px] text-[#555] mt-1.5">
                    2 to 32 characters
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-white mb-2">
                    Ticker
                  </label>
                  <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="POTR..."
                    maxLength={6}
                    className="w-full h-11 px-3.5 rounded-xl border border-white/[0.08] bg-[#080808] font-mono text-sm text-white placeholder-[#645E78] focus:outline-none focus:border-white/30"
                  />
                  <div className="text-[11px] text-[#555] mt-1.5">
                    2 to 6 characters
                  </div>
                </div>
              </div>

              {/* Total Supply Input */}
              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  Total Supply
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={totalSupply}
                    onChange={(e) => setTotalSupply(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-white/[0.08] bg-[#080808] font-mono text-sm text-white focus:outline-none focus:border-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setTotalSupply("1,000,000,000")}
                    className="shrink-0 h-11 px-3.5 rounded-xl border border-white/[0.08] bg-[#191528] text-xs font-mono text-white hover:bg-[#231D38]"
                  >
                    1B Standard
                  </button>
                </div>
                <div className="text-[11px] text-[#555] mt-1.5">
                  Fixed supply minted at deployment. Nothing can be minted later.
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={280}
                  placeholder="What is this token for? Who is it for?..."
                  className="w-full p-3.5 rounded-xl border border-white/[0.08] bg-[#080808] text-sm text-white placeholder-[#645E78] focus:outline-none focus:border-white/30 resize-none"
                />
                <div className="text-[11px] font-mono text-[#555] mt-1">
                  {description.length}/280
                </div>
              </div>

              {/* Artwork Upload & Preset Selector */}
              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  Artwork
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border border-white/[0.1] bg-[#080808] overflow-hidden flex items-center justify-center shrink-0">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Token preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#555]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <label className="px-3.5 py-2 rounded-lg border border-white/[0.1] bg-[#181426] hover:bg-[#221C35] text-xs font-semibold text-white cursor-pointer transition-colors">
                        <span>Choose File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-[#555] truncate max-w-[180px]">
                        {fileName}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-white mr-1">
                        Or pick a placeholder:
                      </span>
                      {PRESET_LOGOS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setLogoUrl(preset.url);
                            setFileName(preset.label);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                            logoUrl === preset.url
                              ? "border-white/30 bg-white/20 text-white"
                              : "border-white/[0.07] bg-[#080808] text-[#777] hover:text-white"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#555] mt-2">
                      Square image, PNG, JPEG, WebP or GIF, under 2 MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Navigation */}
              <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("discover")}
                  className="text-xs font-medium text-[#555] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep("links")}
                  className="h-10 px-5 rounded-xl bg-white hover:bg-white/80 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === "links" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-11 px-3.5 rounded-xl border border-white/[0.08] bg-[#080808] text-sm text-white placeholder-[#645E78] focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  X / Twitter URL (Optional)
                </label>
                <input
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/..."
                  className="w-full h-11 px-3.5 rounded-xl border border-white/[0.08] bg-[#080808] text-sm text-white placeholder-[#645E78] focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  Telegram URL (Optional)
                </label>
                <input
                  type="url"
                  value={telegramUrl}
                  onChange={(e) => setTelegramUrl(e.target.value)}
                  placeholder="https://t.me/..."
                  className="w-full h-11 px-3.5 rounded-xl border border-white/[0.08] bg-[#080808] text-sm text-white placeholder-[#645E78] focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Snipe Protection Toggle */}
              <div className="rounded-xl border border-white/[0.08] bg-[#080808] p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">
                      10-Second Anti-Snipe Protection
                    </div>
                    <p className="text-[11px] text-[#555] mt-1 leading-relaxed">
                      Starts at 99% snipe tax on block 0 and halves every 2
                      seconds. Snipe fees go directly to the holder payout pot.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={snipeProtection}
                  onChange={(e) => setSnipeProtection(e.target.checked)}
                  className="w-4 h-4 accent-[rgba(255,255,255,0.8)] mt-1 cursor-pointer"
                />
              </div>

              <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-xs font-medium text-[#555] hover:text-white cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep("economics")}
                  className="h-10 px-5 rounded-xl bg-white hover:bg-white/80 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Economics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === "economics" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">
                  Configure Rebate & Dividend Economics
                </h3>
                <p className="text-xs text-[#555] mt-1">
                  Rates are written into the smart contract at launch and can
                  never be changed later.
                </p>
              </div>

              {/* Pair Asset Selector */}
              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  Pair Asset (What buyers pay with & receive payouts in)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["ETH", "USDG"] as const).map((asset) => (
                    <button
                      key={asset}
                      type="button"
                      onClick={() => setPairAsset(asset)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        pairAsset === asset
                          ? "border-white/30 bg-[#21183C] text-white"
                          : "border-white/[0.08] bg-[#080808] text-[#555] hover:text-white"
                      }`}
                    >
                      <div className="font-mono text-sm font-bold text-white">
                        {asset}
                      </div>
                      <div className="text-[11px] text-[#777] mt-0.5">
                        {asset === "ETH"
                          ? "Robinhood Chain Native ETH dividends"
                          : "USDG Stablecoin dollar dividends"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Bonus % Slider */}
              <div className="rounded-xl border border-white/[0.07] bg-[#080808] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">
                    Initial Bonus % (Buyer Instant Bonus)
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    +{bonusRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={9}
                  step={0.5}
                  value={bonusRate}
                  onChange={(e) => handleBonusChange(parseFloat(e.target.value))}
                  className="bl-slider w-full"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#555] mt-1.5">
                  <span>2% Min</span>
                  <span>5% Recommended</span>
                  <span>9% Max</span>
                </div>
              </div>

              {/* Holder Payout Tax % Slider */}
              <div className="rounded-xl border border-white/[0.07] bg-[#080808] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">
                    Holder Payout Tax % ({pairAsset} Dividends)
                  </span>
                  <span className="font-mono text-sm font-bold text-[#22C55E]">
                    {payoutRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={7}
                  step={0.5}
                  value={payoutRate}
                  onChange={(e) => handlePayoutChange(parseFloat(e.target.value))}
                  className="bl-slider w-full"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#555] mt-1.5">
                  <span>0% None</span>
                  <span>2% Standard</span>
                  <span>Bonus + Payout ≤ 9%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("links")}
                  className="text-xs font-medium text-[#555] hover:text-white cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep("review")}
                  className="h-10 px-5 rounded-xl bg-white hover:bg-white/80 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Review Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <img
                  src={logoUrl}
                  alt="Preview"
                  className="w-14 h-14 rounded-xl object-cover border border-white/[0.1]"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {name.trim() || "Pixel Otter"}{" "}
                    <span className="font-mono text-sm text-white">
                      ${ticker.trim().toUpperCase() || "POTR"}
                    </span>
                  </h3>
                  <p className="text-xs text-[#777]">
                    Supply: {totalSupply} · Pair: {pairAsset} · Robinhood Chain
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-[#080808] p-4 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#555]">Instant Buyer Bonus:</span>
                  <span className="text-white font-bold">+{bonusRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">Holder Payout Tax:</span>
                  <span className="text-[#22C55E] font-bold">
                    {payoutRate}% in {pairAsset}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">Platform + Swap Fee:</span>
                  <span className="text-white">0.7% + 0.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">Locked Bonus Treasury:</span>
                  <span className="text-white">{lockedTreasuryPct}% of Supply</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">Snipe Protection:</span>
                  <span className="text-white">
                    {snipeProtection ? "Enabled (10s decay)" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("economics")}
                  className="text-xs font-medium text-[#555] hover:text-white cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleDeployContract}
                  disabled={isDeploying}
                  className="h-11 px-6 rounded-xl bg-white hover:bg-white/80 text-xs font-bold text-white flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-pointer disabled:opacity-50"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{deployStage || "Deploying..."}</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      <span>Deploy Smart Contract</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live "NEW LAUNCH · ECONOMICS" Interactive Card + Direct Deploy Button */}
        <div className="lg:col-span-5 rounded-2xl border border-white/[0.09] bg-[#13101E] p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-[#555]">
            <span>NEW LAUNCH · ECONOMICS</span>
            <span className="text-white">LIVE CONTRACT PREVIEW</span>
          </div>

          {/* Token Identity Pill */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.07]">
            <img
              src={logoUrl}
              alt="Logo"
              className="w-11 h-11 rounded-xl object-cover bg-[#080808] border border-white/[0.1]"
            />
            <div>
              <div className="text-base font-bold text-white">
                ${ticker.trim().toUpperCase() || "POTR"}{" "}
                <span className="text-xs font-normal text-[#777]">
                  ({name.trim() || "Pixel Otter"})
                </span>
              </div>
              <div className="text-xs font-mono text-[#555]">
                {totalSupply} supply · Locked at launch
              </div>
            </div>
          </div>

          {/* Pair Token Select */}
          <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0B0912] px-3.5 py-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">
              PAIR TOKEN
            </span>
            <select
              value={pairAsset}
              onChange={(e) => setPairAsset(e.target.value as "ETH" | "USDG")}
              aria-label="Select pair token"
              className="bg-transparent font-mono text-xs font-bold text-white outline-none cursor-pointer"
            >
              <option value="ETH" className="bg-[#12101B]">
                ETH (Robinhood Chain)
              </option>
              <option value="USDG" className="bg-[#12101B]">
                USDG (Stablecoin)
              </option>
            </select>
          </div>

          {/* Interactive Sliders always accessible in right preview */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-2">
              <span className="text-[#555]">INITIAL BONUS % (BUYERS)</span>
              <span className="text-white font-bold">{bonusRate}%</span>
            </div>
            <input
              type="range"
              min={2}
              max={9}
              step={0.5}
              value={bonusRate}
              onChange={(e) => handleBonusChange(parseFloat(e.target.value))}
              aria-label="Initial Bonus Percentage"
              className="bl-slider w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-2">
              <span className="text-[#555]">HOLDER PAYOUT TAX %</span>
              <span className="text-[#22C55E] font-bold">{payoutRate}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={7}
              step={0.5}
              value={payoutRate}
              onChange={(e) => handlePayoutChange(parseFloat(e.target.value))}
              aria-label="Holder Payout Tax Percentage"
              className="bl-slider w-full"
            />
          </div>

          {/* Payouts Go To & Buyers Start At Boxes (matching Image 2) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div
              onClick={() =>
                setPayoutRecipient((r) =>
                  r === "holders" ? "creator" : "holders"
                )
              }
              className="rounded-xl border border-white/[0.07] bg-[#0B0912] p-3.5 cursor-pointer hover:border-white/30/40 transition-colors"
            >
              <div className="text-[10px] font-mono uppercase text-[#555]">
                PAYOUTS GO TO
              </div>
              <div className="text-base font-bold text-white mt-1 capitalize">
                {payoutRecipient}
              </div>
              <div className="text-[10px] text-[#555] mt-0.5">
                Click to toggle
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-[#0B0912] p-3.5">
              <div className="text-[10px] font-mono uppercase text-[#555]">
                BUYERS START AT
              </div>
              <div
                className={`font-mono text-base font-bold mt-1 ${
                  buyerStartAdvantage >= 1
                    ? "text-[#22C55E]"
                    : "text-[#F59E0B]"
                }`}
              >
                {buyerStartAdvantage >= 0 ? `+${buyerStartAdvantage}%` : `${buyerStartAdvantage}%`}
              </div>
              <div className="text-[10px] text-[#555] mt-0.5">
                Net vs pre-trade price
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#22C55E]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Above the 1% minimum buyer edge, so this launch can go live.
            </span>
          </div>

          {/* Direct Deploy Smart Contract Button */}
          <button
            type="button"
            onClick={handleDeployContract}
            disabled={isDeploying}
            className="w-full h-12 rounded-xl bg-white hover:bg-white/80 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{deployStage || "Deploying Smart Contract..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Deploy Smart Contract</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#555]">
            <Lock className="w-3 h-3 text-white" />
            <span>
              Locks {lockedTreasuryPct}% supply in immutable bonus treasury
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
