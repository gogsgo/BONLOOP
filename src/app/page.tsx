"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LandingPage } from "@/components/LandingPage";
import { DiscoverView } from "@/components/DiscoverView";
import { LaunchTokenView } from "@/components/LaunchTokenView";
import { PortfolioView } from "@/components/PortfolioView";
import { ActivityView } from "@/components/ActivityView";
import { RewardsView } from "@/components/RewardsView";
import { GuideView } from "@/components/GuideView";
import { TokenSwapModal } from "@/components/TokenSwapModal";
import { useRebateStore } from "@/store/useRebateStore";

export default function HomePage() {
  const { activeTab, fetchInitialState } = useRebateStore();
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    fetchInitialState();
  }, [fetchInitialState]);

  if (!inApp) {
    return <LandingPage onEnter={() => setInApp(true)} />;
  }

  return (
    <AppShell>
      {activeTab === "discover" && <DiscoverView />}
      {activeTab === "launch" && <LaunchTokenView />}
      {activeTab === "portfolio" && <PortfolioView />}
      {activeTab === "activity" && <ActivityView />}
      {activeTab === "rewards" && <RewardsView />}
      {activeTab === "guide" && <GuideView />}
      <TokenSwapModal />
    </AppShell>
  );
}
